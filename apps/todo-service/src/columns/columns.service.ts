import { PrismaService } from '@app/common';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  CreateColumnData,
  DeleteColumnById,
  GetColumnById,
  stringToSlug,
  UpdateColumnData,
  UpdateColumnPosition,
} from '@app/todos';
import { getColumnId, getProjectId } from '../utils/get-prisma-ids.helper';
import { getShiftStrategy } from '../utils/prisma-shift-strategy.helper';
@Injectable()
export class ColumnsService {
  constructor(private prisma: PrismaService) {}

  async createColumnInProject(data: CreateColumnData) {
    const count = await this.prisma.column.count({
      where: { userId: data.userId, projectSlug: data.projectSlug },
    });

    const column: Prisma.ColumnCreateWithoutTasksInput = {
      slug: stringToSlug(data.column.label),
      label: data.column.label,
      position: count,
      project: {
        connect: {
          slug_userId: getProjectId(data),
        },
      },
    };

    return await this.prisma.column.create({
      data: column,
      select: {
        project: {
          select: {
            columns: {
              orderBy: {
                position: 'asc',
              },
            },
          },
        },
      },
    });
  }

  async changeColumnPositionInProject(data: UpdateColumnPosition) {
    //#region defining actualPosition, desiredPosition variables
    const { actualPosition, projectColumnCount } = await this.prisma.column
      .findUniqueOrThrow({
        where: {
          slug_projectSlug_userId: getColumnId(data),
        },
        select: {
          position: true,
          project: {
            select: {
              _count: { select: { columns: true } },
            },
          },
        },
      })
      .then((result) => ({
        actualPosition: result.position,
        projectColumnCount: result.project._count.columns,
      }));

    // check if desired position is specified correctly
    const desiredPosition =
      data.toPosition < projectColumnCount
        ? data.toPosition
        : projectColumnCount - 1;
    //#endregion

    const projectId = getProjectId(data);
    const columnId = getColumnId(data);
    const shiftColumns = this.shiftColumnPositionsBulkQuery(
      projectId,
      actualPosition,
      desiredPosition,
    );
    const updateTargetColumnPosition = this.updateTargetColumnPositonQuery(
      columnId,
      desiredPosition,
    );

    return await this.prisma
      .$transaction([shiftColumns, updateTargetColumnPosition])
      .then((result) => result[1].project.columns);
  }

  async updateCoumnInProject(data: UpdateColumnData) {
    return await this.prisma.column.update({
      where: {
        slug_projectSlug_userId: getColumnId(data),
      },
      data: data.update,
    });
  }

  async findExistColumnInProjectOrThrow(data: GetColumnById) {
    return await this.prisma.column.findUniqueOrThrow({
      where: {
        slug_projectSlug_userId: getColumnId(data),
      },
    });
  }

  async deleteColumnInProject(data: DeleteColumnById) {
    const columnId = getColumnId(data);
    const column = await this.prisma.column.findUniqueOrThrow({
      where: {
        slug_projectSlug_userId: columnId,
      },
    });

    const projectId = getProjectId(data);
    const shiftColumns = this.shiftColumnPositionsBulkQuery(
      projectId,
      column.position,
    );
    const deleteColumn = this.deleteColumnQuery(columnId);

    await this.prisma.$transaction([shiftColumns, deleteColumn]);

    return await this.prisma.column.findMany({
      where: { projectSlug: data.projectSlug, userId: data.userId },
    });
  }

  private shiftColumnPositionsBulkQuery(
    projectId: Prisma.ProjectSlugUserIdCompoundUniqueInput,
    actualPosition: number,
    desiredPosition: number = undefined,
  ) {
    const { where, data } = getShiftStrategy(actualPosition, desiredPosition);
    return this.prisma.column.updateMany({
      where: {
        projectSlug: projectId.slug,
        userId: projectId.userId,
        ...where,
      },
      data,
    });
  }

  private updateTargetColumnPositonQuery(
    columnId: Prisma.ColumnSlugProjectSlugUserIdCompoundUniqueInput,
    desiredPosition: number,
  ) {
    return this.prisma.column.update({
      where: {
        slug_projectSlug_userId: columnId,
      },
      data: {
        position: desiredPosition,
      },
      select: {
        project: {
          select: {
            columns: {
              orderBy: {
                position: 'asc',
              },
            },
          },
        },
      },
    });
  }

  private deleteColumnQuery(
    columnId: Prisma.ColumnSlugProjectSlugUserIdCompoundUniqueInput,
  ) {
    return this.prisma.column.delete({
      where: {
        slug_projectSlug_userId: columnId,
      },
    });
  }
}

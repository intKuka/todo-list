import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateColumnDto } from '../dto/columns/create-column.dto';
import { Prisma } from '@prisma/client';
import { UpdateColumnPositionDto } from '../dto/columns/update-column-position.dto';
import { ColumnDto } from '../dto/columns/column.dto';
import { ProjectsService } from 'src/projects/projects.service';
import {
  ColumnId,
  ProjectId,
} from 'src/common/custom-types/prisma-aliases.types';
import { getShiftStrategy } from 'src/common/helpers/prisma-shift-strategy.helper';

@Injectable()
export class ColumnsService {
  constructor(
    private prisma: PrismaService,
    private projects: ProjectsService,
  ) {}

  async createColumnInProject(
    projectId: ProjectId,
    slug: string,
    data: CreateColumnDto,
  ) {
    const { columns: columnsCount } =
      await this.projects.countInProject(projectId);

    const newData: Prisma.ColumnCreateWithoutProjectInput = {
      slug: slug,
      label: data.label,
      position: columnsCount,
    };

    const {
      project: { columns },
    } = await this.prisma.column.create({
      data: {
        ...newData,
        project: {
          connect: {
            slug_userId: projectId,
          },
        },
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

    return await Promise.all(columns.map((column) => new ColumnDto(column)));
  }

  async changeColumnPositionInProject(
    id: ColumnId,
    data: UpdateColumnPositionDto,
  ) {
    //#region defining actualPosition, desiredPosition variables
    const { actualPosition, projectColumnCount } = await this.prisma.column
      .findUniqueOrThrow({
        where: {
          slug_projectSlug_userId: id,
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
      data.position < projectColumnCount
        ? data.position
        : projectColumnCount - 1;
    //#endregion

    const projectId: ProjectId = {
      slug: id.projectSlug,
      userId: id.userId,
    };
    const shiftColumns = this.shiftColumnPositionsBulkQuery(
      projectId,
      actualPosition,
      desiredPosition,
    );
    const updateTargetColumnPosition = this.updateTargetColumnPositonQuery(
      id,
      desiredPosition,
    );

    const columns = await this.prisma
      .$transaction([shiftColumns, updateTargetColumnPosition])
      .then((result) => result[1].project.columns);

    return await Promise.all(columns.map((column) => new ColumnDto(column)));
  }

  async updateCoumnInProject(
    id: ColumnId,
    data: Prisma.ColumnUpdateWithoutProjectInput,
  ) {
    return await this.prisma.column.update({
      where: {
        slug_projectSlug_userId: id,
      },
      data: {
        ...data,
      },
    });
  }

  async findExistColumnInProjectOrThrow(id: ColumnId) {
    const column = await this.prisma.column.findUniqueOrThrow({
      where: {
        slug_projectSlug_userId: id,
      },
    });

    return column;
  }

  async countTasksInColumn(id: ColumnId) {
    return await this.prisma.column
      .findUniqueOrThrow({
        where: {
          slug_projectSlug_userId: id,
        },
        select: {
          _count: {
            select: {
              tasks: true,
            },
          },
        },
      })
      .then((result) => result._count.tasks);
  }

  async deleteColumnInProject(id: ColumnId) {
    const { position, projectSlug, userId } =
      await this.findExistColumnInProjectOrThrow(id);
    const projectId: ProjectId = {
      slug: projectSlug,
      userId: userId,
    };

    const shiftColumns = this.shiftColumnPositionsBulkQuery(
      projectId,
      position,
    );
    const deleteColumn = this.deleteColumnQuery(id);

    await this.prisma.$transaction([shiftColumns, deleteColumn]);

    return await this.projects
      .findColumnsInProject(projectId)
      .then((result) =>
        Promise.all(result.columns.map((column) => new ColumnDto(column))),
      );
  }

  private shiftColumnPositionsBulkQuery(
    projectId: ProjectId,
    actualPosition: number,
    desiredPosition: number = undefined,
  ) {
    const { where, data } = getShiftStrategy(actualPosition, desiredPosition);
    return this.prisma.column.updateMany({
      where: {
        project: {
          slug: projectId.slug,
          userId: projectId.userId,
        },
        ...where,
      },
      data: {
        ...data,
      },
    });
  }

  private updateTargetColumnPositonQuery(
    id: ColumnId,
    desiredPosition: number,
  ) {
    return this.prisma.column.update({
      where: {
        slug_projectSlug_userId: id,
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

  private deleteColumnQuery(id: ColumnId) {
    return this.prisma.column.delete({
      where: {
        slug_projectSlug_userId: id,
      },
    });
  }
}

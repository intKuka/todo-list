import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateColumnDto } from '../dto/columns/create-column.dto';
import { Prisma } from '@prisma/client';
import { UpdateColumnPositionDto } from '../dto/columns/update-column-position.dto';
import { ColumnDto } from '../dto/columns/column.dto';
import { ProjectsService } from 'src/projects/projects.service';
import { SameColumnPositionException } from 'src/common/exceptions/same-column-position.exception';

@Injectable()
export class ColumnsService {
  constructor(
    private prisma: PrismaService,
    private projects: ProjectsService,
  ) {}

  async createColumnInProject(
    projectId: Prisma.ProjectSlugUserIdCompoundUniqueInput,
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
    id: Prisma.ColumnSlugProjectSlugUserIdCompoundUniqueInput,
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

    if (desiredPosition === actualPosition)
      throw new SameColumnPositionException();

    const projectId: Prisma.ProjectSlugUserIdCompoundUniqueInput = {
      slug: id.projectSlug,
      userId: id.userId,
    };
    const shiftColumns = this.shiftColumnPotisionsBulkQuery(
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
    id: Prisma.ColumnSlugProjectSlugUserIdCompoundUniqueInput,
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

  async deleteColumnInProject(
    id: Prisma.ColumnSlugProjectSlugUserIdCompoundUniqueInput,
  ) {
    const { position, projectSlug, userId } =
      await this.findExistColumnInProjectOrThrow(id);
    const projectId: Prisma.ProjectSlugUserIdCompoundUniqueInput = {
      slug: projectSlug,
      userId: userId,
    };
    const shiftColumns = this.shiftColumnPotisionsBulkQuery(
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

  private shiftColumnPotisionsBulkQuery(
    projectId: Prisma.ProjectSlugUserIdCompoundUniqueInput,
    actualPosition: number,
    desiredPosition: number = undefined,
  ) {
    if (desiredPosition === undefined) {
      // column moves on the right end
      return this.prisma.column.updateMany({
        where: {
          project: {
            slug: projectId.slug,
            userId: projectId.userId,
          },
          position: {
            gt: actualPosition,
          },
        },
        data: {
          position: {
            decrement: 1,
          },
        },
      });
    } else if (actualPosition - desiredPosition < 0) {
      // column moves to the right
      return this.prisma.column.updateMany({
        where: {
          project: {
            slug: projectId.slug,
            userId: projectId.userId,
          },
          position: {
            gt: actualPosition,
            lte: desiredPosition,
          },
        },
        data: {
          position: {
            decrement: 1,
          },
        },
      });
    } else {
      // column moves to the left
      return this.prisma.column.updateMany({
        where: {
          project: {
            slug: projectId.slug,
            userId: projectId.userId,
          },
          position: {
            lt: actualPosition,
            gte: desiredPosition,
          },
        },
        data: {
          position: {
            increment: 1,
          },
        },
      });
    }
  }

  private updateTargetColumnPositonQuery(
    id: Prisma.ColumnSlugProjectSlugUserIdCompoundUniqueInput,
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

  private deleteColumnQuery(
    id: Prisma.ColumnSlugProjectSlugUserIdCompoundUniqueInput,
  ) {
    return this.prisma.column.delete({
      where: {
        slug_projectSlug_userId: id,
      },
    });
  }

  private async findExistColumnInProjectOrThrow(
    id: Prisma.ColumnSlugProjectSlugUserIdCompoundUniqueInput,
  ) {
    const column = await this.prisma.column.findUniqueOrThrow({
      where: {
        slug_projectSlug_userId: id,
      },
    });

    return column;
  }
}

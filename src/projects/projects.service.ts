import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectDto } from './dto/project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Prisma } from '@prisma/client';
import { stringToSlug } from 'src/common/helpers/work-with-slug.helper';
import { ProjectId } from 'src/common/custom-types/prisma-aliases.types';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async createProjectForUser(id: ProjectId, data: CreateProjectDto) {
    const initialColumns: Prisma.ColumnCreateWithoutProjectInput[] = [
      'To Do',
      'In Progress',
      'Done',
    ].map((label, index) => ({
      label: label,
      slug: stringToSlug(label),
      position: index,
    }));

    const project = await this.prisma.project.create({
      data: {
        ...id,
        ...data,
        columns: {
          create: initialColumns,
        },
      },
      include: {
        columns: {
          orderBy: {
            position: 'asc',
          },
        },
        _count: { select: { columns: true } },
      },
    });

    return new ProjectDto(project);
  }

  async findAllProjectsOfUser(userId: number) {
    return await this.prisma.project
      .findMany({
        where: {
          userId: userId,
        },
        include: {
          _count: {
            select: {
              columns: true,
            },
          },
        },
      })
      .then((projects) =>
        Promise.all(projects.map((project) => new ProjectDto(project))),
      );
  }

  async findProjectOfUserByTitle(id: ProjectId) {
    const project = await this.prisma.project.findUniqueOrThrow({
      where: {
        slug_userId: id,
      },
      include: {
        columns: {
          orderBy: {
            position: 'asc',
          },
          include: {
            tasks: {
              orderBy: {
                position: 'asc',
              },
            },
            _count: {
              select: {
                tasks: true,
              },
            },
          },
        },
        _count: {
          select: {
            columns: true,
          },
        },
      },
    });
    return new ProjectDto(project);
  }

  async updateProjectOfUserByTitle(id: ProjectId, data: UpdateProjectDto) {
    await this.prisma.project.update({
      where: {
        slug_userId: id,
      },
      data: data,
    });
  }

  async deleteProjectOfUserByTitle(id: ProjectId) {
    await this.prisma.project.delete({
      where: {
        slug_userId: id,
      },
    });
  }

  async countInProject(projectId: ProjectId) {
    const project = await this.prisma.project.findUniqueOrThrow({
      where: {
        slug_userId: projectId,
      },
      select: {
        _count: true,
      },
    });

    return project._count;
  }

  async findColumnsInProject(projectId: ProjectId) {
    return await this.prisma.project.findUniqueOrThrow({
      where: {
        slug_userId: projectId,
      },
      select: {
        columns: {
          orderBy: {
            position: 'asc',
          },
        },
      },
    });
  }
}

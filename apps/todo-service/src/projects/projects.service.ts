import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import {
  CreateProjectData,
  DeleteProjectById,
  GetProjectById,
  GetProjectsOfUser,
  stringToSlug,
  UpdateProjectData,
} from '@app/todos';
import { PrismaService } from '@app/common';
import { getProjectId } from '../utils/get-prisma-ids.helper';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async createProject(data: CreateProjectData) {
    const initialColumns: Prisma.ColumnCreateWithoutProjectInput[] = [
      'To Do',
      'In Progress',
      'Done',
    ].map((label, index) => ({
      label: label,
      slug: stringToSlug(label),
      position: index,
    }));

    return await this.prisma.project.create({
      data: {
        slug: stringToSlug(data.project.title),
        userId: data.userId,
        ...data.project,
        columns: {
          create: initialColumns,
        },
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
          },
        },
      },
    });
  }

  async findAllProjectsByUserId(data: GetProjectsOfUser) {
    return await this.prisma.project.findMany({
      where: {
        userId: data.userId,
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
          },
        },
      },
    });
  }

  async findProjectByTitleAndUserId(data: GetProjectById) {
    return await this.prisma.project.findUniqueOrThrow({
      where: {
        slug_userId: getProjectId(data),
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
          },
        },
      },
    });
  }

  async updateProjectByTitleAndUserId(data: UpdateProjectData) {
    await this.prisma.project.update({
      where: {
        slug_userId: getProjectId(data),
      },
      data: data.update,
    });
  }

  async deleteProjectOfUserByTitle(data: DeleteProjectById) {
    await this.prisma.project.delete({
      where: {
        slug_userId: getProjectId(data),
      },
    });
  }
}

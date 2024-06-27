import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectDto } from './dto/project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import projectErrorMessages from './constants/project-error.constants';
import { Prisma } from '@prisma/client';
import { stringToSlug } from 'src/common/helpers/work-with-slug.helper';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async createProjectForUser(
    id: Prisma.ProjectSlugUserIdCompoundUniqueInput,
    data: CreateProjectDto,
  ) {
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
          _count: { select: { columns: true } },
        },
      })
      .then((projects) =>
        Promise.all(projects.map((project) => new ProjectDto(project))),
      );
  }

  async findProjectOfUserByTitle(
    id: Prisma.ProjectSlugUserIdCompoundUniqueInput,
  ) {
    const project = await this.prisma.project.findUniqueOrThrow({
      where: {
        slug_userId: id,
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

  async updateProjectOfUserByTitle(
    id: Prisma.ProjectSlugUserIdCompoundUniqueInput,
    data: UpdateProjectDto,
  ) {
    await this.prisma.project.update({
      where: {
        slug_userId: id,
      },
      data: data,
    });
  }

  async deleteProjectOfUserByTitle(
    id: Prisma.ProjectSlugUserIdCompoundUniqueInput,
  ) {
    await this.prisma.project.delete({
      where: {
        slug_userId: id,
      },
    });
  }

  async countInProject(projectId: Prisma.ProjectSlugUserIdCompoundUniqueInput) {
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

  async findColumnsInProject(
    projectId: Prisma.ProjectSlugUserIdCompoundUniqueInput,
  ) {
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

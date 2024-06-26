import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectDto } from './dto/project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import projectErrorMessages from './constants/errors.constants';
import { Prisma } from '@prisma/client';
import { stringToSlug } from 'src/common/helpers/work-with-slug.helper';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async createProjectForUser(
    id: Prisma.ProjectSlugUserIdCompoundUniqueInput,
    data: CreateProjectDto,
  ) {
    await this.notExistsOrThrow(id);

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
      .then(
        async (projects) =>
          await Promise.all(projects.map((project) => new ProjectDto(project))),
      );
  }

  async findProjectOfUserByTitle(
    id: Prisma.ProjectSlugUserIdCompoundUniqueInput,
  ) {
    const project = await this.prisma.project.findUnique({
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
    if (!project) {
      throw new NotFoundException(projectErrorMessages.NOT_FOUND);
    }

    return new ProjectDto(project);
  }

  async updateProjectOfUserByTitle(
    id: Prisma.ProjectSlugUserIdCompoundUniqueInput,
    data: UpdateProjectDto,
  ) {
    await this.findExistProjectOrThrow(id);

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
    await this.findExistProjectOrThrow(id);

    await this.prisma.project.delete({
      where: {
        slug_userId: id,
      },
    });
  }

  async findExistProjectOrThrow(
    id: Prisma.ProjectSlugUserIdCompoundUniqueInput,
  ) {
    const project = await this.prisma.project.findUnique({
      where: {
        slug_userId: id,
      },
      include: {
        columns: true,
      },
    });
    if (!project) throw new NotFoundException(projectErrorMessages.NOT_FOUND);
    return project;
  }

  private async notExistsOrThrow(
    id: Prisma.ProjectSlugUserIdCompoundUniqueInput,
  ) {
    const project = await this.prisma.project.findUnique({
      where: {
        slug_userId: id,
      },
    });
    if (project) throw new ConflictException(projectErrorMessages.CONFLICT);
  }
}

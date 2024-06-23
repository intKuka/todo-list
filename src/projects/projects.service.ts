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
import { ProjectId } from 'src/common/types';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async createProjectForUser(id: ProjectId, data: CreateProjectDto) {
    await this.notExistsOrThrow(id);

    const project = await this.prisma.project.create({
      data: {
        userId: id.userId,
        slug: id.slug,
        ...data,
      },
      include: {
        user: true,
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
          user: true,
        },
      })
      .then((projects) => projects.map((project) => new ProjectDto(project)));
  }

  async findProjectOfUserByTitle(id: ProjectId) {
    const project = await this.prisma.project.findUnique({
      where: {
        slug_userId: id,
      },
      include: {
        user: true,
      },
    });
    if (!project) {
      throw new NotFoundException(projectErrorMessages.NOT_FOUND);
    }

    return new ProjectDto(project);
  }

  async updateProjectOfUserByTitle(id: ProjectId, data: UpdateProjectDto) {
    await this.existsOrThrow(id);

    await this.prisma.project.update({
      where: {
        slug_userId: id,
      },
      data: data,
    });
  }

  async deleteProjectOfUserByTitle(id: ProjectId) {
    await this.existsOrThrow(id);

    await this.prisma.project.delete({
      where: {
        slug_userId: id,
      },
    });
  }

  private async existsOrThrow(id: ProjectId): Promise<void> {
    const project = await this.prisma.project.findUnique({
      where: {
        slug_userId: id,
      },
    });
    if (!project) throw new NotFoundException(projectErrorMessages.NOT_FOUND);
  }

  private async notExistsOrThrow(projectId: ProjectId): Promise<void> {
    const project = await this.prisma.project.findUnique({
      where: {
        slug_userId: projectId,
      },
    });
    if (project) throw new ConflictException(projectErrorMessages.CONFLICT);
  }
}

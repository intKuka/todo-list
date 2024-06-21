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

type Slug_UserId = { slug: string; userId: number };

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async createProjectForUser(userId: number, data: CreateProjectDto) {
    if ((await this.isExists({ userId: userId, slug: data.slug })) === true) {
      throw new ConflictException(projectErrorMessages.CONFLICT);
    }

    const project = await this.prisma.project.create({
      data: {
        userId: userId,
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

  async findProjectOfUserByTitle(slug_userId: Slug_UserId) {
    const project = await this.prisma.project.findUnique({
      where: {
        slug_userId: slug_userId,
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

  async updateProjectOfUserByTitle(
    slug_userId: Slug_UserId,
    data: UpdateProjectDto,
  ) {
    if ((await this.isExists(slug_userId)) === false) {
      throw new NotFoundException(projectErrorMessages.NOT_FOUND);
    }

    await this.prisma.project.update({
      where: {
        slug_userId: slug_userId,
      },
      data: data,
    });
  }

  async deleteProjectOfUserByTitle(slug_userId: Slug_UserId) {
    if ((await this.isExists(slug_userId)) === false) {
      throw new NotFoundException(projectErrorMessages.NOT_FOUND);
    }

    await this.prisma.project.delete({
      where: {
        slug_userId: slug_userId,
      },
    });
  }

  private async isExists(slug_userId: Slug_UserId): Promise<boolean> {
    const project = await this.prisma.project.findUnique({
      where: {
        slug_userId: slug_userId,
      },
    });
    return Boolean(project);
  }
}

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/jwt-auth.guard';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GetSlugFromParam } from 'src/common/pipes/get-slug-from-param.pipe';
import { AssignSlugInBody } from 'src/common/pipes/assign-slug-to-body.pipe';
import { GetUserMetadata } from 'src/common/decorators/get-user-metadata.decorator';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectDto } from './dto/project.dto';

@ApiBearerAuth()
@ApiTags('Projects')
@UseGuards(AuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private projects: ProjectsService) {}

  @ApiOkResponse({ type: ProjectDto })
  @Post()
  async createUserProject(
    @GetUserMetadata('id') userId: number,
    @Body(new AssignSlugInBody('title'))
    dto: CreateProjectDto,
  ): Promise<ProjectDto> {
    dto.userId = userId;
    const result = await this.projects.createProjectForUser(userId, dto);
    return result;
  }

  @ApiOkResponse({ type: [ProjectDto] })
  @Get()
  async findAllUserProjects(
    @GetUserMetadata('id') userId: number,
  ): Promise<ProjectDto[]> {
    const result = await this.projects.findAllProjectsOfUser(userId);
    return result;
  }

  @ApiOkResponse({ type: ProjectDto })
  @Get(':title')
  async findUserProjectByTitle(
    @GetUserMetadata('id') userId: number,
    @Param('title', GetSlugFromParam) slug: string,
  ): Promise<ProjectDto> {
    const result = await this.projects.findProjectOfUserByTitle({
      slug,
      userId,
    });
    return result;
  }

  @Patch(':title')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateUserProjectByTitle(
    @GetUserMetadata('id') userId: number,
    @Param('title', GetSlugFromParam) slug: string,
    @Body(new AssignSlugInBody('title')) dto: UpdateProjectDto,
  ): Promise<void> {
    const result = await this.projects.updateProjectOfUserByTitle(
      { slug, userId },
      dto,
    );
    return result;
  }

  @Delete(':title')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUserProjectByTitle(
    @GetUserMetadata('id') userId: number,
    @Param('title', GetSlugFromParam) slug: string,
  ) {
    const result = await this.projects.deleteProjectOfUserByTitle({
      slug,
      userId,
    });

    return result;
  }
}

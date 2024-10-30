import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ProjectDto } from '../../../../../../libs/todos/src/models/project/dto/project.dto';
import { CreateProjectDto } from '../../../../../../libs/todos/src/models/project/dto/create-project.dto';
import { GetUserMetadata } from '../decorators/get-user-metadata.decorator';
import { GetSlug } from '../pipes/get-slug.pipe';
import { AssignSlugInBody } from '../pipes/assign-slug-to-body.pipe';
import { UpdateProjectDto } from '../../../../../../libs/todos/src/models/project/dto/update-project.dto';

@ApiBearerAuth()
@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  constructor(private projects: ProjectsService) {}

  @Post()
  @ApiOperation({ summary: 'Create project' })
  @ApiCreatedResponse({
    type: ProjectDto,
    description: 'Newly created project',
  })
  @ApiBadRequestResponse({ description: 'Validation fail' })
  async createUserProject(
    @GetUserMetadata('id') userId: number,
    @Body() dto: CreateProjectDto,
  ): Promise<ProjectDto> {
    return await this.projects.createProjectForUser(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: "List all of user's projects" })
  @ApiOkResponse({ type: [ProjectDto], description: 'Project list' })
  async findAllUserProjects(
    @GetUserMetadata('id') userId: number,
  ): Promise<ProjectDto[]> {
    const result = await this.projects.findAllProjectsOfUser(userId);
    return result;
  }

  @Get(':title')
  @ApiOperation({ summary: 'Get user project by title slug' })
  @ApiOkResponse({ type: ProjectDto, description: 'Found project' })
  @ApiNotFoundResponse({ description: 'Project not found' })
  @ApiParam({ name: 'title', description: 'project slug or actual title' })
  async findUserProjectByTitle(
    @GetUserMetadata('id') userId: number,
    @Param('title', GetSlug) projectSlug: string,
  ): Promise<ProjectDto> {
    const result = await this.projects.findProjectOfUserByTitle(
      userId,
      projectSlug,
    );
    return result;
  }

  @Patch(':title')
  @ApiOperation({ summary: 'Update user project by title slug' })
  @ApiNoContentResponse({ description: 'Updated successfully' })
  @ApiBadRequestResponse({ description: 'Validation fail' })
  @ApiNotFoundResponse({ description: 'Project not found' })
  @ApiParam({ name: 'title', description: 'project slug or actual title' })
  async updateUserProjectByTitle(
    @GetUserMetadata('id') userId: number,
    @Param('title', GetSlug) projectSlug: string,
    @Body(new AssignSlugInBody('title')) dto: UpdateProjectDto,
  ): Promise<void> {
    await this.projects.updateProjectOfUserByTitle(userId, projectSlug, dto);
  }

  @Delete(':title')
  @ApiOperation({ summary: 'Delete user project by title slug' })
  @ApiNoContentResponse({ description: 'Deleted successfully' })
  @ApiNotFoundResponse({ description: 'Project not found' })
  @ApiParam({ name: 'title', description: 'project slug or actual title' })
  async deleteUserProjectByTitle(
    @GetUserMetadata('id') userId: number,
    @Param('title', GetSlug) projectSlug: string,
  ): Promise<void> {
    await this.projects.deleteProjectOfUserByTitle(userId, projectSlug);
  }
}

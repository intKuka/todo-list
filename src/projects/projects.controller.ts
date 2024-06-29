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
import { AssignSlugInBody } from 'src/common/pipes/assign-slug-to-body.pipe';
import { GetUserMetadata } from 'src/common/decorators/get-user-metadata.decorator';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectDto } from './dto/project.dto';
import { GetSlug } from 'src/common/pipes/get-slug.pipe';

@ApiBearerAuth()
@ApiTags('Projects')
@UseGuards(AuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private projects: ProjectsService) {}

  @ApiOperation({ summary: 'Create project' })
  @ApiCreatedResponse({
    type: ProjectDto,
    description: 'Newly created project',
  })
  @ApiBadRequestResponse({ description: 'Validation fail' })
  @Post()
  async createUserProject(
    @GetUserMetadata('id') userId: number,
    @Body('title', GetSlug) slug: string,
    @Body() dto: CreateProjectDto,
  ): Promise<ProjectDto> {
    const result = await this.projects.createProjectForUser(
      { slug, userId },
      dto,
    );
    return result;
  }

  @ApiOperation({ summary: "List all of user's projects" })
  @ApiOkResponse({ type: [ProjectDto], description: 'Project list' })
  @Get()
  async findAllUserProjects(
    @GetUserMetadata('id') userId: number,
  ): Promise<ProjectDto[]> {
    const result = await this.projects.findAllProjectsOfUser(userId);
    return result;
  }

  @ApiOperation({ summary: 'Get user project by title slug' })
  @ApiOkResponse({ type: ProjectDto, description: 'Found project' })
  @ApiNotFoundResponse({ description: 'Project not found' })
  @ApiParam({ name: 'title', description: 'project slug or actual title' })
  @Get(':title')
  async findUserProjectByTitle(
    @GetUserMetadata('id') userId: number,
    @Param('title', GetSlug) slug: string,
  ): Promise<ProjectDto> {
    const result = await this.projects.findProjectOfUserByTitle({
      slug,
      userId,
    });
    return result;
  }

  @ApiOperation({ summary: 'Update user project by title slug' })
  @ApiNoContentResponse({ description: 'Updated successfully' })
  @ApiBadRequestResponse({ description: 'Validation fail' })
  @ApiNotFoundResponse({ description: 'Project not found' })
  @ApiParam({ name: 'title', description: 'project slug or actual title' })
  @Patch(':title')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateUserProjectByTitle(
    @GetUserMetadata('id') userId: number,
    @Param('title', GetSlug) slug: string,
    @Body(new AssignSlugInBody('title')) dto: UpdateProjectDto,
  ): Promise<void> {
    await this.projects.updateProjectOfUserByTitle({ slug, userId }, dto);
  }

  @ApiOperation({ summary: 'Delete user project by title slug' })
  @ApiNoContentResponse({ description: 'Deleted successfully' })
  @ApiNotFoundResponse({ description: 'Project not found' })
  @ApiParam({ name: 'title', description: 'project slug or actual title' })
  @Delete(':title')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUserProjectByTitle(
    @GetUserMetadata('id') userId: number,
    @Param('title', GetSlug) slug: string,
  ): Promise<void> {
    await this.projects.deleteProjectOfUserByTitle({ slug, userId });
  }
}

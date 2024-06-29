import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiMethodNotAllowedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/jwt-auth.guard';
import { TasksService } from '../services/tasks.service';
import { GetUserMetadata } from 'src/common/decorators/get-user-metadata.decorator';
import { GetSlug } from 'src/common/pipes/get-slug.pipe';
import { CreateTaskDto } from '../dto/tasks/create-task.dto';
import { UpdateTaskPositionDto } from '../dto/tasks/update-task-position.dto';
import { UpdateTaskDto } from '../dto/tasks/update-task.dto';
import { AllowTaskActions } from '../allow-task-actions.guard';

@ApiBearerAuth()
@ApiTags('Tasks')
@UseGuards(AuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private tasks: TasksService) {}

  @ApiOperation({ summary: 'Create task in project' })
  @ApiCreatedResponse({ description: 'Created successfully' })
  @ApiBadRequestResponse({ description: 'Validation fail' })
  @ApiNotFoundResponse({ description: 'Column not found' })
  @ApiParam({ name: 'title', description: 'project slug or actual title' })
  @Post()
  async createTaskInProject(
    @GetUserMetadata('id') userId: number,
    @Param('title', GetSlug) projectSlug: string,
    @Body('columnLabel', GetSlug) columnSlug: string,
    @Body() dto: CreateTaskDto,
  ) {
    const result = await this.tasks.createTaskInProject(
      {
        slug: columnSlug,
        projectSlug: projectSlug,
        userId,
      },
      dto,
    );
    return result;
  }

  @ApiOperation({ summary: 'Change task position in project' })
  @ApiNoContentResponse({ description: 'Position changed successfully' })
  @ApiBadRequestResponse({ description: 'Validation fail' })
  @ApiNotFoundResponse({ description: 'Task not found' })
  @ApiMethodNotAllowedResponse({ description: 'User policy violation' })
  @ApiParam({ name: 'title', description: 'project slug or actual title' })
  @ApiParam({ name: 'id', description: 'task id' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AllowTaskActions)
  @Patch(':id')
  async changeTaskPositionInProject(
    @GetUserMetadata('id') userId: number,
    @Param('title', GetSlug) projectSlug: string,
    @Param('id') taskId: number,
    @Body('columnLabel', GetSlug) columnSlug: string,
    @Body() dto: UpdateTaskPositionDto,
  ) {
    const result = await this.tasks.changeTaskPositionInProject(
      taskId,
      { slug: columnSlug, projectSlug, userId },
      dto,
    );
    return result;
  }

  @ApiOperation({ summary: 'Update task in project' })
  @ApiNoContentResponse({ description: 'Updated successfully' })
  @ApiBadRequestResponse({ description: 'Validation fail' })
  @ApiNotFoundResponse({ description: 'Task not found' })
  @ApiMethodNotAllowedResponse({ description: 'User policy violation' })
  @ApiParam({ name: 'title', description: 'project slug or actual title' })
  @ApiParam({ name: 'id', description: 'task id' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AllowTaskActions)
  @Put(':id')
  async updateTaskInProject(
    @GetUserMetadata('id') userId: number,
    @Param('title', GetSlug) projectSlug: string,
    @Param('id') taskId: number,
    @Body() dto: UpdateTaskDto,
  ) {
    await this.tasks.updateTaskInProject(
      taskId,
      { slug: projectSlug, userId },
      dto,
    );
  }

  @ApiOperation({ summary: 'Delete task in project' })
  @ApiNoContentResponse({ description: 'Deleted successfully' })
  @ApiNotFoundResponse({ description: 'Task not found' })
  @ApiMethodNotAllowedResponse({ description: 'User policy violation' })
  @ApiParam({ name: 'title', description: 'project slug or actual title' })
  @ApiParam({ name: 'id', description: 'task id' })
  @UseGuards(AllowTaskActions)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async deleteTaksInProject(
    @GetUserMetadata('id') userId: number,
    @Param('title', GetSlug) projectSlug: string,
    @Param('id') taskId: number,
  ) {
    await this.tasks.deleteTaksInProject(taskId, { slug: projectSlug, userId });
  }
}

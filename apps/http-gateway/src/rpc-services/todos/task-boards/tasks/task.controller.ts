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
import { GetUserMetadata } from '../../decorators/get-user-metadata.decorator';
import { AllowTaskActions } from 'apps/todo-service/src/task-boards/allow-task-actions.guard';
import { GetSlug } from '../../pipes/get-slug.pipe';
import { CreateTaskDto } from '@app/todos/models/tasks/dto/create-task.dto';
import { UpdateTaskPositionDto } from '@app/todos/models/tasks/dto/update-task-position.dto';
import { UpdateTaskDto } from '@app/todos/models/tasks/dto/update-task.dto';

@ApiBearerAuth()
@ApiTags('Tasks')
@Controller('tasks')
export class TasksController {
  constructor() {}

  @Post()
  @ApiOperation({ summary: 'Create task in project' })
  @ApiCreatedResponse({ description: 'Created successfully' })
  @ApiBadRequestResponse({ description: 'Validation fail' })
  @ApiNotFoundResponse({ description: 'Column not found' })
  @ApiParam({ name: 'title', description: 'project slug or actual title' })
  async createTaskInProject(
    @GetUserMetadata('id') userId: number,
    @Param('title', GetSlug) projectSlug: string,
    @Body('columnLabel', GetSlug) columnSlug: string,
    @Body() dto: CreateTaskDto,
  ) {}

  @Patch(':id')
  @ApiOperation({ summary: 'Change task position in project' })
  @ApiNoContentResponse({ description: 'Position changed successfully' })
  @ApiBadRequestResponse({ description: 'Validation fail' })
  @ApiNotFoundResponse({ description: 'Task not found' })
  @ApiMethodNotAllowedResponse({ description: 'User policy violation' })
  @ApiParam({ name: 'title', description: 'project slug or actual title' })
  @ApiParam({ name: 'id', description: 'task id' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AllowTaskActions)
  async changeTaskPositionInProject(
    @GetUserMetadata('id') userId: number,
    @Param('title', GetSlug) projectSlug: string,
    @Param('id') taskId: number,
    @Body('columnLabel', GetSlug) columnSlug: string,
    @Body() dto: UpdateTaskPositionDto,
  ) {}

  @Put(':id')
  @ApiOperation({ summary: 'Update task in project' })
  @ApiNoContentResponse({ description: 'Updated successfully' })
  @ApiBadRequestResponse({ description: 'Validation fail' })
  @ApiNotFoundResponse({ description: 'Task not found' })
  @ApiMethodNotAllowedResponse({ description: 'User policy violation' })
  @ApiParam({ name: 'title', description: 'project slug or actual title' })
  @ApiParam({ name: 'id', description: 'task id' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AllowTaskActions)
  async updateTaskInProject(
    @GetUserMetadata('id') userId: number,
    @Param('title', GetSlug) projectSlug: string,
    @Param('id') taskId: number,
    @Body() dto: UpdateTaskDto,
  ) {}

  @Delete(':id')
  @ApiOperation({ summary: 'Delete task in project' })
  @ApiNoContentResponse({ description: 'Deleted successfully' })
  @ApiNotFoundResponse({ description: 'Task not found' })
  @ApiMethodNotAllowedResponse({ description: 'User policy violation' })
  @ApiParam({ name: 'title', description: 'project slug or actual title' })
  @ApiParam({ name: 'id', description: 'task id' })
  @UseGuards(AllowTaskActions)
  async deleteTaksInProject(
    @GetUserMetadata('id') userId: number,
    @Param('title', GetSlug) projectSlug: string,
    @Param('id') taskId: number,
  ) {}
}

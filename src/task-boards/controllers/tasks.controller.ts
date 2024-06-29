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
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
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

  @ApiCreatedResponse()
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

  @ApiNoContentResponse()
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

  @ApiNoContentResponse()
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

  @ApiNoContentResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AllowTaskActions)
  @Delete(':id')
  async deleteTaksInProject(
    @GetUserMetadata('id') userId: number,
    @Param('title', GetSlug) projectSlug: string,
    @Param('id') taskId: number,
  ) {
    await this.tasks.deleteTaksInProject(taskId, { slug: projectSlug, userId });
  }
}

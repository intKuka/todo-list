import { Injectable } from '@nestjs/common';
import { UpdateTaskPositionDto } from '../../../../libs/todos/src/models/tasks/dto/update-task-position.dto';
import { UpdateTaskDto } from '../../../../libs/todos/src/models/tasks/dto/update-task.dto';
import { ColumnsService } from '../columns/columns.service';
import { PrismaService } from '@app/common';
import { CreateTaskDto } from '@app/todos/models/tasks/dto/create-task.dto';

@Injectable()
export class TasksService {
  constructor(
    private prisma: PrismaService,
    private columns: ColumnsService,
  ) {}

  async createTaskInProject(
    // columnId: ColumnId,
    data?: CreateTaskDto,
  ) {
    // const taskCount = await this.columns.countTasksInColumn(columnId);
    // const newData: Prisma.TaskCreateInput = {
    //   name: data.name,
    //   description: data.description,
    //   position: taskCount,
    //   column: { connect: { slug_projectSlug_userId: columnId } },
    // };
    // await this.prisma.task.create({
    //   data: newData,
    // });
  }

  async changeTaskPositionInProject(
    taskId?: number,
    // desiredColumn: ColumnId,
    data?: UpdateTaskPositionDto,
  ) {
    // const task = await this.prisma.task.findUniqueOrThrow({
    //   where: {
    //     id: taskId,
    //   },
    //   select: {
    //     columnSlug: true,
    //     projectSlug: true,
    //     userId: true,
    //     position: true,
    //   },
    // });
    // const actualColumn: ColumnId = {
    //   slug: task.columnSlug,
    //   projectSlug: task.projectSlug,
    //   userId: task.userId,
    // };
    // await this.prisma.$transaction(async () => {
    //   let initTaskPosition = task.position;
    //   if (actualColumn.slug !== desiredColumn.slug) {
    //     initTaskPosition = undefined;
    //     await this.shiftTaskPositionInColumnBulkQuery(
    //       actualColumn,
    //       task.position,
    //     );
    //   }
    //   await this.shiftTaskPositionInColumnBulkQuery(
    //     desiredColumn,
    //     initTaskPosition,
    //     data.position,
    //   );
    //   await this.updateTaskPositionQuery(taskId, desiredColumn, data.position);
    // });
  }

  async updateTaskInProject(
    taskId?: number,
    // projectId: ProjectId,
    data?: UpdateTaskDto,
  ) {
    // const task = await this.prisma.task.findUniqueOrThrow({
    //   where: {
    //     id: taskId,
    //   },
    //   select: {
    //     projectSlug: true,
    //     userId: true,
    //   },
    // });
    // // check if the task belongs to specified project
    // if (
    //   task.userId !== projectId.userId ||
    //   task.projectSlug !== projectId.slug
    // ) {
    //   throw new MethodNotAllowedException();
    // }
    // await this.prisma.task.update({
    //   where: {
    //     id: taskId,
    //   },
    //   data: data,
    // });
  }

  async deleteTaksInProject(
    taskId?: number,
    // projectId: ProjectId
  ) {
    // const task = await this.prisma.task.findUniqueOrThrow({
    //   where: {
    //     id: taskId,
    //   },
    //   select: {
    //     columnSlug: true,
    //     projectSlug: true,
    //     userId: true,
    //     position: true,
    //   },
    // });
    // // check if the task belongs to specified project
    // if (
    //   task.userId !== projectId.userId ||
    //   task.projectSlug !== projectId.slug
    // ) {
    //   throw new MethodNotAllowedException();
    // }
    // const columnId: ColumnId = {
    //   slug: task.columnSlug,
    //   projectSlug: task.projectSlug,
    //   userId: task.userId,
    // };
    // const shiftTaskOrder = this.shiftTaskPositionInColumnBulkQuery(
    //   columnId,
    //   task.position,
    // );
    // const deleteTask = this.prisma.task.delete({
    //   where: {
    //     id: taskId,
    //   },
    // });
    // await this.prisma.$transaction([shiftTaskOrder, deleteTask]);
  }

  async findTaskById(id?: number) {
    return await this.prisma.task.findUnique({
      where: {
        id: id,
      },
    });
  }

  private shiftTaskPositionInColumnBulkQuery(
    // columnId: ColumnId,
    from: number = undefined,
    to: number = undefined,
  ) {
    // const { where, data } = getShiftStrategy(from, to);
    // return this.prisma.task.updateMany({
    //   where: {
    //     column: {
    //       ...columnId,
    //     },
    //     ...where,
    //   },
    //   data: {
    //     ...data,
    //   },
    // });
  }

  private updateTaskPositionQuery(
    taskId: number,
    // desiredColumnId: ColumnId,
    desiredPosition: number,
  ) {
    // return this.prisma.task.update({
    //   where: {
    //     id: taskId,
    //   },
    //   data: {
    //     column: {
    //       connect: {
    //         slug_projectSlug_userId: desiredColumnId,
    //       },
    //     },
    //     position: desiredPosition,
    //   },
    // });
  }
}

import { Module } from '@nestjs/common';
import { RabbitMqModule } from '@app/common';
import { ProjectsController } from './projects/projects.controller';
import { ColumnsController } from './task-boards/columns/columns.controller';
import { ProjectsService } from './projects/projects.service';
import { TasksController } from './task-boards/tasks/task.controller';

@Module({
  imports: [
    RabbitMqModule.registerRmq(
      process.env.TODO_SERVICE_NAME,
      process.env.RABBITMQ_TODO_QUEUE,
    ),
  ],
  controllers: [ProjectsController, ColumnsController, TasksController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class TodosModule {}

import { Module } from '@nestjs/common';
import { ColumnsService } from './services/columns.service';
import { ColumnsController } from './controllers/columns.controller';
import { ProjectsModule } from 'src/projects/projects.module';
import { AuthModule } from 'src/auth/auth.module';
import { RouterModule } from '@nestjs/core';
import { TasksController } from './controllers/tasks.controller';
import { TasksService } from './services/tasks.service';

@Module({
  imports: [
    AuthModule,
    ProjectsModule,
    RouterModule.register([
      {
        path: 'projects/:title',
        module: TaskBoardsModule,
      },
    ]),
  ],
  controllers: [ColumnsController, TasksController],
  providers: [ColumnsService, TasksService],
})
export class TaskBoardsModule {}

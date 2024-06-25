import { Module } from '@nestjs/common';
import { ColumnsService } from './services/columns.service';
import { ColumnsController } from './controllers/columns.controller';
import { ProjectsModule } from 'src/projects/projects.module';
import { AuthModule } from 'src/auth/auth.module';
import { RouterModule } from '@nestjs/core';

@Module({
  imports: [
    AuthModule,
    RouterModule.register([
      {
        path: 'projects/:title',
        module: TaskBoardsModule,
      },
    ]),
  ],
  controllers: [ColumnsController],
  providers: [ColumnsService],
})
export class TaskBoardsModule {}

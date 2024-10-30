import { PrismaModule, RabbitMqModule } from '@app/common';
import { Module } from '@nestjs/common';
import { ProjectsModule } from './projects/projects.module';
import { ColumnsModule } from './columns/columns.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    RabbitMqModule,
    PrismaModule,
    ProjectsModule,
    ColumnsModule,
    TasksModule,
  ],
})
export class AppModule {}

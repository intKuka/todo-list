import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { TaskBoardsModule } from './task-boards/task-boards.module';
import { globaPipes } from './globals/pipes.global';
import { globalFilters } from './globals/filters.global';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: `.${process.env.NODE_ENV}.env` }),
    PrismaModule,
    UsersModule,
    AuthModule,
    ProjectsModule,
    TaskBoardsModule,
  ],
  providers: [...globalFilters, ...globaPipes],
})
export class AppModule {}

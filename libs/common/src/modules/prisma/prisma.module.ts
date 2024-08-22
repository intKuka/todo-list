import { Module } from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';
import { APP_FILTER } from '@nestjs/core';
import { PrismaExceptionFilter } from '../../filters/prisma-exception.filter';

@Module({
  imports: [],
  providers: [
    PrismaService,
    {
      provide: APP_FILTER,
      useClass: PrismaExceptionFilter,
    },
  ],
  exports: [PrismaService],
})
export class PrismaModule {}

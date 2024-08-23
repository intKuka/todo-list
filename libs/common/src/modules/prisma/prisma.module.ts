import { DynamicModule, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { APP_FILTER } from '@nestjs/core';
import { PrismaExceptionFilter } from '../../filters/prisma-exception.filter';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}

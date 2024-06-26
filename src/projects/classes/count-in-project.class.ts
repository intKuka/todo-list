import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Expose, plainToClass } from 'class-transformer';

export class CountInProject implements Prisma.ProjectCountOutputType {
  constructor(count: Prisma.ProjectCountOutputType) {
    return plainToClass(CountInProject, count, {
      excludeExtraneousValues: true,
    });
  }

  @ApiProperty({ example: 1 })
  @Expose()
  columns: number;
}

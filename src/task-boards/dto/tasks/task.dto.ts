import { ApiProperty } from '@nestjs/swagger';
import { Task } from '@prisma/client';
import { Expose, plainToClass } from 'class-transformer';

export class TaskDto implements Task {
  constructor(tasks: any) {
    return plainToClass(TaskDto, tasks, { excludeExtraneousValues: true });
  }

  @ApiProperty({ example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ example: 'task-name' })
  @Expose()
  name: string;

  @ApiProperty({ examples: ['this is a description', null] })
  @Expose()
  description: string;

  @ApiProperty({ example: 0 })
  @Expose()
  position: number;

  @ApiProperty({ example: new Date() })
  @Expose()
  createdAt: Date;

  columnSlug: string;
  projectSlug: string;
  userId: number;
}

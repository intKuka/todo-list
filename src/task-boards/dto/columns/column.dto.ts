import { ApiProperty } from '@nestjs/swagger';
import { Column, Prisma } from '@prisma/client';
import { Expose, Transform, Type, plainToClass } from 'class-transformer';
import { TaskDto } from '../tasks/task.dto';

export class ColumnDto implements Column {
  constructor(columns: any) {
    return plainToClass(ColumnDto, columns, { excludeExtraneousValues: true });
  }

  @ApiProperty({ example: 'Project column' })
  @Expose()
  label: string;

  @ApiProperty({ example: 'project-column' })
  @Expose()
  slug: string;

  @ApiProperty({ example: 0 })
  @Expose()
  position: number;

  @ApiProperty({ example: 1 })
  @Expose({ name: '_count' })
  @Transform(({ value }) => (value as Prisma.ColumnCountOutputType).tasks)
  taskCount: number;

  @ApiProperty({ type: [TaskDto] })
  @Expose()
  @Type(() => TaskDto)
  tasks: TaskDto[];

  projectSlug: string;

  userId: number;
}

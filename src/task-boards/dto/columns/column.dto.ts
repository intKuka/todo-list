import { ApiProperty } from '@nestjs/swagger';
import { Column } from '@prisma/client';
import { Expose, plainToClass } from 'class-transformer';

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

  projectSlug: string;

  userId: number;
}

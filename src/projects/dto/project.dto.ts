import { ApiProperty } from '@nestjs/swagger';
import { Prisma, Project } from '@prisma/client';
import { Expose, Transform, Type, plainToClass } from 'class-transformer';
import { ColumnDto } from 'src/task-boards/dto/columns/column.dto';

export class ProjectDto implements Project {
  constructor(project: any) {
    return plainToClass(ProjectDto, project, {
      excludeExtraneousValues: true,
    });
  }

  @ApiProperty({
    example: 'project-title',
    description: 'title slug',
  })
  @Expose()
  slug: string;

  @ApiProperty({ example: 1 })
  @Expose()
  userId: number;

  @ApiProperty({ example: 'project title' })
  @Expose()
  title: string;

  @ApiProperty({ examples: ['this is a description', null], nullable: true })
  @Expose()
  description: string;

  @ApiProperty({ example: new Date() })
  @Expose()
  createdAt: Date;

  @ApiProperty({ example: new Date() })
  @Expose()
  updatedAt: Date;

  @ApiProperty({ example: 1 })
  @Expose({ name: '_count' })
  @Transform(({ value }) => (value as Prisma.ProjectCountOutputType).columns)
  columnCount: number;

  @ApiProperty({ type: [ColumnDto] })
  @Expose()
  @Type(() => ColumnDto)
  columns: ColumnDto[];
}

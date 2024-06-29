import { ApiProperty } from '@nestjs/swagger';
import { Prisma, Project } from '@prisma/client';
import { Expose, Transform, Type, plainToClass } from 'class-transformer';
import { ColumnDto } from 'src/task-boards/dto/columns/column.dto';

export class ProjectDto implements Project {
  constructor(project: any) {
    return plainToClass(ProjectDto, project, {
      excludeExtraneousValues: true,
      groups: ['project'],
    });
  }

  @ApiProperty({ example: 'project-title' })
  @Expose({ groups: ['user', 'project'] })
  slug: string;

  @ApiProperty({ example: 1 })
  @Expose()
  userId: number;

  @ApiProperty({ example: 'project title' })
  @Expose({ groups: ['user', 'project'] })
  title: string;

  @ApiProperty({ examples: ['this is a description', null], nullable: true })
  @Expose({ groups: ['user', 'project'] })
  description: string;

  @ApiProperty({ example: new Date() })
  @Expose()
  createdAt: Date;

  @ApiProperty({ example: new Date() })
  @Expose()
  updatedAt: Date;

  @ApiProperty()
  @Expose({ name: '_count' })
  @Transform(({ value }) => (value as Prisma.ProjectCountOutputType).columns)
  columnCount: number;

  @ApiProperty({ type: [ColumnDto] })
  @Expose()
  @Type(() => ColumnDto)
  columns: ColumnDto[];
}

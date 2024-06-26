import { ApiProperty } from '@nestjs/swagger';
import { Project } from '@prisma/client';
import { Expose, Type, plainToClass } from 'class-transformer';
import { ColumnDto } from 'src/task-boards/dto/columns/column.dto';
import { CountInProject } from '../classes/count-in-project.class';

export class ProjectDto implements Project {
  constructor(project: any) {
    return plainToClass(ProjectDto, project, { excludeExtraneousValues: true });
  }

  @ApiProperty({ example: 'project-title' })
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

  @ApiProperty()
  @Expose({ name: '_count' })
  @Type(() => CountInProject)
  count: CountInProject;

  @ApiProperty({ type: [ColumnDto] })
  @Expose()
  @Type(() => ColumnDto)
  columns: ColumnDto[];
}

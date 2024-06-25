import { ApiProperty } from '@nestjs/swagger';
import { Project } from '@prisma/client';
import { Exclude, Expose, Type, plainToClass } from 'class-transformer';
import { ColumnDto } from 'src/task-boards/dto/columns/column.dto';
import { UserDto } from 'src/users/dto/user.dto';

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

  @ApiProperty({ example: 'this is a description', nullable: true })
  @Expose()
  description: string;

  @ApiProperty({ example: new Date() })
  @Expose()
  createdAt: Date;

  @ApiProperty({ example: new Date() })
  @Expose()
  updatedAt: Date;

  @ApiProperty({ example: 3 })
  @Expose()
  columnCount: number;

  @ApiProperty({ type: [ColumnDto] })
  @Expose()
  @Type(() => ColumnDto)
  columns: ColumnDto[];
}

import { ApiProperty } from '@nestjs/swagger';
import { Project } from '@prisma/client';
import { Exclude, Type, plainToClass } from 'class-transformer';
import { UserDto } from 'src/users/dto/user.dto';

export class ProjectDto implements Project {
  constructor(project: any) {
    return plainToClass(ProjectDto, project);
  }

  userId: number;

  @ApiProperty({ example: 'project title' })
  title: string;

  @ApiProperty({ example: 'project-title' })
  slug: string;

  @ApiProperty({ example: 'this is a description', nullable: true })
  description: string;

  @ApiProperty({ example: new Date() })
  createdAt: Date;

  @ApiProperty({ example: new Date() })
  updatedAt: Date;

  @ApiProperty({ type: UserDto })
  @Type(() => UserDto)
  user: UserDto;
}

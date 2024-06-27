import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Exclude, Expose, Type, plainToClass } from 'class-transformer';
import { ProjectDto } from 'src/projects/dto/project.dto';

export class UserDto implements User {
  constructor(user: any) {
    return plainToClass(UserDto, user, { groups: ['user'] });
  }
  @ApiProperty({ example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ example: 'example@gmail.com' })
  @Expose()
  email: string;

  @Exclude()
  password: string;

  @ApiProperty({ example: new Date() })
  @Expose()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}

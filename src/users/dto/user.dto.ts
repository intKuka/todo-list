import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Exclude, plainToClass } from 'class-transformer';

export class UserDto implements User {
  constructor(user: any) {
    return plainToClass(UserDto, user);
  }
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'example@gmail.com' })
  email: string;

  @Exclude()
  password: string;

  @ApiProperty({ example: new Date() })
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}

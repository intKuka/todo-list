import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserDto implements User {
  constructor(user: User) {
    Object.assign(this, user);
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

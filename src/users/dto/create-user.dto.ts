import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'example@gmail.com' })
  email: string;

  @ApiProperty({ example: 'changeme' })
  password: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
  @ApiProperty({ example: 'example@gmail.com', description: 'user email' })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({ example: 'changeme', description: 'user password' })
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}

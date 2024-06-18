import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @ApiProperty({ example: 'example@gmail.com' })
  readonly email: string;

  @ApiProperty({ example: 'changeme' })
  readonly password: string;
}

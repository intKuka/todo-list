import { ApiProperty } from '@nestjs/swagger';

export class GeteUserDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'example@gmail.com' })
  email: string;
}

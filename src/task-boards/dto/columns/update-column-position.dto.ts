import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class UpdateColumnPositionDto {
  @ApiProperty({ example: 0 })
  @Min(0)
  @IsInt()
  @IsNotEmpty()
  position: number;
}

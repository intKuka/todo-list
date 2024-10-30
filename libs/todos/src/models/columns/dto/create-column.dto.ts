import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateColumnDto {
  @ApiProperty({ examples: ['Project column', 'project-column'] })
  @IsString()
  @IsNotEmpty()
  label: string;
}

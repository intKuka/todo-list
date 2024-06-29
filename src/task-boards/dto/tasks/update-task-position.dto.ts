import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class UpdateTaskPositionDto {
  @ApiProperty({
    examples: ['Project column', 'project-column'],
    description: 'column in which the task should be placed',
  })
  @IsString()
  @IsNotEmpty()
  columnLabel: string;

  @ApiProperty({ example: 0 })
  @Min(0)
  @IsInt()
  @IsNotEmpty()
  position: number;
}

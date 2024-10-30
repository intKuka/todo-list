import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({
    examples: ['Column label', 'column-label'],
    description: 'column in which the task should be placed',
  })
  @IsString()
  @IsNotEmpty()
  columnLabel: string;

  @ApiProperty({ example: 'Task name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'this is a description', nullable: true })
  @IsString()
  @IsOptional()
  description?: string;
}

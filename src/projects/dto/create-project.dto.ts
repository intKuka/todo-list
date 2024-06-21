import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProjectDto {
  userId: number;
  slug: string;

  @ApiProperty({ example: 'project title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'this is a description', nullable: true })
  @IsString()
  @IsOptional()
  description?: string;
}

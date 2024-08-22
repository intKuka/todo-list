import { HttpStatus } from '@nestjs/common';
import { Result } from '../interfaces/result.interface';
import { ApiProperty } from '@nestjs/swagger';

export class SuccessResult<TData> implements Result {
  @ApiProperty({ example: HttpStatus.OK })
  status: HttpStatus;

  @ApiProperty({ example: true })
  readonly isSuccess: boolean;

  @ApiProperty({ example: SuccessResult<TData> })
  data?: TData;

  constructor(status: HttpStatus, data?: TData) {
    this.isSuccess = true;
    this.status = status;
    this.data = data;
  }
}

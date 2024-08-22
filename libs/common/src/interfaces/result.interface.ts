import { HttpStatus } from '@nestjs/common';

export interface Result {
  status: HttpStatus;
  readonly isSuccess: boolean;
  data?: any;
  error?: any;
}

import { HttpStatus } from '@nestjs/common';
import { Result } from '../interfaces/result.interface';
import { Request } from 'express';

export class HttpExceptionResult implements Result {
  status: HttpStatus;
  readonly isSuccess: boolean = false;
  error: {
    message: string | object;
    details?: string | object;
    path: string;
    method: string;
    timestamp: Date;
  };

  constructor(
    message: string | object,
    status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
    req: Request,
    details?: string | object,
  ) {
    this.status = status;
    this.error = {
      message,
      details,
      path: req.url,
      method: req.method,
      timestamp: new Date(),
    };
  }
}

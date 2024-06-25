import { HttpStatus } from '@nestjs/common';

export interface HttpExceptionResponse {
  statusCode: HttpStatus;
  error: string;
}

export interface CustomHttpExceptionResponse extends HttpExceptionResponse {
  path: string;
  method: string;
  timestamp: Date;
}

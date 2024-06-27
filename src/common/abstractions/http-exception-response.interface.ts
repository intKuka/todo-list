import { HttpStatus } from '@nestjs/common';

export interface HttpExceptionResponse {
  statusCode: HttpStatus;
  error?: string | object;
  message?: string | object;
}

export interface CustomHttpExceptionResponse extends HttpExceptionResponse {
  path: string;
  method: string;
  timestamp: Date;
}

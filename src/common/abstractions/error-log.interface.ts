import { Request } from 'express';
import { CustomHttpExceptionResponse } from './http-exception-response.interface';

export interface ErrorLog<T> {
  formatErrorLog(
    response: CustomHttpExceptionResponse,
    req: Request,
    exception: T,
  ): string;
}

import {
  CustomBaseTcpExceptionFilter,
  HttpExceptionResponse,
  HttpExceptionResult,
} from '@app/common';
import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { Request, Response } from 'express';
@Catch(HttpException)
export class HttpExceptionFilter extends CustomBaseTcpExceptionFilter<
  HttpException,
  void
> {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const request = host.switchToHttp().getRequest<Request>();
    const response = host.switchToHttp().getResponse<Response>();

    const exceptionResult = this.createExceptionResult(exception, request);
    this.writeExceptionToLog(exception);
    this.sendResponse(exceptionResult, response);
  }

  protected sendResponse(result: HttpExceptionResult, res: Response): void {
    res.status(result.status).json(result);
  }

  protected createExceptionResult(
    exception: HttpException,
    req: Request,
  ): HttpExceptionResult {
    const status = exception.getStatus();
    const errorResponse = exception.getResponse();
    const message =
      (errorResponse as HttpExceptionResponse).message || exception.message;
    const details = (errorResponse as HttpExceptionResponse).error;

    return new HttpExceptionResult(message, status, req, details);
  }
}

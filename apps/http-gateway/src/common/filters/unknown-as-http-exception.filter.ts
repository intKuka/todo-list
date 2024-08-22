import { CustomBaseTcpExceptionFilter, HttpExceptionResult } from '@app/common';
import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { Request, Response } from 'express';
@Catch(HttpException)
export class UnknownAsHttpExceptionFilter extends CustomBaseTcpExceptionFilter<
  unknown,
  void
> {
  catch(exception: unknown, host: ArgumentsHost): void {
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
    exception: any,
    req: Request,
  ): HttpExceptionResult {
    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    const message = 'Something went wrong';

    return new HttpExceptionResult(message, status, req);
  }
}

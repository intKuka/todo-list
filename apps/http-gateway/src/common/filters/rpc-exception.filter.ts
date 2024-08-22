import {
  CustomBaseTcpExceptionFilter,
  HttpExceptionResult,
  RpcExceptionMessage,
} from '@app/common';
import { ArgumentsHost, Catch } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

import { Request, Response } from 'express';
@Catch(RpcException)
export class RpcExceptionFilter extends CustomBaseTcpExceptionFilter<
  RpcException,
  void
> {
  catch(exception: RpcException, host: ArgumentsHost): void {
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
    exception: RpcException,
    req: Request,
  ): HttpExceptionResult {
    const { message, status, details } =
      exception.getError() as RpcExceptionMessage;

    return new HttpExceptionResult(message, status, req, details);
  }
}

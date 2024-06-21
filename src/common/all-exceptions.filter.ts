import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  RequestMethod,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
  CustomHttpExceptionResponse,
  HttpExceptionResponse,
} from './interfaces/http-exeption-response.interface';
import { error } from 'console';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const request = host.switchToHttp().getRequest<Request>();
    const response = host.switchToHttp().getResponse<Response>();

    let httpStatus: HttpStatus;
    let errorMessage: string;

    if (exception instanceof HttpException) {
      errorMessage = exception.message;
      httpStatus = exception.getStatus();
    } else {
      errorMessage = 'Something went wrong';
      httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    }

    const customErrorResponse = this.getErrorResponse(
      httpStatus,
      errorMessage,
      request,
    );
    const errorLog = this.getErrorLog(customErrorResponse, request, exception);
    console.error(errorLog);
    response.status(httpStatus).json(customErrorResponse);
  }

  private getErrorResponse = (
    status: HttpStatus,
    errorMessage: string,
    req: Request,
  ): CustomHttpExceptionResponse => ({
    statusCode: status,
    error: errorMessage,
    path: req.url,
    method: req.method,
    timestamp: new Date(),
  });

  private getErrorLog = (
    response: CustomHttpExceptionResponse,
    req: Request,
    exception: unknown,
  ): string => {
    const user = req['user'];
    const { statusCode, method, error, path } = response;

    const log = `\n\nResponse: ${method} ${path} -- status: ${statusCode}\n
    Caller: ${JSON.stringify(user ?? 'Not Signed In')}\n 
    ${exception instanceof HttpException ? exception.stack : error}\n\n`;

    return log;
  };
}

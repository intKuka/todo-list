import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CustomBaseExceptionFilter } from '../abstractions/custom-base-exception-filter.abstract';
import { ErrorLog } from '../abstractions/error-log.interface';
import {
  CustomHttpExceptionResponse,
  HttpExceptionResponse,
} from '../abstractions/http-exception-response.interface';
import { ErrorInfo } from '../types';
import { JsonWebTokenError } from '@nestjs/jwt';

@Catch()
export class AllExceptionFilter
  extends CustomBaseExceptionFilter
  implements ExceptionFilter, ErrorLog<any>
{
  catch(exception: unknown, host: ArgumentsHost) {
    const request = host.switchToHttp().getRequest<Request>();
    const response = host.switchToHttp().getResponse<Response>();

    console.log((exception as JsonWebTokenError).message);
    const httpException: HttpException =
      exception instanceof HttpException
        ? exception
        : ((error) => {
            console.error(error);
            return new HttpException(
              'Something went wrong',
              HttpStatus.INTERNAL_SERVER_ERROR,
            );
          })(exception);

    const errorResponse = httpException.getResponse();
    const { message, error } = errorResponse as HttpExceptionResponse;
    const errorInfo: ErrorInfo = {
      message: message || httpException.message,
    };
    if (error) errorInfo.error = error;

    const status = httpException.getStatus();

    const customErrorResponse = this.createErrorResponse(
      status,
      errorInfo,
      request,
    );

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      const log = this.formatErrorLog(customErrorResponse, request, exception);
      console.log(log);
      this.writeErrorLogToFile(log);
    }

    this.sendResponse(customErrorResponse, response);
  }

  formatErrorLog(
    response: CustomHttpExceptionResponse,
    req: Request,
    exception: HttpException | any,
  ): string {
    const user = req['user'];
    const { statusCode, method, message, path } = response;

    const log = `\n\nResponse: ${method} ${path} -- status: ${statusCode}\n
      Caller: ${JSON.stringify(user ?? 'Not Signed In')}\n
      ${exception instanceof HttpException ? exception.stack : message}\n\n`;

    return log;
  }
}

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';
import { CustomBaseExceptionFilter } from '../abstractions/custom-base-exception-filter.abstract';
import { ErrorLog } from '../abstractions/error-log.interface';
import { CustomHttpExceptionResponse } from '../abstractions/http-exception-response.interface';
import { ErrorInfo } from '../custom-types/common.types';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter
  extends CustomBaseExceptionFilter
  implements ExceptionFilter, ErrorLog<Prisma.PrismaClientKnownRequestError>
{
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const request = host.switchToHttp().getRequest<Request>();
    const response = host.switchToHttp().getResponse<Response>();

    const [status, message] = this.formatError(
      {
        modelName: exception.meta?.['modelName'],
        target: exception.meta?.['target'],
      },
      exception,
    );

    const errorResponse = this.createErrorResponse(status, message, request);

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      const log = this.formatErrorLog(errorResponse, request, exception);
      this.writeErrorLogToFile(log, 'prisma.errors.log');
    }

    this.sendResponse(errorResponse, response);
  }

  private formatError(
    meta: { modelName: unknown; target: unknown },
    exception: Prisma.PrismaClientKnownRequestError,
  ): [HttpStatus, ErrorInfo] {
    switch (exception.code) {
      case 'P2002':
        return [
          HttpStatus.BAD_REQUEST,
          {
            message: `${meta?.modelName} unique fields duplication`,
            error: {
              fields: meta?.target as object,
            },
          },
        ];
      case 'P2025':
        return [
          HttpStatus.NOT_FOUND,
          {
            message: meta?.modelName
              ? `${meta.modelName} not found`
              : exception.message,
          },
        ];
      default:
        console.error(exception);
        return [
          HttpStatus.INTERNAL_SERVER_ERROR,
          {
            message: 'An error occurred while accessing server data',
          },
        ];
    }
  }

  formatErrorLog(
    response: CustomHttpExceptionResponse,
    req: Request,
    exception: Prisma.PrismaClientKnownRequestError,
  ): string {
    const user = req['user'];
    const { statusCode, method, path } = response;

    const log = `\n\nResponse: ${method} ${path} -- status: ${statusCode}\n
      Caller: ${JSON.stringify(user ?? 'Not Signed In')}\n 
      Error ${exception.code}: ${exception.message}\n
      ${exception.stack}\n\n`;

    return log;
  }
}

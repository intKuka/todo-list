import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Observable, throwError } from 'rxjs';
import { CustomBaseRpcExceptionFilter } from './base/custom-base-rcp-exception.filter';
import { RpcExceptionMessage } from '../interfaces/rpc/rpc-exception-message.interface';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter extends CustomBaseRpcExceptionFilter<Prisma.PrismaClientKnownRequestError> {
  catch(
    exception: Prisma.PrismaClientKnownRequestError,
    host: ArgumentsHost,
  ): Observable<RpcExceptionMessage> {
    const exceptionResult = this.createExceptionMessage(exception);
    this.writeExceptionToLog(exception);

    return this.sendMessage(exceptionResult);
  }

  protected sendMessage(
    result: RpcExceptionMessage,
  ): Observable<RpcExceptionMessage> {
    return throwError(() => result);
  }

  protected createExceptionMessage(
    exception: Prisma.PrismaClientKnownRequestError,
  ): RpcExceptionMessage {
    const modelName = exception.meta?.modelName;
    const target = exception.meta?.target;

    switch (exception.code) {
      case 'P2002':
        return {
          message: modelName
            ? `${modelName} unique fields duplication`
            : 'Unique fields duplication',
          status: HttpStatus.BAD_REQUEST,
          details: {
            fields: target as object,
          },
        };
      case 'P2025':
        return {
          message: modelName ? `${modelName} not found` : exception.message,
          status: HttpStatus.NOT_FOUND,
        };
      default:
        return {
          message: 'An error occurred while accessing server data',
          status: HttpStatus.INTERNAL_SERVER_ERROR,
        };
    }
  }
}

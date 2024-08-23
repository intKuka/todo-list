import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { CustomBaseRpcExceptionFilter } from './base/custom-base-rcp-exception.filter';
import { RpcExceptionMessage } from '../interfaces/rpc/rpc-exception-message.interface';

@Catch()
export class UnknownAsRpcExceptionFilter extends CustomBaseRpcExceptionFilter<any> {
  catch(exception: any, host: ArgumentsHost): Observable<any> {
    const exceptionMessage = this.createExceptionMessage(exception);
    this.writeExceptionToLog(exception);

    return this.sendMessage(exceptionMessage);
  }

  protected createExceptionMessage(exception: any): RpcExceptionMessage {
    const message = 'Something went wrong';
    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    return {
      message,
      status,
    };
  }
}

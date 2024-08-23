import { ArgumentsHost, RpcExceptionFilter } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { RpcExceptionMessage } from '../../interfaces/rpc/rpc-exception-message.interface';
import { ExceptionLogging } from '../../interfaces/exception-logging.interface';

export abstract class CustomBaseRpcExceptionFilter<TException>
  implements
    RpcExceptionFilter<TException, RpcExceptionMessage>,
    ExceptionLogging
{
  abstract catch(
    exception: TException,
    host: ArgumentsHost,
  ): Observable<RpcExceptionMessage>;

  protected sendMessage(
    result: RpcExceptionMessage,
  ): Observable<RpcExceptionMessage> {
    return throwError(() => result);
  }

  protected abstract createExceptionMessage(
    exception: TException,
  ): RpcExceptionMessage;

  writeExceptionToLog(log: any): void {
    console.error(log);
  }
}

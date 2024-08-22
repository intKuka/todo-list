import { CustomBaseRpcExceptionFilter } from '@app/common';
import { JwtException } from '../exceptions/jwt.exception';
import { RpcExceptionMessage } from '@app/common/interfaces/rpc/rpc-exception-message.interface';
import { ArgumentsHost, Catch } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';

@Catch(JwtException)
export class JwtExceptionFilter extends CustomBaseRpcExceptionFilter<JwtException> {
  catch(
    exception: JwtException,
    host: ArgumentsHost,
  ): Observable<RpcExceptionMessage> {
    const exceptionMessage = this.createExceptionMessage(exception);
    return this.sendMessage(exceptionMessage);
  }

  protected sendMessage(
    result: RpcExceptionMessage,
  ): Observable<RpcExceptionMessage> {
    return throwError(() => result);
  }

  protected createExceptionMessage(
    exception: JwtException,
  ): RpcExceptionMessage {
    const { message, status, details } = exception;
    return { message, status, details };
  }
}

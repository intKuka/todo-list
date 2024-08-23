import { ArgumentsHost, Catch } from '@nestjs/common';
import { CustomRpcException } from '../exceptions/custom-rpc-exception';
import { CustomBaseRpcExceptionFilter } from './base/custom-base-rcp-exception.filter';
import { Observable } from 'rxjs';
import { RpcExceptionMessage } from '../interfaces/rpc/rpc-exception-message.interface';

@Catch(CustomRpcException)
export class CustomRpcExceptionFilter extends CustomBaseRpcExceptionFilter<CustomRpcException> {
  catch(
    exception: CustomRpcException,
    host: ArgumentsHost,
  ): Observable<RpcExceptionMessage> {
    const errorMessage = this.createExceptionMessage(exception);
    this.writeExceptionToLog(exception);
    return this.sendMessage(errorMessage);
  }
  protected createExceptionMessage(
    exception: CustomRpcException,
  ): RpcExceptionMessage {
    return exception.getError();
  }
}

import { RpcException } from '@nestjs/microservices';
import { RpcExceptionMessage } from '../interfaces/rpc/rpc-exception-message.interface';

export abstract class CustomRpcException extends RpcException {
  constructor(message: RpcExceptionMessage) {
    super(message);
  }

  getError(): RpcExceptionMessage {
    return super.getError() as RpcExceptionMessage;
  }
}

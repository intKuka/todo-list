import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { ConfigService } from '../../config/config.service';
import { CustomGatewayTimeoutException } from '../exceptions/custom-gateway-timeout.exception';

@Injectable()
export class UpstreamServerResponseInterceptor implements NestInterceptor {
  constructor(private config: ConfigService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      timeout(this.config.get('rpcResponseTimeoutInMs')),
      catchError((error) => {
        if (error instanceof TimeoutError) {
          throw new CustomGatewayTimeoutException();
        } else {
          throw new RpcException(error);
        }
      }),
    );
  }
}

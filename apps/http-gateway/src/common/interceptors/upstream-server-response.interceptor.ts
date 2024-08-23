import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { CustomGatewayTimeoutException } from '../exceptions/custom-gateway-timeout.exception';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UpstreamServerResponseInterceptor implements NestInterceptor {
  constructor(private configService: ConfigService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const TIMEOUT = +this.configService.getOrThrow(
      'UPSTREAM_SERVER_TIMEOUT_IN_MS',
    );
    return next.handle().pipe(
      timeout(TIMEOUT),
      catchError((error) => {
        console.error(error);
        if (error instanceof TimeoutError) {
          throw new CustomGatewayTimeoutException();
        } else if (error instanceof HttpException) {
          throw error;
        } else {
          throw new RpcException(error);
        }
      }),
    );
  }
}

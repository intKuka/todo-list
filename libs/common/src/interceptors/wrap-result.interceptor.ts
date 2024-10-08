import { SuccessResult } from '@app/common';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class WrapResultInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<SuccessResult<any>> {
    return next.handle().pipe(
      map((result) => {
        const status =
          this.reflector.get<HttpStatus>(
            'success-status',
            context.getHandler(),
          ) || HttpStatus.OK;
        return new SuccessResult(status, result);
      }),
      catchError((error) => {
        // console.error(error);
        if (error instanceof RpcException) {
          return throwError(() => error);
        } else {
          throw error;
        }
      }),
    );
  }
}

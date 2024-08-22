import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { WrapResultInterceptor } from '../interceptors/wrap-result.interceptor';
import { UnknownAsRpcExceptionFilter } from '../filters/unknown-as-rpc-exception.filter';

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: WrapResultInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: UnknownAsRpcExceptionFilter,
    },
  ],
})
export class RpcSharedModule {}

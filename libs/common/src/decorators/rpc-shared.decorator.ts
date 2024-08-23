import { applyDecorators, UseFilters, UseInterceptors } from '@nestjs/common';
import { WrapResultInterceptor } from '../interceptors/wrap-result.interceptor';
import { UnknownAsRpcExceptionFilter } from '../filters/unknown-as-rpc-exception.filter';
import { CustomRpcExceptionFilter } from '../filters/custom-rpc-exception.filter';

export function RpcShared() {
  return applyDecorators(
    UseInterceptors(WrapResultInterceptor),
    UseFilters(UnknownAsRpcExceptionFilter, CustomRpcExceptionFilter),
  );
}

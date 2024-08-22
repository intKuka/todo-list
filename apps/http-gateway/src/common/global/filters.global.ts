import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from '../filters/http-exception.filter';
import { UnknownAsHttpExceptionFilter } from '../filters/unknown-as-http-exception.filter';
import { Provider } from '@nestjs/common';
import { RpcExceptionFilter } from '../filters/rpc-exception.filter';

export const globalFilters: Provider[] = [
  {
    provide: APP_FILTER,
    useClass: UnknownAsHttpExceptionFilter,
  },
  {
    provide: APP_FILTER,
    useClass: HttpExceptionFilter,
  },
  {
    provide: APP_FILTER,
    useClass: RpcExceptionFilter,
  },
];

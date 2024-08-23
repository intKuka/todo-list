import { UnknownAsHttpExceptionFilter } from '../common/filters/unknown-as-http-exception.filter';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';
import { RpcExceptionFilter } from '../common/filters/rpc-exception.filter';
import { APP_FILTER } from '@nestjs/core';
import { Provider } from '@nestjs/common';

export const APP_FILTERS: Provider[] = [
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

import { APP_INTERCEPTOR } from '@nestjs/core';
import { UpstreamServerResponseInterceptor } from '../common/interceptors/upstream-server-response.interceptor';
import { Provider } from '@nestjs/common';

export const APP_INTERCEPTORS: Provider[] = [
  {
    provide: APP_INTERCEPTOR,
    useClass: UpstreamServerResponseInterceptor,
  },
];

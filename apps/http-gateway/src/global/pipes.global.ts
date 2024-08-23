import { Provider, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';

export const APP_PIPES: Provider[] = [
  {
    provide: APP_PIPE,
    useFactory: () =>
      new ValidationPipe({
        transform: true,
        validateCustomDecorators: true,
        whitelist: true,
        stopAtFirstError: true,
      }),
  },
];

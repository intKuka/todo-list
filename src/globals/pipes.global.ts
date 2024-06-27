import { ValidationPipe } from '@nestjs/common';

const ValidationPipeProvider = {
  provide: 'APP_PIPE',
  useFactory: () =>
    new ValidationPipe({
      transform: true,
      validateCustomDecorators: true,
      whitelist: true,
      stopAtFirstError: true,
    }),
};

export const globaPipes = [ValidationPipeProvider];

import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../common/guards/auth.guard';
import { Provider } from '@nestjs/common';

export const APP_GUARDS: Provider[] = [
  {
    provide: APP_GUARD,
    useClass: AuthGuard,
  },
];

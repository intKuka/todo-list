import { Module, ValidationPipe } from '@nestjs/common';
import { globalFilters } from './common/global/filters.global';
import { ConfigModule } from './config/config.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { AuthGuard } from './jwt-auth.guard';
import { UpstreamServerResponseInterceptor } from './common/interceptors/upstream-server-response.interceptor';

@Module({
  imports: [ConfigModule, UserModule, AuthModule],
  providers: [
    ...globalFilters,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: UpstreamServerResponseInterceptor,
    },
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
  ],
})
export class AppModule {}

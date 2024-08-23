import { Module } from '@nestjs/common';
import { ConfigService } from './config/config.service';
import { AuthModule } from './auth/auth.module';
import { RabbitMqModule, UnknownAsRpcExceptionFilter } from '@app/common';
import { APP_FILTER } from '@nestjs/core';

@Module({
  imports: [RabbitMqModule, AuthModule],
  providers: [
    ConfigService,
    {
      provide: APP_FILTER,
      useClass: UnknownAsRpcExceptionFilter,
    },
  ],
})
export class AppModule {}

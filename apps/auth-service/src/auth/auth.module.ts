import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtConfigService } from '../config/jwt/jwt.config';
import { APP_FILTER } from '@nestjs/core';
import { UnknownAsRpcExceptionFilter } from '@app/common/filters/unknown-as-rpc-exception.filter';

@Module({
  imports: [JwtModule.registerAsync({ useClass: JwtConfigService })],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: APP_FILTER,
      useClass: UnknownAsRpcExceptionFilter,
    },
  ],
})
export class AuthModule {}

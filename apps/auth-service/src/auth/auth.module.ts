import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtConfigService } from '../config/jwt/jwt.config';

@Module({
  imports: [JwtModule.registerAsync({ useClass: JwtConfigService })],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}

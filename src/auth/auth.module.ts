import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtConfigService } from './jwt/jwt.config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.registerAsync({ useClass: JwtConfigService })],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}

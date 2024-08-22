import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { ConfigService } from './config/config.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [AuthController],
  providers: [ConfigService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { ConfigService } from './config/config.service';
import { AuthModule } from './auth/auth.module';
import { RabbitMqModule } from '@app/common';

@Module({
  imports: [RabbitMqModule, AuthModule],
  providers: [ConfigService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { ConfigService } from './config/config.service';
import { RabbitMqModule } from '@app/common';
import { UserModule } from './user/user.module';

@Module({
  imports: [RabbitMqModule, UserModule],
  providers: [ConfigService],
})
export class AppModule {}

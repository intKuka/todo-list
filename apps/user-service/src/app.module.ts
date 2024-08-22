import { Module } from '@nestjs/common';
import { ConfigService } from './config/config.service';
import { PrismaModule, RpcSharedModule } from '@app/common';
import { UserModule } from './user/user.module';

@Module({
  imports: [RpcSharedModule, UserModule],
  providers: [ConfigService],
})
export class AppModule {}

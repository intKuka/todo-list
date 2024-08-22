import { Module } from '@nestjs/common';
import { ClientProxyFactory } from '@nestjs/microservices';
import { ConfigService } from '../config/config.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

const USER_SERVICE = process.env.USER_SERVICE_NAME;

@Module({
  imports: [],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: process.env.USER_SERVICE_NAME,
      useFactory: (configService: ConfigService) => {
        const userServiceOptions = configService.get('userService');
        return ClientProxyFactory.create(userServiceOptions);
      },
      inject: [ConfigService],
    },
  ],
  exports: [UserService, USER_SERVICE],
})
export class UserModule {}

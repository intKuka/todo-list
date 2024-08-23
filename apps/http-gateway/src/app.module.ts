import { Global, Module } from '@nestjs/common';
import { RabbitMqModule } from '@app/common';
import { UserService } from './user/user.service';
import { AuthService } from './auth/auth.service';
import { UserController } from './user/user.controller';
import { AuthController } from './auth/auth.controller';
import { APP_FILTERS } from './global/filters.global';
import { APP_GUARDS } from './global/guards.global';
import { APP_INTERCEPTORS } from './global/interceptors.global';
import { APP_PIPES } from './global/pipes.global';

@Module({
  imports: [
    RabbitMqModule.registerRmq(
      process.env.TOKEN_SERVICE_NAME,
      process.env.RABBITMQ_TOKEN_QUEUE,
    ),
    RabbitMqModule.registerRmq(
      process.env.USER_SERVICE_NAME,
      process.env.RABBITMQ_USER_QUEUE,
    ),
  ],
  controllers: [UserController, AuthController],
  providers: [
    ...APP_FILTERS,
    ...APP_GUARDS,
    ...APP_INTERCEPTORS,
    ...APP_PIPES,
    UserService,
    AuthService,
  ],
})
export class AppModule {}

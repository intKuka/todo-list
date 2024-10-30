import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RabbitMqService } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const rmqService = app.get(RabbitMqService);
  app.connectMicroservice(
    rmqService.getRmqOptions(process.env.RABBITMQ_TODO_QUEUE),
  );

  await app.startAllMicroservices();
}
bootstrap();

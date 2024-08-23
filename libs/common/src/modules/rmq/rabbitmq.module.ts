import { DynamicModule, Module } from '@nestjs/common';
import { RabbitMqService } from './rabbittmq.service';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
  ],
  providers: [RabbitMqService],
  exports: [RabbitMqService],
})
export class RabbitMqModule {
  static registerRmq(service: string, queue: string): DynamicModule {
    const providers = [
      {
        provide: service,
        useFactory: (configService: ConfigService) => {
          const URL = configService.getOrThrow<string>('RABBITMQ_URL');
          return ClientProxyFactory.create({
            transport: Transport.RMQ,
            options: {
              urls: [URL],
              queue,
              queueOptions: {
                durable: true,
              },
            },
          });
        },
        inject: [ConfigService],
      },
    ];

    return {
      module: RabbitMqModule,
      providers,
      exports: providers,
    };
  }
}

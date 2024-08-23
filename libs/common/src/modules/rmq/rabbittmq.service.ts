import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RmqContext, RmqOptions, Transport } from '@nestjs/microservices';

@Injectable()
export class RabbitMqService {
  constructor(private configService: ConfigService) {}

  getRmqOptions(queue: string): RmqOptions {
    const URL = this.configService.getOrThrow<string>('RABBITMQ_URL');

    return {
      transport: Transport.RMQ,
      options: {
        urls: [URL],
        // noAck: false,
        queue,
        queueOptions: {
          durable: true,
        },
      },
    };
  }

  acknowledgeMessage(context: RmqContext) {
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);
  }
}

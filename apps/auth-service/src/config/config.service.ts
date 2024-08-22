import { BaseConfigService } from '@app/common';
import { ClientProvider, Transport } from '@nestjs/microservices';

const rabbitmq: ClientProvider = {
  transport: Transport.RMQ,
  options: {
    urls: [process.env.RMQ_URL],
    queue: process.env.RQM_TOKEN_SERVICE_QUEUE,
    queueOptions: {
      durable: false,
    },
  },
};

export class ConfigService extends BaseConfigService {
  constructor() {
    super({
      baseUri: process.env.BASE_URI,
      logFolderPath: 'logs/user-service',
      rabbitmq,
    });
  }
}

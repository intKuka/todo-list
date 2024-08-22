import { BaseConfigService } from '@app/common';
import { Transport } from '@nestjs/microservices';

export class ConfigService extends BaseConfigService {
  constructor() {
    super({
      baseUri: process.env.BASE_URI,
      port: process.env.API_GATEWAY_PORT,
      rpcResponseTimeoutInMs: 5000,
      tokenService: {
        name: process.env.TOKEN_SERVICE_NAME,
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RMQ_URL],
          queue: process.env.RQM_TOKEN_SERVICE_QUEUE,
          queueOptions: {
            durable: false,
          },
        },
      },
      userService: {
        name: process.env.USER_SERVICE_NAME,
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RMQ_URL],
          queue: process.env.RQM_USER_SERVICE_QUEUE,
          queueOptions: {
            durable: false,
          },
        },
      },
    });
  }
}

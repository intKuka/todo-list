import { BaseConfigService } from '@app/common';
import { ClientProvider, Transport } from '@nestjs/microservices';

export class ConfigService extends BaseConfigService {
  constructor() {
    super({
      baseUri: process.env.BASE_URI,
      logFolderPath: 'logs/user-service',
    });
  }
}

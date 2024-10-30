import { BaseConfigService } from '@app/common';

export class ConfigService extends BaseConfigService {
  constructor() {
    super({
      baseUri: process.env.BASE_URI,
      logFolderPath: 'logs/user-service',
    });
  }
}

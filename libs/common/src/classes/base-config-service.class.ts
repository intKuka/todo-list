export abstract class BaseConfigService {
  constructor(protected readonly envConfig: { [key: string]: any }) {}

  get(key?: string): any {
    return key ? this.envConfig[key] : this;
  }
}

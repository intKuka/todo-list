import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';

export class JwtConfigService implements JwtOptionsFactory {
  createJwtOptions(): JwtModuleOptions {
    return {
      secret: process.env.SECRET_KEY,
      signOptions: {
        expiresIn: '2m',
      },
    };
  }
}

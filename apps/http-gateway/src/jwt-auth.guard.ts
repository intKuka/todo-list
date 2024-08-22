import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Request } from 'express';

const TOKEN_SERVICE = process.env.TOKEN_SERVICE_NAME;

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    // @Inject(TOKEN_SERVICE) private tokenClient: ClientRMQ,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const secured = this.reflector.get<string[]>(
      'secured',
      context.getHandler(),
    );

    if (!secured) {
      return true;
    }

    // const request: Request = context.switchToHttp().getRequest();
    // const token = this.extractTokenFromHeader(request);
    // if (!token) throw new UnauthorizedException();

    // const payload: UserMetadata = await this.jwtService
    //   .verifyAsync(token)
    //   .catch((err) => {
    //     if (err instanceof TokenExpiredError) {
    //       throw new TokenExpired((err as TokenExpiredError).expiredAt);
    //     } else if (err instanceof JsonWebTokenError) {
    //       throw new CustomJsonWebTokenError((err as JsonWebTokenError).message);
    //     } else {
    //       throw err;
    //     }
    //   });

    // request['user'] = payload;

    // const userId = request['user']['id'];
    // if (!userId) throw new TokenMalformed();

    // const isExists = await this.prisma.user.findUnique({
    //   where: { id: userId },
    // });
    // if (!isExists) throw new UserAlreadyGone();

    return true;
  }

  private extractTokenFromHeader(req: Request): string | undefined {
    const [type, token] = req.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

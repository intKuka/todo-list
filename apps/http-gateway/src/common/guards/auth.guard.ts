import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClientRMQ, RpcException } from '@nestjs/microservices';

import { Request } from 'express';
import { UserTokenPayload } from '../interfaces/user-token-payload.interface';
import { RmqCommands } from '@app/common';
import { catchError, firstValueFrom, timeout, TimeoutError } from 'rxjs';
import { CustomGatewayTimeoutException } from '../exceptions/custom-gateway-timeout.exception';

const TOKEN_SERVICE = process.env.TOKEN_SERVICE_NAME;

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(TOKEN_SERVICE) private tokenClient: ClientRMQ,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const secured = this.reflector.get<boolean>(
      'secured',
      context.getHandler(),
    );

    if (secured === false) {
      return true;
    }

    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) throw new UnauthorizedException();

    const payload: UserTokenPayload = await firstValueFrom(
      this.tokenClient.send(RmqCommands.token.verify, token).pipe(
        timeout(+process.env.UPSTREAM_SERVER_TIMEOUT_IN_MS),
        catchError((error) => {
          if (error instanceof TimeoutError) {
            throw new CustomGatewayTimeoutException();
          } else {
            throw new RpcException(error);
          }
        }),
      ),
    );
    request['user'] = payload;

    return true;
  }

  private extractTokenFromHeader(req: Request): string | undefined {
    const [type, token] = req.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { Request } from 'express';
import { UserMetadata } from 'src/common/custom-types/common.types';
import { CustomJsonWebTokenError } from 'src/common/exceptions/jwt/custom-json-web-token-error.exception';
import { TokenExpired } from 'src/common/exceptions/jwt/token-expired.exception';
import { TokenMalformed } from 'src/common/exceptions/jwt/token-malformed.exception';
import { UserAlreadyGone } from 'src/common/exceptions/user/user-already-gone.exception';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const token = this.extractTokenFromHeader(request);
    if (!token) throw new UnauthorizedException();

    const payload: UserMetadata = await this.jwtService
      .verifyAsync(token)
      .catch((err) => {
        if (err instanceof TokenExpiredError) {
          throw new TokenExpired((err as TokenExpiredError).expiredAt);
        } else if (err instanceof JsonWebTokenError) {
          throw new CustomJsonWebTokenError((err as JsonWebTokenError).message);
        } else {
          throw err;
        }
      });

    request['user'] = payload;

    const userId = request['user']['id'];
    if (!userId) throw new TokenMalformed();

    const isExists = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!isExists) throw new UserAlreadyGone();

    return true;
  }

  private extractTokenFromHeader(req: Request): string | undefined {
    const [type, token] = req.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

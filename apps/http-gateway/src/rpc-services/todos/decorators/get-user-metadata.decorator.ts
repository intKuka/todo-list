import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { UserTokenPayload } from '../../../common/interfaces/user-token-payload.interface';

export const GetUserMetadata = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();
    const user: UserTokenPayload = request['user'];

    return data ? user?.[data] : user;
  },
);

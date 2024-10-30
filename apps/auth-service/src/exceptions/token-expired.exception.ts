import { HttpStatus } from '@nestjs/common';
import { CustomRpcException } from '@app/common';

/**
 * @usecase Provided token is expired
 */
export class TokenExpired extends CustomRpcException {
  constructor(expiredAt: Date) {
    super({
      message: 'Provided token is expired',
      status: HttpStatus.UNAUTHORIZED,
      details: { expiredAt },
    });
  }
}

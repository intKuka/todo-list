import { CustomRpcException } from '@app/common';
import { HttpStatus } from '@nestjs/common';

/**
 * @usecase Any JsonWebTokenError occured
 */
export class InvalidTokenSignature extends CustomRpcException {
  constructor() {
    super({
      message: 'Invalid token signature',
      status: HttpStatus.UNAUTHORIZED,
    });
  }
}

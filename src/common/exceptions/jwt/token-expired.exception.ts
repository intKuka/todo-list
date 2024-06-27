import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * @usecase Provided token is expired
 */
export class TokenExpired extends HttpException {
  constructor(expiredAt?: Date) {
    super(
      {
        message: 'Provided token is expired',
        error: {
          expiredAt: expiredAt,
        },
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}

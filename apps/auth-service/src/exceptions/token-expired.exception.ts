import { HttpStatus } from '@nestjs/common';
import { JwtException } from './jwt.exception';

/**
 * @usecase Provided token is expired
 */
export class TokenExpired extends JwtException {
  constructor(expiredAt: Date) {
    super();
    this.message = 'Provided token is expired';
    this.details = {
      expiredAt,
    };
  }
}

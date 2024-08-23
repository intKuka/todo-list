import { HttpStatus } from '@nestjs/common';
import { JwtException } from './jwt.exception';

/**
 * @usecase Provided token is expired
 */
export class TokenExpired extends JwtException {
  constructor(expiredAt: Date) {
    super('Provided token is expired', undefined, { expiredAt });
  }
}

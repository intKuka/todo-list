import { JwtException } from './jwt.exception';

/**
 * @usecase Any JsonWebTokenError occured
 */
export class CustomJsonWebTokenError extends JwtException {
  constructor(message: string) {
    super(message);
  }
}

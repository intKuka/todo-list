import { JwtException } from './jwt.exception';

/**
 * @usecase Provided token is expired
 */
export class TokenMalformed extends JwtException {
  constructor() {
    super('Provided token is malformed');
  }
}

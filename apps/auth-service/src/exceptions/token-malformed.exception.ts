import { JwtException } from './jwt.exception';

/**
 * @usecase Provided token is expired
 */
export class TokenMalformed extends JwtException {
  constructor() {
    super();
    this.message = 'Provided token is malformed';
  }
}

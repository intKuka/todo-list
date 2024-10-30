import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt';
import { InvalidTokenSignature } from '../exceptions/invalid-token-signature.exception';
import { TokenExpired } from '../exceptions/token-expired.exception';

export const throwJwtException = (
  err: TokenExpiredError | JsonWebTokenError | unknown,
) => {
  if (err instanceof TokenExpiredError) {
    throw new TokenExpired(err.expiredAt);
  } else if (err instanceof JsonWebTokenError) {
    throw new InvalidTokenSignature();
  } else {
    throw err;
  }
};

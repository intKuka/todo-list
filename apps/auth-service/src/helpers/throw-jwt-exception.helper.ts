import { JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt';
import { CustomJsonWebTokenError } from '../exceptions/custom-json-web-token-error.exception';
import { TokenExpired } from '../exceptions/token-expired.exception';

export const throwJwtException = (
  err: TokenExpiredError | JsonWebTokenError | unknown,
) => {
  if (err instanceof TokenExpiredError) {
    throw new TokenExpired(err.expiredAt);
  } else if (err instanceof JsonWebTokenError) {
    throw new CustomJsonWebTokenError(err.message);
  } else {
    throw err;
  }
};

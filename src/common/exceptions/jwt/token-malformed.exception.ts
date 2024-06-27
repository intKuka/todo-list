import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * @usecase Provided token is expired
 */
export class TokenMalformed extends HttpException {
  constructor() {
    super(
      {
        message: 'Provided token is malformed',
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}

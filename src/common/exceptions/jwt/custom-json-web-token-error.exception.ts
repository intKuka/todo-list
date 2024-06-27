import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * @usecase Any JsonWebTokenError occured
 */
export class CustomJsonWebTokenError extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}

import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * @usecase A user tries to call a method, but that user no longer exists
 */
export class UserAlreadyGone extends HttpException {
  constructor() {
    super(
      'The user calling this method no longer exists',
      HttpStatus.METHOD_NOT_ALLOWED,
    );
  }
}

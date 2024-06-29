import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * @usecase User attempts to perform an operation without proper permission
 */
export class NotAllowedToThisUser extends HttpException {
  constructor() {
    super('No permission for this user', HttpStatus.METHOD_NOT_ALLOWED);
  }
}

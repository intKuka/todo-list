import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * @usecase User attempts to perform an operation on a project from another project
 */
export class NotAllowedFromAnotherProject extends HttpException {
  constructor() {
    super(
      'Not allowed to operate a project from another project',
      HttpStatus.METHOD_NOT_ALLOWED,
    );
  }
}

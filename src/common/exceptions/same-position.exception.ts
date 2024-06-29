import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * @usecase Attempt to change current column position to the same value
 */
export class SamePositionException extends HttpException {
  constructor() {
    super(
      'The current and new positions have the same values or no values at all',
      HttpStatus.BAD_REQUEST,
    );
  }
}

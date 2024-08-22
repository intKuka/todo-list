import { BaseException } from '@app/common';
import { HttpStatus } from '@nestjs/common';

export class InvalidCredentialsException extends BaseException {
  constructor() {
    super('Invalid credentials', HttpStatus.UNAUTHORIZED);
  }
}

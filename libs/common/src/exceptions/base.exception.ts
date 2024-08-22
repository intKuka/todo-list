import { HttpStatus } from '@nestjs/common';

export class BaseException extends Error {
  constructor(
    public message: string,
    public status: HttpStatus,
  ) {
    super();
  }
}

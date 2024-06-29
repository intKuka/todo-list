import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * @usecase Attempt to create user with an occupied email
 */
export class EmailAlreadyOccupied extends HttpException {
  constructor() {
    super('Email is already occupied', HttpStatus.CONFLICT);
  }
}

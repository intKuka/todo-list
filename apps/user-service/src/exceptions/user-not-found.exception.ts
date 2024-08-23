import { CustomRpcException } from '@app/common';
import { HttpStatus } from '@nestjs/common';

export class UserNotFoundException extends CustomRpcException {
  constructor() {
    super({ message: 'User not found', status: HttpStatus.NOT_FOUND });
  }
}

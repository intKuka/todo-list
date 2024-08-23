import { CustomRpcException } from '@app/common';
import { HttpStatus } from '@nestjs/common';

export class InvalidCredantialsException extends CustomRpcException {
  constructor() {
    super({
      message: 'Invalid createntials',
      status: HttpStatus.UNAUTHORIZED,
    });
  }
}

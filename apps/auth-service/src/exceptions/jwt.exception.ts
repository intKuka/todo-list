import { HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

export abstract class JwtException extends RpcException {
  constructor(
    message: string,
    status: HttpStatus = HttpStatus.UNAUTHORIZED,
    details?: string | object,
  ) {
    super({ message, status, details });
  }
}

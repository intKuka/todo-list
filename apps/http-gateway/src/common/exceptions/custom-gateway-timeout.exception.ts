import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomGatewayTimeoutException extends HttpException {
  constructor() {
    super(
      "Upstream server didn't response in time",
      HttpStatus.GATEWAY_TIMEOUT,
    );
  }
}

import { HttpStatus } from '@nestjs/common';

export abstract class JwtException {
  status: HttpStatus = HttpStatus.UNAUTHORIZED;
  message: string | object;
  details?: string | object;
}

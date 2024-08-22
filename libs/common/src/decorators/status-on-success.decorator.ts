import { HttpStatus, SetMetadata } from '@nestjs/common';

export const StatusOnSuccess = (status: HttpStatus = HttpStatus.OK) =>
  SetMetadata('success-status', status);

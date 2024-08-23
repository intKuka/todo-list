import { SetMetadata } from '@nestjs/common';

export const Authorization = (secured: boolean = true) =>
  SetMetadata('secured', secured);

import { AllExceptionFilter } from 'src/common/filters/all-exceptions.filter';
import { PrismaClientExceptionFilter } from 'src/common/filters/prisma-client-exception.filter';

const AllExceptionFilterProvider = {
  provide: 'APP_FILTER',
  useClass: AllExceptionFilter,
};
const PrismaClientExceptionFilterProvider = {
  provide: 'APP_FILTER',
  useClass: PrismaClientExceptionFilter,
};

export const globalFilters = [
  AllExceptionFilterProvider,
  PrismaClientExceptionFilterProvider,
];

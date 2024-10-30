import { stringToSlug } from '@app/todos';
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class GetSlug implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    if (typeof value !== 'string') return null;
    switch (metadata.type) {
      case 'param':
      case 'body':
        return stringToSlug(value);
      default:
        return value;
    }
  }
}

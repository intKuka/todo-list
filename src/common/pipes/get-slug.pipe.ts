import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { stringToSlug } from '../helpers/work-with-slug.helper';

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

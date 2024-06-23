import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { stringToSlug } from '../helpers/work-with-slug.helper';

@Injectable()
export class GetSlug<T extends string> implements PipeTransform {
  transform(value: T, metadata: ArgumentMetadata) {
    switch (metadata.type) {
      case 'param':
      case 'body':
        return stringToSlug(value);
      default:
        return value;
    }
  }
}

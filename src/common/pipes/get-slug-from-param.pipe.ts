import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { stringToSlug } from '../helpers/work-with-slug.helper';

@Injectable()
export class GetSlugFromParam<T extends string> implements PipeTransform {
  transform(value: T, metadata: ArgumentMetadata) {
    if (metadata.type !== 'param') return value;
    return stringToSlug(value);
  }
}

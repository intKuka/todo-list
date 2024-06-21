import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { stringToSlug } from '../helpers/work-with-slug.helper';

@Injectable()
export class AssignSlugInBody<T extends Object & { slug: string }>
  implements PipeTransform
{
  /**
   * @param {string} propertyName name of the property whose value to use for slug
   */
  constructor(private propertyName: string) {}
  transform(value: T, metadata: ArgumentMetadata) {
    if (metadata.type !== 'body') return value;

    value.slug = stringToSlug(value[this.propertyName]);

    return value;
  }
}

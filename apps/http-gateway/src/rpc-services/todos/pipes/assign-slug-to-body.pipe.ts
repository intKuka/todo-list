import { stringToSlug } from '@app/todos';
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class AssignSlugInBody<T extends object> implements PipeTransform {
  /**
   * @param {string} propertyName name of the property whose value to use for slug
   */
  constructor(private propertyName: string) {}
  transform(value: T, metadata: ArgumentMetadata) {
    if (metadata.type !== 'body' || !value[this.propertyName]) return value;

    value['slug'] = stringToSlug(value[this.propertyName]);

    return value;
  }
}

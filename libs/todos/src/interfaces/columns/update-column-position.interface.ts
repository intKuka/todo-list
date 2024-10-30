import { ByColumnId } from '../by-column-id.interface';

export interface UpdateColumnPosition extends ByColumnId {
  toPosition: number;
}

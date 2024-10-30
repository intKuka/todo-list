import { UpdateColumnDto } from '../../models/columns/dto/update-column.dto';
import { ByColumnId } from '../by-column-id.interface';

export interface UpdateColumnData extends ByColumnId {
  update: UpdateColumnDto;
}

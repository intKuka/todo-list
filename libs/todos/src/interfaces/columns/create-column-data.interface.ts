import { ByProjectId } from '../by-project-id.interface';
import { CreateColumnDto } from '../../models/columns/dto/create-column.dto';

export interface CreateColumnData extends ByProjectId {
  column: CreateColumnDto;
}

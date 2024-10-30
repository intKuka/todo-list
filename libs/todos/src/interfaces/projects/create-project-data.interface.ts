import { CreateProjectDto } from '../../models/project/dto/create-project.dto';
import { ByUserId } from '../by-user-id.interface';

export interface CreateProjectData extends ByUserId {
  project: CreateProjectDto;
}

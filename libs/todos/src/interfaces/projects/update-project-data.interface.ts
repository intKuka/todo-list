import { UpdateProjectDto } from '../../models/project/dto/update-project.dto';
import { ByProjectId } from '../by-project-id.interface';

export interface UpdateProjectData extends ByProjectId {
  update: UpdateProjectDto;
}

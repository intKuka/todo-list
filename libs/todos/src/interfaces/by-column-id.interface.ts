import { ByProjectId } from './by-project-id.interface';

export interface ByColumnId extends ByProjectId {
  columnSlug: string;
}

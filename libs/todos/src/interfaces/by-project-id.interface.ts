import { ByUserId } from './by-user-id.interface';

export interface ByProjectId extends ByUserId {
  projectSlug: string;
}

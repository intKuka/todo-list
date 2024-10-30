import { ByColumnId, ByProjectId } from '@app/todos';
import { Prisma } from '@prisma/client';

export const getProjectId = (
  params: ByProjectId,
): Prisma.ProjectSlugUserIdCompoundUniqueInput => ({
  slug: params.projectSlug,
  userId: params.userId,
});

export const getColumnId = (
  params: ByColumnId,
): Prisma.ColumnSlugProjectSlugUserIdCompoundUniqueInput => ({
  slug: params.columnSlug,
  projectSlug: params.projectSlug,
  userId: params.userId,
});

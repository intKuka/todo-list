import { Prisma } from '@prisma/client';

export type ProjectId = Prisma.ProjectSlugUserIdCompoundUniqueInput;

export type ColumnId = Prisma.ColumnSlugProjectSlugUserIdCompoundUniqueInput;

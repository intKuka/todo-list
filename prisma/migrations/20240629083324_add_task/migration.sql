/*
  Warnings:

  - The primary key for the `columns` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `projects` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "columns" DROP CONSTRAINT "columns_project_slug_user_id_fkey";

-- AlterTable
ALTER TABLE "columns" DROP CONSTRAINT "columns_pkey",
ALTER COLUMN "slug" SET DATA TYPE TEXT,
ALTER COLUMN "project_slug" SET DATA TYPE TEXT,
ALTER COLUMN "label" SET DATA TYPE TEXT,
ADD CONSTRAINT "columns_pkey" PRIMARY KEY ("slug", "project_slug", "user_id");

-- AlterTable
ALTER TABLE "projects" DROP CONSTRAINT "projects_pkey",
ALTER COLUMN "title" SET DATA TYPE TEXT,
ALTER COLUMN "slug" SET DATA TYPE TEXT,
ALTER COLUMN "description" SET DATA TYPE TEXT,
ADD CONSTRAINT "projects_pkey" PRIMARY KEY ("slug", "user_id");

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "email" SET DATA TYPE TEXT,
ALTER COLUMN "password" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "tasks" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "project_slug" TEXT NOT NULL,
    "column_slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "position" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "tasks_user_id_project_slug_column_slug_idx" ON "tasks"("user_id", "project_slug", "column_slug");

-- AddForeignKey
ALTER TABLE "columns" ADD CONSTRAINT "columns_project_slug_user_id_fkey" FOREIGN KEY ("project_slug", "user_id") REFERENCES "projects"("slug", "user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_user_id_project_slug_column_slug_fkey" FOREIGN KEY ("user_id", "project_slug", "column_slug") REFERENCES "columns"("user_id", "project_slug", "slug") ON DELETE CASCADE ON UPDATE CASCADE;

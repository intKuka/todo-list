/*
  Warnings:

  - The primary key for the `Project` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Project` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[title]` on the table `Project` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Project" DROP CONSTRAINT "Project_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Project_pkey" PRIMARY KEY ("title", "user_id");

-- CreateIndex
CREATE INDEX "Project_title_user_id_idx" ON "Project"("title", "user_id");

-- CreateIndex
CREATE INDEX "User_id_email_idx" ON "User"("id", "email");

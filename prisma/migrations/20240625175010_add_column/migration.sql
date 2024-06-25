-- CreateTable
CREATE TABLE "columns" (
    "slug" VARCHAR(50) NOT NULL,
    "project_slug" VARCHAR(50) NOT NULL,
    "user_id" INTEGER NOT NULL,
    "label" VARCHAR(50) NOT NULL,
    "position" SMALLINT NOT NULL,

    CONSTRAINT "columns_pkey" PRIMARY KEY ("slug","project_slug","user_id")
);

-- CreateIndex
CREATE INDEX "columns_slug_project_slug_user_id_idx" ON "columns"("slug", "project_slug", "user_id");

-- AddForeignKey
ALTER TABLE "columns" ADD CONSTRAINT "columns_project_slug_user_id_fkey" FOREIGN KEY ("project_slug", "user_id") REFERENCES "projects"("slug", "user_id") ON DELETE CASCADE ON UPDATE CASCADE;

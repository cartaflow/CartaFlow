-- AlterTable
ALTER TABLE "public"."List" ADD COLUMN     "icon" TEXT NOT NULL DEFAULT 'list',
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];

/*
  Warnings:

  - Made the column `browser` on table `Session` required. This step will fail if there are existing NULL values in that column.
  - Made the column `device` on table `Session` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ipAddress` on table `Session` required. This step will fail if there are existing NULL values in that column.
  - Made the column `os` on table `Session` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userAgent` on table `Session` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Session" ALTER COLUMN "browser" SET NOT NULL,
ALTER COLUMN "device" SET NOT NULL,
ALTER COLUMN "ipAddress" SET NOT NULL,
ALTER COLUMN "os" SET NOT NULL,
ALTER COLUMN "userAgent" SET NOT NULL;

/*
  Warnings:

  - Changed the type of `prefix` on the `Student` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."Prefix" AS ENUM ('MR', 'MS', 'DR', 'OTHER');

-- AlterTable
ALTER TABLE "public"."Student" ADD COLUMN     "customPrefix" TEXT,
DROP COLUMN "prefix",
ADD COLUMN     "prefix" "public"."Prefix" NOT NULL;

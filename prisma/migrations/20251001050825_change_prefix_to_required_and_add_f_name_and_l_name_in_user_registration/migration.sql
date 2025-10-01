/*
  Warnings:

  - Made the column `prefix` on table `Student` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `firstName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Student" ALTER COLUMN "prefix" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN "firstName" TEXT NOT NULL DEFAULT 'Admin';
ALTER TABLE "public"."User" ADD COLUMN "lastName" TEXT NOT NULL DEFAULT 'User';

-- Set Student ID sequence to start at 1000
ALTER SEQUENCE "Student_studentId_seq" RESTART WITH 1000;

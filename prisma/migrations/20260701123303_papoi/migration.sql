/*
  Warnings:

  - Added the required column `precio` to the `hotel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tiene_catering` to the `hotel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "hotel" ADD COLUMN     "precio" INTEGER NOT NULL,
ADD COLUMN     "tiene_catering" BOOLEAN NOT NULL;

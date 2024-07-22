/*
  Warnings:

  - You are about to alter the column `totalLikes` on the `Blog` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Blog" ALTER COLUMN "totalLikes" SET DATA TYPE INTEGER;

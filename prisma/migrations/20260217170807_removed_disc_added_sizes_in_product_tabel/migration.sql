/*
  Warnings:

  - You are about to drop the column `discription` on the `product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "product" DROP COLUMN "discription",
ADD COLUMN     "Sizes" JSONB;

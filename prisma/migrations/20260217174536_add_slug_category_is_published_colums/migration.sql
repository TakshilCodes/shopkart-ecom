/*
  Warnings:

  - Added the required column `category` to the `product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isPublished` to the `product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "product" ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "isPublished" BOOLEAN NOT NULL,
ADD COLUMN     "slug" TEXT NOT NULL,
ALTER COLUMN "price" SET DATA TYPE DECIMAL(65,30);

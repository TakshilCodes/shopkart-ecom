/*
  Warnings:

  - You are about to drop the column `Name` on the `product` table. All the data in the column will be lost.
  - Added the required column `name` to the `product` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "product_id_Name_prodImage_categoryId_price_Sizes_slug_isPub_idx";

-- AlterTable
ALTER TABLE "product" DROP COLUMN "Name",
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "product_id_name_prodImage_categoryId_price_Sizes_slug_isPub_idx" ON "product"("id", "name", "prodImage", "categoryId", "price", "Sizes", "slug", "isPublished", "inStock");

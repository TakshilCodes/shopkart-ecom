/*
  Warnings:

  - You are about to drop the column `productId` on the `cart` table. All the data in the column will be lost.
  - You are about to drop the column `Sizes` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `inStock` on the `product` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,productVariantId]` on the table `cart` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `productVariantId` to the `cart` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "cart" DROP CONSTRAINT "cart_productId_fkey";

-- DropIndex
DROP INDEX "cart_userId_productId_key";

-- DropIndex
DROP INDEX "product_id_name_prodImage_categoryId_price_Sizes_slug_isPub_idx";

-- AlterTable
ALTER TABLE "Users" ALTER COLUMN "role" SET DEFAULT 'User';

-- AlterTable
ALTER TABLE "cart" DROP COLUMN "productId",
ADD COLUMN     "productVariantId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "product" DROP COLUMN "Sizes",
DROP COLUMN "inStock";

-- CreateTable
CREATE TABLE "ProductVariant" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "stockQuantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductVariant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProductVariant_productId_idx" ON "ProductVariant"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductVariant_productId_size_key" ON "ProductVariant"("productId", "size");

-- CreateIndex
CREATE INDEX "cart_userId_idx" ON "cart"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "cart_userId_productVariantId_key" ON "cart"("userId", "productVariantId");

-- CreateIndex
CREATE INDEX "product_id_name_prodImage_categoryId_price_slug_isPublished_idx" ON "product"("id", "name", "prodImage", "categoryId", "price", "slug", "isPublished");

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart" ADD CONSTRAINT "cart_productVariantId_fkey" FOREIGN KEY ("productVariantId") REFERENCES "ProductVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

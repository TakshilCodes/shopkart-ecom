/*
  Warnings:

  - You are about to drop the column `username` on the `Users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Users_username_key";

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "username",
ALTER COLUMN "Hashpassword" DROP NOT NULL;

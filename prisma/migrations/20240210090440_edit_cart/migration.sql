/*
  Warnings:

  - You are about to drop the column `quantity` on the `carts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `cart_product` ADD COLUMN `quantity` INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `carts` DROP COLUMN `quantity`;

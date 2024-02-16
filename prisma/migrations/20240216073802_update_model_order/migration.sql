/*
  Warnings:

  - You are about to drop the column `product_id` on the `item_order` table. All the data in the column will be lost.
  - Added the required column `product_name` to the `item_order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `item_order` DROP FOREIGN KEY `item_order_product_id_fkey`;

-- AlterTable
ALTER TABLE `item_order` DROP COLUMN `product_id`,
    ADD COLUMN `product_name` VARCHAR(191) NOT NULL;

/*
  Warnings:

  - You are about to drop the column `product_name` on the `item_order` table. All the data in the column will be lost.
  - Added the required column `product_id` to the `item_order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `item_order` DROP COLUMN `product_name`,
    ADD COLUMN `product_id` INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX `product_id` ON `item_order`(`product_id`);

-- AddForeignKey
ALTER TABLE `item_order` ADD CONSTRAINT `item_order_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

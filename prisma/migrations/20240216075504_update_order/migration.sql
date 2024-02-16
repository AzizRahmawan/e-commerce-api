-- DropForeignKey
ALTER TABLE `item_order` DROP FOREIGN KEY `item_order_product_id_fkey`;

-- AlterTable
ALTER TABLE `item_order` MODIFY `product_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `item_order` ADD CONSTRAINT `item_order_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

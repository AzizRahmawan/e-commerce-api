import { faker } from '@faker-js/faker';
import prisma from '../app/prisma.js';

async function main() {
  await prisma.product.deleteMany();
  
  const category = await prisma.category.findMany();
  for (let i = 1; i <= 10; i++) {
    await prisma.product.create({
      data: {
        id: i,
        name: faker.commerce.productName(),
        price: parseFloat(faker.commerce.price()),
        stock: faker.datatype.number(100),
        description: faker.lorem.sentence(),
        seller_id: 1, // Sesuaikan dengan ID penjual yang ada di database
        category_id: category[Math.floor(Math.random() * category.length)].id,
      },
    });

  }
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
import { faker } from '@faker-js/faker';
import prisma from '../app/prisma.js';

async function main() {
  await prisma.product.deleteMany();
  
  const category = await prisma.category.findMany();
  const user = await prisma.user.findMany({
    where: {
      role_id: 3,
    }
  });
  for (let i = 1; i <= 10; i++) {
    await prisma.product.create({
      data: {
        id: i,
        name: faker.commerce.productName(),
        price: parseFloat(faker.commerce.price()),
        stock: faker.number.int(100),
        description: faker.lorem.sentence(),
        seller_id: user[Math.floor(Math.random() * user.length)].id,
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
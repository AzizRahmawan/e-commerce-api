import prisma from '../app/prisma.js';

async function main() {
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  const createdCategories = await prisma.category.createMany({
      data: [
      { id: 1, name: 'Electronics' },
      { id: 2, name: 'Clothing' },
      { id: 3, name: 'Books' },
      ],
  });

  return createdCategories;
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

export default main;
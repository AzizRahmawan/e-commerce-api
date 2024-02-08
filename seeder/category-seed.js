import prisma from '../app/prisma.js';

async function main() {
    await prisma.category.deleteMany();
    const createdCategories = await prisma.category.createMany({
        data: [
        { name: 'Electronics' },
        { name: 'Clothing' },
        { name: 'Books' },
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
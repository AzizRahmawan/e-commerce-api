import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import prisma from '../app/prisma.js';

dotenv.config();

const bcryptRound = Number(process.env.BCRYPT_ROUND);

async function main() {
  await prisma.itemOrder.deleteMany()
  await prisma.order.deleteMany()
  await prisma.cartProduct.deleteMany()
  await prisma.cart.deleteMany()
  await prisma.product.deleteMany()
  await prisma.token.deleteMany()
  await prisma.user.deleteMany();
  const roles = await prisma.role.findMany();
  for (let i = 1; i <= 5; i++) {
      await prisma.user.create({
          data: {
              id: i,
              name: faker.person.fullName(),
              email: faker.internet.email().toLowerCase(),
              password: bcrypt.hashSync(`password${i}`, bcryptRound),
              role_id: roles[Math.floor(Math.random() * roles.length)].id
          }
      })
      
  }
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
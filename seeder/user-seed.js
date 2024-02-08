import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import prisma from '../app/prisma.js';

dotenv.config();

const bcryptRound = Number(process.env.BCRYPT_ROUND);

async function main() {
  await prisma.user.deleteMany();
  const roles = await prisma.role.findMany();
  for (let i = 0; i < 5; i++) {
      await prisma.user.create({
          data: {
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
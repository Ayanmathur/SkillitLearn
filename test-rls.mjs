import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const result = await prisma.$queryRaw`SELECT * FROM pg_policies WHERE tablename = 'users'`;
  console.log(result);
}
main();

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "users_select_admin" ON users;`);
  await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "users_update_admin" ON users;`);
  console.log("Dropped broken policies");
}
main();

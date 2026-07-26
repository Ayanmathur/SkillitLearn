import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "mathurayan1@gmail.com";

  const updatedUser = await prisma.user.updateMany({
    where: { email: adminEmail },
    data: { role: "admin" },
  });

  console.log(`Updated ${updatedUser.count} user(s) with email '${adminEmail}' to role 'admin'.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

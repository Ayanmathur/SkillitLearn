/**
 * Create the admin user in both Supabase Auth and our DB.
 *
 * Admin credentials:
 *   Email: mathurayan1@gmail.com
 *   Password: may@2002
 *   Role: super_admin
 *
 * This uses the service role key to create the auth user directly
 * (bypassing email verification for the admin account).
 *
 * Usage: node prisma/seed-admin.js
 */

const { PrismaClient } = require("@prisma/client");
const { createClient } = require("@supabase/supabase-js");

const prisma = new PrismaClient({ log: ["error"] });

const ADMIN_EMAIL = "mathurayan1@gmail.com";
const ADMIN_PASSWORD = "may@2002";
const ADMIN_FULL_NAME = "Admin";

async function main() {
  console.log("👤 Creating admin user...\n");

  // Create Supabase admin client with service role key
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  // Check if admin auth user already exists
  const { data: existingUsers } = await supabase.auth.admin.listUsers();
  const existingAdmin = existingUsers?.users?.find(
    (u) => u.email === ADMIN_EMAIL
  );

  let authUserId;

  if (existingAdmin) {
    console.log(`  Auth user already exists: ${existingAdmin.id}`);
    authUserId = existingAdmin.id;

    // Update password in case it changed
    await supabase.auth.admin.updateUserById(authUserId, {
      password: ADMIN_PASSWORD,
      email_confirm: true,
    });
    console.log("  Password updated and email confirmed.");
  } else {
    // Create new auth user with email pre-confirmed
    const { data, error } = await supabase.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: ADMIN_FULL_NAME },
    });

    if (error) {
      console.error("  ❌ Failed to create auth user:", error.message);
      process.exit(1);
    }

    authUserId = data.user.id;
    console.log(`  ✅ Auth user created: ${authUserId}`);
  }

  // Create/update DB user record with super_admin role
  await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: { role: "super_admin", fullName: ADMIN_FULL_NAME },
    create: {
      id: authUserId,
      email: ADMIN_EMAIL,
      fullName: ADMIN_FULL_NAME,
      role: "super_admin",
    },
  });

  console.log(`  ✅ DB user set to super_admin`);
  console.log(`\n🎉 Admin user ready!`);
  console.log(`   Email: ${ADMIN_EMAIL}`);
  console.log(`   Password: ${ADMIN_PASSWORD}`);
  console.log(`   Role: super_admin`);
  console.log(`   Login at /login → redirects to /admin`);
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

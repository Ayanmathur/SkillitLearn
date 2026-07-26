const { Client } = require('pg');

async function testPgConnection() {
  const connectionStrings = [
    "postgresql://postgres:maymvmvm%402002@db.pghgxwjkwrkxnncpsrwu.supabase.co:5432/postgres",
    "postgresql://postgres.pghgxwjkwrkxnncpsrwu:maymvmvm%402002@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres",
    "postgresql://postgres.pghgxwjkwrkxnncpsrwu:maymvmvm%402002@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"
  ];

  for (const str of connectionStrings) {
    console.log("\nTesting:", str.split('@')[1]);
    const client = new Client({ connectionString: str });
    try {
      await client.connect();
      console.log("🎉 CONNECTED SUCCESSFULLY!");
      const res = await client.query(`
        SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
      `);
      console.log("Public tables in DB:", res.rows.map(r => r.table_name).join(', '));
      await client.end();
      return str;
    } catch (e) {
      console.error("❌ Connection Failed:", e.message);
    }
  }
}

testPgConnection();

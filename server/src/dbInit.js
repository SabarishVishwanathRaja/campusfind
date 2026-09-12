require('dotenv').config();
const fs = require('fs');
const path = require('path');
const db = require('./db');

async function initDatabase() {
  console.log('----------------------------------------------------');
  console.log('🚀 CampusFind — Automated Cloud Database Initializer');
  console.log('----------------------------------------------------');

  const schemaPath = path.resolve(__dirname, '../../db/schema.sql');
  const seedPath = path.resolve(__dirname, '../../db/seed.sql');

  if (!fs.existsSync(schemaPath) || !fs.existsSync(seedPath)) {
    console.error('❌ Error: schema.sql or seed.sql not found at expected path:');
    console.error('  Schema:', schemaPath);
    console.error('  Seed:', seedPath);
    process.exit(1);
  }

  let client;
  try {
    console.log('📡 Connecting to PostgreSQL database...');
    client = await db.pool.connect();
    const pingResult = await client.query('SELECT current_database(), current_user, version()');
    console.log(`✅ Connected successfully to: "${pingResult.rows[0].current_database}" as "${pingResult.rows[0].current_user}"`);

    // 1. Execute Schema DDL
    console.log('\n📄 [1/2] Executing schema DDL (db/schema.sql)...');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    await client.query(schemaSql);
    console.log('✅ Tables created: users, categories, items, claims & performance indexes');

    // 2. Execute Seed Data
    console.log('\n🌱 [2/2] Seeding initial data (db/seed.sql)...');
    const seedSql = fs.readFileSync(seedPath, 'utf8');
    await client.query(seedSql);
    console.log('✅ Seed data inserted successfully');

    // Verify row counts
    const usersCount = await client.query('SELECT COUNT(*) FROM users');
    const categoriesCount = await client.query('SELECT COUNT(*) FROM categories');
    const itemsCount = await client.query('SELECT COUNT(*) FROM items');
    const claimsCount = await client.query('SELECT COUNT(*) FROM claims');

    console.log('\n📊 Database Status Summary:');
    console.log(`   - Users:      ${usersCount.rows[0].count}`);
    console.log(`   - Categories: ${categoriesCount.rows[0].count}`);
    console.log(`   - Items:      ${itemsCount.rows[0].count}`);
    console.log(`   - Claims:     ${claimsCount.rows[0].count}`);

    console.log('\n🔑 Pre-configured Accounts Ready for Use:');
    console.log('   👑 Admin:   admin@campusfind.edu  /  Admin@123');
    console.log('   🎓 Student: arjun@student.edu      /  Student@123');
    console.log('   🎓 Student: priya@student.edu      /  Student@123');
    console.log('   🎓 Student: rahul@student.edu      /  Student@123');
    console.log('\n🎉 Database initialization complete!\n');
  } catch (error) {
    console.error('\n❌ Database initialization failed:', error.message);
    process.exit(1);
  } finally {
    if (client) client.release();
    await db.pool.end();
  }
}

initDatabase();

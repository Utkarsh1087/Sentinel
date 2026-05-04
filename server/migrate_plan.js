const db = require('./src/config/db');

async function migrate() {
  console.log('🔄 Migrating database to include user plans...');
  try {
    await db.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS plan VARCHAR(20) DEFAULT 'free';
    `);
    console.log('✅ Migration successful: "plan" column added to users table.');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
  } finally {
    process.exit();
  }
}

migrate();

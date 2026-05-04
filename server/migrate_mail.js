require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function migrate() {
  try {
    console.log('🚀 Running database migration...');
    await pool.query(`
      ALTER TABLE alert_rules 
      ADD COLUMN IF NOT EXISTS email_recipient VARCHAR(255);
    `);
    console.log('✅ email_recipient column added successfully!');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
  } finally {
    await pool.end();
  }
}

migrate();

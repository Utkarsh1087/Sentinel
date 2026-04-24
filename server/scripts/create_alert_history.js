const db = require('../src/config/db');

async function migrate() {
  console.log('🏗️ Starting Alert History migration...');
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS alert_history (
        id SERIAL PRIMARY KEY,
        project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
        rule_id INTEGER REFERENCES alert_rules(id) ON DELETE CASCADE,
        metric_type VARCHAR(50) NOT NULL,
        value FLOAT NOT NULL,
        threshold FLOAT NOT NULL,
        triggered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ alert_history table created successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  }
}

migrate();

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on('connect', () => {
  console.log('🐘 Connected to PostgreSQL');
  // Auto-migration
  pool.query(`
    CREATE TABLE IF NOT EXISTS alert_history (
      id SERIAL PRIMARY KEY,
      project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
      rule_id INTEGER REFERENCES alert_rules(id) ON DELETE CASCADE,
      metric_type VARCHAR(50) NOT NULL,
      value FLOAT NOT NULL,
      threshold FLOAT NOT NULL,
      triggered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `).catch(err => console.error('Migration error:', err));
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};

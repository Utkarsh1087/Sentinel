const db = require('./src/config/db');
require('dotenv').config();

async function checkKey() {
  try {
    const res = await db.query('SELECT * FROM projects WHERE api_key = $1', ['sn_46d54ce893a20930b3e40c3324a4ac6e']);
    console.log('Result:', JSON.stringify(res.rows, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkKey();

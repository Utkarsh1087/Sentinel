const express = require('express');
const { sentinel } = require('sentinel-sdk');

const app = express();

// Initialize Sentinel
sentinel.init({
  projectKey: 'sn_1747b23a9f612450e0b9b0ce96ee3a9a',
  ingestServer: 'http://localhost:5000'
});

// Use Sentinel Middleware
app.use(sentinel.middleware());

app.get('/', (req, res) => {
  res.send('Welcome to the monitored app!');
});

app.get('/slow', (req, res) => {
  const delay = Math.random() * 2000;
  setTimeout(() => {
    res.json({ message: `This was slow! Delayed by ${delay.toFixed(0)}ms` });
  }, delay);
});

app.get('/error', (req, res) => {
  console.error('Critical Database Connection Failure in User Profile Service');
  res.status(500).json({ error: 'Something went wrong!' });
});

app.get('/db-test', async (req, res) => {
  const result = await sentinel.trackQuery(
    async () => {
      await new Promise(resolve => setTimeout(resolve, 150)); // Simulating DB latency
      return { success: true, data: 'Database Results' };
    },
    { query: 'SELECT * FROM users_prod WHERE active = true' }
  );
  res.json(result);
});

app.listen(3000, () => {
  console.log('🏁 Tester app running on http://localhost:3000');
  console.log('Try visiting /slow or /error to generate metrics.');
});

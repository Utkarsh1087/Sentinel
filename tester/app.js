const express = require('express');
const { sentinel } = require('sentinel-sdk');

const app = express();

// Initialize Sentinel with Live Production Credentials
sentinel.init({
  projectKey: 'sn_80cf2926ea2eca0d2bf15b29c3359fe1',
  ingestServer: 'https://sentinel-9x1b.onrender.com'
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

setInterval(() => {
  console.log('Pulse: System healthy...');
  
  // Simulate an API call tracking for the Bottlenecks table
  sentinel.recordApiMetric({ 
    path: '/api/v1/user-sync', 
    method: 'GET', 
    statusCode: 200, 
    duration: Math.random() * 500 // Random latency between 0-500ms
  });
}, 10000);

app.listen(3000, () => {
  console.log('🏁 Tester app running on http://localhost:3000');
  console.log('Try visiting /slow or /error to generate metrics.');
});

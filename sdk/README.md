# 🔌 sentinel.io | Node.js Integration SDK

The official high-performance ingestion client for the Sentinel Observability Platform. 

## 🚀 Installation

```bash
npm install sentinel.io
```

## 🛠️ Quick Start

Initialize Sentinel in your application entry point (e.g., `app.js` or `index.js`):

```javascript
import { sentinel } from 'sentinel.io';

// Initialize with your Project API Key
sentinel.init({
  projectKey: 'YOUR_PROJECT_API_KEY',
  projectName: 'my-production-app',
  environment: 'production'
});

// The SDK will now automatically track:
// 🛡️ Global unhandled exceptions
// 📊 System CPU & Memory usage
// ⚡ Event loop lag
```

## 📊 Manual Metrics Tracking

For custom business logic or database timing:

```javascript
// Track performance of a specific operation
const timer = sentinel.startTimer('database-query');
// ... perform operation ...
timer.stop();

// Log custom data to the Sentinel Live Stream
sentinel.log('Processing transaction #12345', 'info');
```

## 🔐 Privacy & Security
Data is transmitted over encrypted TLS. Ensure your API Key is kept in environment variables and never committed to source control.

---
© 2026 Sentinel Observability Protocol. Built for precision.

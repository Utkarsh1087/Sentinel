# 🛡️ Sentinel | High-Performance Developer Observability

Sentinel is a high-fidelity, logic-driven observability platform designed for real-time application monitoring. It provides deep visibility into your application's metrics, database performance, and operational baseline using a sophisticated multi-tier technical stack.

## 🖼️ Visual Interface
![Sentinel Dashboard](assets/sentinel_preview.png)

## 🚀 Key Features

- **Real-Time Telemetry**: Sub-second log broadcasting via Socket.io.
- **Time-Series Analysis**: High-resolution metrics storage and querying in InfluxDB.
- **API Performance Forensics**: Detailed tracking of slow endpoints and database latency.
- **Zero-Trust Security**: Robust JWT-based authorization and project isolation.
- **AI-Driven Diagnostics**: Automated error explanation and performance analysis using LLMs.
- **Anomaly Webhooks**: Native integration with Discord and Slack for threshold violations.

## 🛠️ Technical Stack

- **Frontend**: React, Tailwind CSS, Recharts, Lucide Icons.
- **Backend**: Node.js, Express, Postgres (Metadata), InfluxDB (Metrics), Redis (Ingest Cache).
- **Messaging**: Socket.io (Real-time logs), BullMQ (Background Alerting).
- **Intelligence**: Gemini-2.0-flash via OpenRouter.

## 📦 Project Structure

```text
├── dashboard/    # React frontend (Vite)
├── server/       # Node.js backend
├── sdk/          # Node.js SDK for ingestion
├── tester/       # Performance & validation scripts
├── assets/       # Visual documentation
└── .gitignore    # Global exclusion rules
```

## 🏁 Quick Start

### 1. Requirements
- Node.js (v18+)
- InfluxDB v2 instance
- Redis server
- PostgreSQL database

### 2. Installation

```bash
# Setup Backend
cd server
npm install
# Copy .env.example to .env and fill in your keys
cp .env.example .env

# Setup Frontend
cd ../dashboard
npm install

# Start Development
# Run server (port 5000)
cd ../server
npm run dev

# Run dashboard (port 5173)
cd ../dashboard
npm run dev
```

## 🔐 Security & Isolation

Sentinel is built with **Project Isolation** at its core. Every data packet is tagged with a unique `api_key` and every database query is programmatically scoped to the authorized project owner. No data "bleeding" between projects is possible. WebSockets are strictly authenticated via JWT within the `io.use` handshake.

## 📜 License

MIT License - feel free to use for your own high-performance projects.

---
Created with precision for modern developers.

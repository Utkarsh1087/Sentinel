import React from 'react';
import { Book, Code, Terminal, Activity, ChevronRight, Copy, Check, Info, Shield, Zap, Database } from 'lucide-react';
import sentinelLogo from '../assets/sentinellogo.png';

const Documentation = ({ onBack, section }) => {
  const [copied, setCopied] = React.useState(null);

  React.useEffect(() => {
    if (section) {
      const el = document.getElementById(section);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [section]);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const sections = [
    {
      id: 'quickstart',
      title: 'Quickstart',
      icon: <Zap className="w-5 h-5 text-[#FF6044]" />,
      content: 'Install sentinel.io, add your project key, and start seeing CPU, RAM, and request data in your dashboard immediately.'
    },
    {
      id: 'metrics',
      title: 'Metrics Tracking',
      icon: <Activity className="w-5 h-5 text-[#FF6044]" />,
      content: 'CPU usage, RAM consumption, and API response times — collected every 5 seconds automatically by the SDK.'
    },
    {
      id: 'security',
      title: 'Security',
      icon: <Shield className="w-5 h-5 text-[#FF6044]" />,
      content: "Your project key is stored as a bcrypt hash. All data travels over HTTPS. Each project's data is isolated by key."
    }
  ];

  return (
    <div className="min-h-screen bg-[#050506] text-[#EFFFEB] font-mono selection:bg-[#FF6044]/30">
      {/* 🚀 Docs Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-3xl border-b border-white/5 px-10 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <img src={sentinelLogo} alt="Sentinel" className="h-10 w-auto" />
          <div className="w-px h-6 bg-white/10" />
          <span className="text-[12px] font-bold tracking-[0.3em] uppercase text-white/50">Documentation v1.0</span>
        </div>
        <button 
          onClick={onBack}
          className="bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-2 rounded-lg text-[13px] font-bold transition-all"
        >
          Back to Portal
        </button>
      </nav>

      <div className="max-w-[1400px] mx-auto pt-32 pb-24 px-10 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-16">
        {/* Left: Sidebar Navigation */}
        <aside className="sticky top-32 h-fit space-y-10 hidden lg:block">
          <div>
            <h3 className="text-[11px] font-black text-white/20 uppercase tracking-[0.4em] mb-6">Foundations</h3>
            <div className="space-y-4">
              {[
                { label: 'Introduction', id: 'introduction' },
                { label: 'Architecture', id: 'architecture' },
                { label: 'Installation', id: 'installation' },
                { label: 'Authentication', id: 'authentication' }
              ].map(item => (
                <button 
                  key={item.id} 
                  onClick={() => {
                    document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="block text-left w-full text-[14px] text-white/60 hover:text-[#FF6044] transition-colors bg-transparent border-none cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-[11px] font-black text-white/20 uppercase tracking-[0.4em] mb-6">SDK Reference</h3>
            <div className="space-y-4">
              {[
                { label: 'Node.js SDK', id: 'node-sdk' },
                { label: 'REST API', id: 'rest-api' }
              ].map(item => (
                <button 
                  key={item.id} 
                  onClick={() => {
                    document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="block text-left w-full text-[14px] text-white/60 hover:text-[#FF6044] transition-colors bg-transparent border-none cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-[11px] font-black text-white/20 uppercase tracking-[0.4em] mb-6">System Logic</h3>
            <div className="space-y-4">
              {[
                { label: 'Metrics', id: 'metrics' },
                { label: 'Database', id: 'database' },
                { label: 'Alerting', id: 'alerts' }
              ].map(item => (
                <button 
                  key={item.id} 
                  onClick={() => {
                    document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="block text-left w-full text-[14px] text-white/60 hover:text-[#FF6044] transition-colors bg-transparent border-none cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Right: Main Content */}
        <main className="space-y-24">
          <section id="introduction">
            <h1 className="text-[48px] font-black tracking-tighter mb-8 leading-none">Sentinel <br /><span className="text-[#FF6044]">Documentation</span></h1>
            <p className="text-[18px] text-white/60 leading-relaxed max-w-3xl mb-12">
              Everything you need to install, configure, and use Sentinel in your Node.js app. Start with the Quickstart and have your first dashboard running in under 5 minutes.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {sections.map(s => (
                <div key={s.id} className="bg-white/[0.02] border border-white/5 p-8 rounded-2xl hover:bg-white/[0.04] transition-all group">
                  <div className="mb-6">{s.icon}</div>
                  <h4 className="text-[16px] font-bold mb-4">{s.title}</h4>
                  <p className="text-[13px] text-white/40 leading-relaxed">{s.content}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="architecture">
            <div className="flex items-center gap-4 mb-8">
              <Book className="text-[#FF6044] w-6 h-6" />
              <h2 className="text-[28px] font-black tracking-tight uppercase">Architecture</h2>
            </div>
            <p className="text-[15px] text-white/40 leading-relaxed max-w-3xl">
              Sentinel has three layers. The SDK runs inside your app and collects data. The server receives that data and writes it to InfluxDB. The dashboard reads from InfluxDB and displays it in real time.
              <br /><br />
              <code className="text-[#FF6044] bg-white/5 p-4 rounded-lg block text-[13px]">
                SDK (your app) → POST /v1/ingest every 5s → InfluxDB (storage) → Dashboard (display)
              </code>
            </p>
          </section>

          <section id="installation">
            <div className="flex items-center gap-4 mb-8">
              <Terminal className="text-[#FF6044] w-6 h-6" />
              <h2 className="text-[28px] font-black tracking-tight uppercase">Installation</h2>
            </div>
            
            <div className="bg-black border border-white/10 rounded-xl p-8 relative group">
              <button 
                onClick={() => copyToClipboard('npm install sentinel.io', 'npm')}
                className="absolute top-6 right-6 p-2 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {copied === 'npm' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-white/50" />}
              </button>
              <code className="text-[#FF6044] text-[16px]">
                <span className="text-white/40">$</span> npm install <span className="text-white">sentinel.io</span>
              </code>
            </div>

            <div className="mt-12 space-y-8 bg-white/[0.01] border-l-2 border-[#FF6044]/20 p-8">
              <div className="flex gap-4">
                <Info className="w-5 h-5 text-[#FF6044] shrink-0" />
                <p className="text-[14px] text-white/60 leading-relaxed">
                  Before initializing, get your <span className="text-white font-bold underline decoration-[#FF6044]/40">Project Key</span> from the Sentinel dashboard. Go to your project → Settings → copy the Project Key.
                </p>
              </div>
            </div>
          </section>

          <section id="authentication">
            <div className="flex items-center gap-4 mb-8">
              <Shield className="text-[#FF6044] w-6 h-6" />
              <h2 className="text-[28px] font-black tracking-tight uppercase">Authentication</h2>
            </div>
            <p className="text-[15px] text-white/40 leading-relaxed max-w-3xl">
              The SDK authenticates using your Project Key. Pass it once during init — the SDK attaches it automatically to every ingest request as the x-project-key header. Never expose your project key in frontend code or public repos.
            </p>
          </section>

          <section id="node-sdk">
            <div className="flex items-center gap-4 mb-8">
              <Code className="text-[#FF6044] w-6 h-6" />
              <h2 className="text-[28px] font-black tracking-tight uppercase">Node.js SDK</h2>
            </div>
            <p className="text-[15px] text-white/40 leading-relaxed">
              The Node.js SDK is the main way to use Sentinel. It hooks into your Express app automatically — you don't need to add anything to individual routes. CPU, RAM, response times, and errors are all collected without any manual instrumentation.
            </p>
               <section id="implementation">
             <h3 className="text-[20px] font-bold mb-8 flex items-center gap-3">
               <div className="w-2 h-2 bg-[#FF6044] rounded-full" />
               Implementation Example
             </h3>
             <div className="bg-[#0A0A0B] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                <div className="bg-white/5 px-6 py-3 flex items-center justify-between">
                   <span className="text-[11px] text-white/30 uppercase font-bold tracking-widest">SERVER.JS</span>
                   <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                      <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                      <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                   </div>
                </div>
                <div className="p-8">
                  <pre className="text-[14px] leading-relaxed text-white/80 overflow-x-auto">
                    {`// server.js — your existing Express app
import express from 'express';
import { sentinel } from 'sentinel.io';

const app = express();

// Initialize Sentinel — 3 lines, that's it
sentinel.init({
  projectKey: 'your-project-key-here',
  serverUrl: 'https://your-sentinel-server.com'
});

// Attach to Express — auto-tracks all routes
app.use(sentinel.middleware());

app.get('/api/users', (req, res) => {
  res.json({ users: [] });
});

app.listen(3001);`}
                  </pre>
                </div>
             </div>
          </section>         </section>
          <section id="commonjs">
            <div className="flex items-center gap-4 mb-8">
              <Terminal className="text-[#FF6044] w-6 h-6" />
              <h2 className="text-[28px] font-black tracking-tight uppercase">USING WITH COMMONJS</h2>
            </div>
            <p className="text-[15px] text-white/40 leading-relaxed max-w-3xl mb-8">
              If your project uses require() instead of import, the SDK supports CommonJS too.
            </p>
            <div className="bg-[#0A0A0B] border border-white/5 rounded-2xl p-8 mb-8">
              <pre className="text-[14px] text-white/80">
{`// server.js — CommonJS version
const { sentinel } = require('sentinel.io');

sentinel.init({
  projectKey: 'your-project-key-here',
  serverUrl: 'https://your-sentinel-server.com'
});`}
              </pre>
            </div>
          </section>

          <section id="rest-api">
            <div className="flex items-center gap-4 mb-8">
              <Zap className="text-[#FF6044] w-6 h-6" />
              <h2 className="text-[28px] font-black tracking-tight uppercase">REST API</h2>
            </div>
            <p className="text-[15px] text-white/40 leading-relaxed max-w-3xl mb-8">
              If you want to send metrics from a non-Node.js app, or build a custom integration, you can POST directly to the ingest endpoint.
            </p>
            <div className="bg-black border border-white/10 rounded-xl p-8">
              <pre className="text-[13px] text-white/70">
{`POST /v1/ingest
Headers: x-project-key: your-key-here
Content-Type: application/json

{
  "events": [
    {
      "type": "metric",
      "cpuPercent": 34.2,
      "ramPercent": 61.8,
      "timestamp": 1718000000000
    }
  ]
}`}
              </pre>
            </div>
          </section>

          <section id="metrics">
            <div className="flex items-center gap-4 mb-8">
              <Activity className="text-[#FF6044] w-6 h-6" />
              <h2 className="text-[28px] font-black tracking-tight uppercase">High-Frequency Metrics</h2>
            </div>
            <p className="text-[15px] text-white/40 leading-relaxed mb-8">
              Every 5 seconds the SDK reads your server's CPU percentage and RAM usage using Node's built-in os module. These are sent to the server and written to InfluxDB as time-series data points. The dashboard charts are built from these points, so each data point on the graph represents a 5-second snapshot.
            </p>
          </section>

          <section id="database">
            <div className="flex items-center gap-4 mb-8">
              <Database className="text-[#FF6044] w-6 h-6" />
              <h2 className="text-[28px] font-black tracking-tight uppercase">Time-Series (InfluxDB)</h2>
            </div>
            <p className="text-[15px] text-white/40 leading-relaxed">
              InfluxDB stores all metrics because it's built specifically for time-series data. A regular database like PostgreSQL would slow down badly with millions of metric rows. InfluxDB handles this natively and lets us query "show me the last 6 hours of CPU" in milliseconds.
              <br /><br />
              <span className="text-white/60 font-bold">Free tier:</span> data kept for 24 hours then deleted.<br />
              <span className="text-white/60 font-bold">Pro tier:</span> data kept for 30 days.
            </p>
          </section>

          <section id="alerts">
            <div className="flex items-center gap-4 mb-8">
              <Zap className="text-[#FF6044] w-6 h-6" />
              <h2 className="text-[28px] font-black tracking-tight uppercase">Alerting & Webhooks</h2>
            </div>
            <p className="text-[15px] text-white/40 leading-relaxed space-y-4">
              Alerts fire when Sentinel detects an anomaly — like RAM crossing 80% or an endpoint suddenly running 40% slower than its daily average.
              <br /><br />
              To set up Discord or Slack alerts:
              <br />
              1. Create a webhook URL in your Discord server or Slack workspace settings
              <br />
              2. Paste it into your project's alert settings in the Sentinel dashboard
              <br />
              3. Choose which metrics to watch and the threshold
              <br /><br />
              Sentinel sends a POST request to that URL with the metric name, current value, and normal range.
            </p>
          </section>
        </main>
      </div>

      {/* 🏁 Footer */}
      <footer className="border-t border-white/5 py-12 px-10 text-center">
        <p className="text-[11px] text-white/20 uppercase tracking-[0.5em]">
          DOCUMENTATION V1.0 — SENTINEL © 2026
        </p>
      </footer>
    </div>
  );
};

export default Documentation;

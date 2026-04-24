import React from 'react';
import { Cpu, Database, Zap, Terminal, Activity, ChevronLeft, ArrowRight, Share2, ShieldCheck, Cog } from 'lucide-react';
import sentinelLogo from '../assets/sentinellogo.png';

const HowItWorks = ({ onBack, onNavigate }) => {
  const steps = [
    {
      title: 'SDK Ingestion',
      icon: <Cpu className="w-6 h-6 text-[#FF6044]" />,
      desc: 'The Sentinel Node.js agent wraps your application lifecycle, capturing CPU usage, memory heap snapshots, and every console.log/err in real-time with less than 5ms overhead.',
      tag: '01'
    },
    {
      title: 'Time-Series Pulse',
      icon: <Database className="w-6 h-6 text-[#FF6044]" />,
      desc: 'Metrics are streamed to our redundant InfluxDB clusters, where they are indexed for high-frequency alerting and long-term performance trend analysis.',
      tag: '02'
    },
    {
      title: 'Reactive Intelligence',
      icon: <Activity className="w-6 h-6 text-[#FF6044]" />,
      desc: 'Our anomaly engine compares current throughput against historical baselines. If a deviation is detected (e.g., 500ms API spike), an automated protocol is triggered.',
      tag: '03'
    },
    {
      title: 'Omnichannel Alerts',
      icon: <Zap className="w-6 h-6 text-[#FF6044]" />,
      desc: 'Critical failures are relayed through our WebSocket bridge directly to your browser and via webhooks to Slack, Discord, or your custom PagerDuty integration.',
      tag: '04'
    }
  ];

  return (
    <div className="min-h-screen bg-[#050506] text-[#EFFFEB] font-mono selection:bg-[#FF6044]/30">
      {/* 🚀 Simple Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-3xl border-b border-white/5 px-10 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6 cursor-pointer" onClick={onBack}>
          <img src={sentinelLogo} alt="Sentinel" className="h-10 w-auto" />
        </div>
        <button 
          onClick={onBack}
          className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-2 rounded-lg text-[13px] font-bold transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Portal
        </button>
      </nav>

      <main className="pt-40 pb-24 px-10 max-w-7xl mx-auto">
        <div className="max-w-4xl mb-32">
          <div className="flex items-center gap-3 mb-6">
            <Cog className="w-5 h-5 text-[#FF6044] animate-spin-slow" />
            <span className="text-[12px] font-black uppercase tracking-[0.4em] text-white/40">HOW IT WORKS</span>
          </div>
          <h1 className="text-[54px] font-black tracking-tighter mb-8 leading-none">
            The Mechanics of <br />
            <span className="text-[#FF6044]">Absolute Visibility.</span>
          </h1>
          <p className="text-[18px] text-white/50 leading-relaxed">
            You install the SDK, drop three lines into your app, and that's it. Every metric and log from that point is collected, stored, analyzed, and delivered to your dashboard in real time.
          </p>
        </div>

        {/* 🗺️ Process Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 border border-white/5 rounded-[40px] overflow-hidden">
          {/* Card 01 */}
          <div className="bg-[#050506] p-16 group hover:bg-white/[0.02] transition-all relative overflow-hidden">
            <div className="absolute top-10 right-10 text-[64px] font-black text-white/[0.02] group-hover:text-[#FF6044]/5 transition-colors">01</div>
            <div className="w-14 h-14 bg-white/[0.01] border border-white/10 rounded-2xl flex items-center justify-center mb-10 group-hover:border-[#FF6044]/40 transition-colors">
              <Cpu className="w-6 h-6 text-[#FF6044]" />
            </div>
            <h3 className="text-[24px] font-bold mb-6 tracking-tight">SDK Ingestion</h3>
            <p className="text-[15px] text-white/40 leading-relaxed max-w-md">
              Once installed, the SDK starts collecting automatically. Every 5 seconds it reads your CPU usage and RAM from Node's built-in os module. Every HTTP request gets timed from start to finish. Every console.log and error gets captured. All of it is batched and sent to the Sentinel server in one small POST request; it adds less than 1ms of overhead on each request your app handles.
            </p>
            <div 
              className="mt-12 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-[#FF6044] opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0 cursor-pointer"
              onClick={() => onNavigate('documentation', 'installation')}
            >
              VIEW SDK DOCS <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          {/* Card 02 */}
          <div className="bg-[#050506] p-16 group hover:bg-white/[0.02] transition-all relative overflow-hidden">
            <div className="absolute top-10 right-10 text-[64px] font-black text-white/[0.02] group-hover:text-[#FF6044]/5 transition-colors">02</div>
            <div className="w-14 h-14 bg-white/[0.01] border border-white/10 rounded-2xl flex items-center justify-center mb-10 group-hover:border-[#FF6044]/40 transition-colors">
              <Database className="w-6 h-6 text-[#FF6044]" />
            </div>
            <h3 className="text-[24px] font-bold mb-6 tracking-tight">Time-Series Pulse</h3>
            <p className="text-[15px] text-white/40 leading-relaxed max-w-md">
              When the server receives your metrics, it writes them to InfluxDB. This database is built specifically for time-series data like CPU readings and response times. This means querying "show me the last 6 hours of RAM usage" takes milliseconds even with millions of data points stored.
            </p>
            <div 
              className="mt-12 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-[#FF6044] opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0 cursor-pointer"
              onClick={() => onNavigate('documentation', 'database')}
            >
              VIEW DATABASE SPEC <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          {/* Card 03 */}
          <div className="bg-[#050506] p-16 group hover:bg-white/[0.02] transition-all relative overflow-hidden">
            <div className="absolute top-10 right-10 text-[64px] font-black text-white/[0.02] group-hover:text-[#FF6044]/5 transition-colors">03</div>
            <div className="w-14 h-14 bg-white/[0.01] border border-white/10 rounded-2xl flex items-center justify-center mb-10 group-hover:border-[#FF6044]/40 transition-colors">
              <Activity className="w-6 h-6 text-[#FF6044]" />
            </div>
            <h3 className="text-[24px] font-bold mb-6 tracking-tight">Anomaly Detection</h3>
            <p className="text-[15px] text-white/40 leading-relaxed max-w-md">
              Every 60 seconds, Sentinel compares your last 5 minutes of data against the last 24 hours. If any endpoint is 40% slower than its daily average, or if RAM crosses 80%, or if errors spike suddenly, an alert job is queued. No manual threshold configuration needed to get started, though you can customize everything from the dashboard.
            </p>
            <div 
              className="mt-12 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-[#FF6044] opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0 cursor-pointer"
              onClick={() => onNavigate('documentation', 'metrics')}
            >
              PROTOCOL DETAILS <ArrowRight className="w-3 h-3" />
            </div>
          </div>

          {/* Card 04 */}
          <div className="bg-[#050506] p-16 group hover:bg-white/[0.02] transition-all relative overflow-hidden">
            <div className="absolute top-10 right-10 text-[64px] font-black text-white/[0.02] group-hover:text-[#FF6044]/5 transition-colors">04</div>
            <div className="w-14 h-14 bg-white/[0.01] border border-white/10 rounded-2xl flex items-center justify-center mb-10 group-hover:border-[#FF6044]/40 transition-colors">
              <Zap className="w-6 h-6 text-[#FF6044]" />
            </div>
            <h3 className="text-[24px] font-bold mb-6 tracking-tight">Discord & Slack Alerts</h3>
            <p className="text-[15px] text-white/40 leading-relaxed max-w-md">
              When an anomaly is detected, Sentinel sends an alert to whatever channel you configured: Discord, Slack, or email. Alerts include the metric name, the current value, and what the normal range is. A 10-minute cooldown prevents the same alert from spamming you repeatedly.
            </p>
            <div 
              className="mt-12 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-[#FF6044] opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0 cursor-pointer"
              onClick={() => onNavigate('documentation', 'alerts')}
            >
              CHANNEL SETTINGS <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </div>

        {/* 🛠️ Connectivity Deep Dive */}
        <div className="mt-40 grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="space-y-6 p-10 bg-white/[0.01] border border-white/5 rounded-3xl">
             <Share2 className="w-8 h-8 text-[#FF6044]" />
             <h4 className="text-[18px] font-bold">How the SDK connects</h4>
             <p className="text-[13px] text-white/40 leading-relaxed">
               The SDK batches collected data in memory and sends it every 5 seconds via a simple HTTP POST. If the Sentinel server is unreachable, the SDK fails silently; your app keeps running normally and unsent data is dropped. Your app's uptime is never dependent on Sentinel's uptime.
             </p>
          </div>
          <div className="space-y-6 p-10 bg-white/[0.01] border border-white/5 rounded-3xl">
             <ShieldCheck className="w-8 h-8 text-[#FF6044]" />
             <h4 className="text-[18px] font-bold">Project Keys & Auth</h4>
             <p className="text-[13px] text-white/40 leading-relaxed">
               Every project gets a unique key when you create it in the dashboard. The SDK sends this key with every request. On the server, it's validated against a bcrypt hash in the database. You can rotate your key at any time from the dashboard without reinstalling the SDK.
             </p>
          </div>
          <div className="space-y-6 p-10 bg-white/[0.01] border border-white/5 rounded-3xl">
             <Terminal className="w-8 h-8 text-[#FF6044]" />
             <h4 className="text-[18px] font-bold">WebSocket Streaming</h4>
             <p className="text-[13px] text-white/40 leading-relaxed">
               When your app sends a log, it hits the server and gets published to a Redis channel instantly. The dashboard has an open WebSocket connection subscribed to that channel. The log appears in your browser terminal within 200ms of your app writing it. No polling or page refresh needed.
             </p>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/5 py-12 px-10 text-center">
        <p className="text-[11px] text-white/20 uppercase tracking-[0.5em]">
          BUILT FOR NODE.JS DEVELOPERS. SENTINEL © 2026
        </p>
      </footer>
    </div>
  );
};

export default HowItWorks;

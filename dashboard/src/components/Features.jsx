import React from 'react';
import { Activity, Shield, Terminal, Zap, ChevronLeft, ArrowRight, Layers, BarChart3, Cloud, Cpu, Layout, Workflow } from 'lucide-react';
import sentinelLogo from '../assets/sentinellogo.png';

const Features = ({ onBack, onGetStarted, onNavigate }) => {
  const featureList = [
    {
      title: 'High-Frequency Telemetry',
      icon: <Activity className="w-8 h-8 text-[#FF6044]" />,
      desc: 'Real-time CPU and Memory tracking with micro-second resolution. Sentinel agent captures system heartbeats without impacting application performance.'
    },
    {
      title: 'Zero-Config Log Mirroring',
      icon: <Terminal className="w-8 h-8 text-[#FF6044]" />,
      desc: 'Tail production logs directly in your browser. No SSH. No complex configuration. One command installation and you are live.'
    },
    {
      title: 'Anomaly Thresholds',
      icon: <Zap className="w-8 h-8 text-[#FF6044]" />,
      desc: 'AI-driven baseline analysis. Sentinel learns your normal operation patterns and alerts you only when a genuine deviation occurs.'
    },
    {
      title: 'Distributed Tracing',
      icon: <Share2 className="w-8 h-8 text-[#FF6044]" />,
      desc: "Follow a request's journey through your entire microservices architecture. Visualize bottlenecks and latency spikes instantly."
    },
    {
      title: 'Security Auditing',
      icon: <Shield className="w-8 h-8 text-[#FF6044]" />,
      desc: 'Audit every interaction within your dashboard. We maintain a strict ledger of who saw what telemetry and when.'
    },
    {
      title: 'Universal SDKs',
      icon: <Layers className="w-8 h-8 text-[#FF6044]" />,
      desc: 'Native support for Node.js, Go, and Python. Our lightweight agents are built in C++ for maximum efficiency and minimum footprint.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#050506] text-[#EFFFEB] font-mono selection:bg-[#FF6044]/30">
        {/* 🚀 Nav */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-3xl border-b border-white/5 px-10 py-4 flex items-center justify-between">
            <div className="flex items-center gap-6 cursor-pointer" onClick={onBack}>
                <img src={sentinelLogo} alt="Sentinel" className="h-10 w-auto" />
            </div>
            <div className="flex gap-4">
                <button 
                onClick={onBack}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-2 rounded-lg text-[13px] font-bold transition-all"
                >
                <ChevronLeft className="w-4 h-4" />
                Back
                </button>
                <button 
                onClick={onGetStarted}
                className="bg-[#FF6044] hover:bg-[#FF8B77] text-black px-8 py-2 rounded-lg text-[13px] font-black transition-all shadow-xl shadow-[#FF6044]/20 uppercase tracking-widest"
                >
                Get Started
                </button>
            </div>
        </nav>

        <main className="pt-40 pb-32 px-10 max-w-7xl mx-auto">
            <div className="max-w-4xl mb-32">
                <div className="flex items-center gap-3 mb-6">
                    <Layout className="w-5 h-5 text-[#FF6044]" />
                    <span className="text-[12px] font-black uppercase tracking-[0.4em] text-white/40">WHAT SENTINEL DOES</span>
                </div>
                <h1 className="text-[54px] font-black tracking-tighter mb-8 leading-none">
                    Engineered for <br />
                    <span className="text-[#FF6044]">Peak Performance.</span>
                </h1>
                <p className="text-[18px] text-white/50 leading-relaxed max-w-2xl">
                    You built something. Now you need to know if it's <br />
                    actually working. Sentinel gives you a live window <br />
                    into your Node.js app. CPU, memory, API speed, <br />
                    errors, and logs are all in one place, with no complex <br />
                    setup required.
                </p>
            </div>

            {/* 🛸 Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Card 1 */}
                <div className="group p-10 bg-white/[0.01] border border-white/5 rounded-3xl hover:bg-white/[0.03] hover:border-[#FF6044]/20 transition-all">
                    <div className="mb-10 w-14 h-14 bg-black border border-white/10 rounded-2xl flex items-center justify-center group-hover:border-[#FF6044]/40 transition-colors">
                        <Activity className="w-8 h-8 text-[#FF6044]" />
                    </div>
                    <h3 className="text-[20px] font-bold mb-6 group-hover:text-[#FF6044] transition-colors">High-Frequency Telemetry</h3>
                    <p className="text-[14px] text-white/40 leading-relaxed min-h-[80px]">
                        CPU and RAM readings every 5 seconds, straight from your server. See memory climbing before it becomes a crash. The SDK adds less than 1ms overhead to your app; you won't feel it.
                    </p>
                    <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
                        <span className="text-[11px] font-black text-white/20 uppercase tracking-widest cursor-pointer hover:text-[#FF6044] transition-colors" onClick={() => onNavigate('documentation', 'metrics')}>LEARN MORE</span>
                        <ArrowRight className="w-4 h-4 text-white/10 group-hover:text-[#FF6044] transition-colors" />
                    </div>
                </div>

                {/* Card 2 */}
                <div className="group p-10 bg-white/[0.01] border border-white/5 rounded-3xl hover:bg-white/[0.03] hover:border-[#FF6044]/20 transition-all">
                    <div className="mb-10 w-14 h-14 bg-black border border-white/10 rounded-2xl flex items-center justify-center group-hover:border-[#FF6044]/40 transition-colors">
                        <Terminal className="w-8 h-8 text-[#FF6044]" />
                    </div>
                    <h3 className="text-[20px] font-bold mb-6 group-hover:text-[#FF6044] transition-colors">Zero-Config Log Mirroring</h3>
                    <p className="text-[14px] text-white/40 leading-relaxed min-h-[80px]">
                        Every console.log, warning, and error your app writes shows up in a live terminal in your browser. No SSH, no server access, no setup beyond the initial npm install.
                    </p>
                    <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
                        <span className="text-[11px] font-black text-white/20 uppercase tracking-widest cursor-pointer hover:text-[#FF6044] transition-colors" onClick={() => onNavigate('documentation', 'metrics')}>LEARN MORE</span>
                        <ArrowRight className="w-4 h-4 text-white/10 group-hover:text-[#FF6044] transition-colors" />
                    </div>
                </div>

                {/* Card 3 */}
                <div className="group p-10 bg-white/[0.01] border border-white/5 rounded-3xl hover:bg-white/[0.03] hover:border-[#FF6044]/20 transition-all">
                    <div className="mb-10 w-14 h-14 bg-black border border-white/10 rounded-2xl flex items-center justify-center group-hover:border-[#FF6044]/40 transition-colors">
                        <Zap className="w-8 h-8 text-[#FF6044]" />
                    </div>
                    <h3 className="text-[20px] font-bold mb-6 group-hover:text-[#FF6044] transition-colors">Anomaly Thresholds</h3>
                    <p className="text-[14px] text-white/40 leading-relaxed min-h-[80px]">
                        Sentinel watches your app's normal behaviour over 24 hours and alerts you when something deviates. If your /login endpoint is suddenly 40% slower than yesterday, you'll know immediately.
                    </p>
                    <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
                        <span className="text-[11px] font-black text-white/20 uppercase tracking-widest cursor-pointer hover:text-[#FF6044] transition-colors" onClick={() => onNavigate('documentation', 'metrics')}>LEARN MORE</span>
                        <ArrowRight className="w-4 h-4 text-white/10 group-hover:text-[#FF6044] transition-colors" />
                    </div>
                </div>

                {/* Card 4 */}
                <div className="group p-10 bg-white/[0.01] border border-white/5 rounded-3xl hover:bg-white/[0.03] hover:border-[#FF6044]/20 transition-all">
                    <div className="mb-10 w-14 h-14 bg-black border border-white/10 rounded-2xl flex items-center justify-center group-hover:border-[#FF6044]/40 transition-colors">
                        <Workflow className="w-8 h-8 text-[#FF6044]" />
                    </div>
                    <h3 className="text-[20px] font-bold mb-6 group-hover:text-[#FF6044] transition-colors">Request Timeline</h3>
                    <p className="text-[14px] text-white/40 leading-relaxed min-h-[80px]">
                        See how long each part of a request takes (database query, middleware, response time). Find exactly where your app is slow without guessing.
                    </p>
                    <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
                        <span className="text-[11px] font-black text-white/20 uppercase tracking-widest cursor-pointer hover:text-[#FF6044] transition-colors" onClick={() => onNavigate('documentation', 'metrics')}>LEARN MORE</span>
                        <ArrowRight className="w-4 h-4 text-white/10 group-hover:text-[#FF6044] transition-colors" />
                    </div>
                </div>

                {/* Card 5 */}
                <div className="group p-10 bg-white/[0.01] border border-white/5 rounded-3xl hover:bg-white/[0.03] hover:border-[#FF6044]/20 transition-all">
                    <div className="mb-10 w-14 h-14 bg-black border border-white/10 rounded-2xl flex items-center justify-center group-hover:border-[#FF6044]/40 transition-colors">
                        <Shield className="w-8 h-8 text-[#FF6044]" />
                    </div>
                    <h3 className="text-[20px] font-bold mb-6 group-hover:text-[#FF6044] transition-colors">Error Tracking</h3>
                    <p className="text-[14px] text-white/40 leading-relaxed min-h-[80px]">
                        Every uncaught error and unhandled promise rejection is captured with its full stack trace. See errors the moment they happen, not when a user reports them.
                    </p>
                    <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
                        <span className="text-[11px] font-black text-white/20 uppercase tracking-widest cursor-pointer hover:text-[#FF6044] transition-colors" onClick={() => onNavigate('documentation', 'metrics')}>LEARN MORE</span>
                        <ArrowRight className="w-4 h-4 text-white/10 group-hover:text-[#FF6044] transition-colors" />
                    </div>
                </div>

                {/* Card 6 */}
                <div className="group p-10 bg-white/[0.01] border border-white/5 rounded-3xl hover:bg-white/[0.03] hover:border-[#FF6044]/20 transition-all">
                    <div className="mb-10 w-14 h-14 bg-black border border-white/10 rounded-2xl flex items-center justify-center group-hover:border-[#FF6044]/40 transition-colors">
                        <Layers className="w-8 h-8 text-[#FF6044]" />
                    </div>
                    <h3 className="text-[20px] font-bold mb-6 group-hover:text-[#FF6044] transition-colors">npm SDK</h3>
                    <p className="text-[14px] text-white/40 leading-relaxed min-h-[80px]">
                        One package. Three lines of code. Works with any Express or Node.js app. No config files, no agents to manage, no infrastructure to maintain. Just install and you're live.
                    </p>
                    <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
                        <span className="text-[11px] font-black text-white/20 uppercase tracking-widest cursor-pointer hover:text-[#FF6044] transition-colors" onClick={() => onNavigate('documentation', 'installation')}>LEARN MORE</span>
                        <ArrowRight className="w-4 h-4 text-white/10 group-hover:text-[#FF6044] transition-colors" />
                    </div>
                </div>
            </div>

            {/* 🏗️ Infrastructure Integration */}
            <div className="mt-40 bg-gradient-to-br from-[#FF6044]/10 to-transparent border border-white/5 rounded-[40px] p-20 flex flex-col lg:flex-row items-center gap-20">
                <div className="flex-1 space-y-10">
                    <h2 className="text-[36px] font-black tracking-tight">One SDK. <br /> Everything covered.</h2>
                    <p className="text-[16px] text-white/40 leading-relaxed">
                        Install the Sentinel SDK into your Node.js app and get CPU tracking, memory monitoring, API response times, live logs, and error capture all running automatically. No extra config and no separate agents for each feature.
                    </p>
                    <div className="grid grid-cols-2 gap-8">
                        <div className="flex items-center gap-4">
                            <Workflow className="w-5 h-5 text-[#FF6044]" />
                            <span className="text-[13px] font-bold">Slack Alerts</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Layout className="w-5 h-5 text-[#FF6044]" />
                            <span className="text-[13px] font-bold">Discord Alerts</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <BarChart3 className="w-5 h-5 text-[#FF6044]" />
                            <span className="text-[13px] font-bold">24h Baselines</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Shield className="w-5 h-5 text-[#FF6044]" />
                            <span className="text-[13px] font-bold">Error Capture</span>
                        </div>
                    </div>
                </div>
                <div className="w-full lg:w-[400px] aspect-square bg-black border border-white/10 rounded-3xl relative overflow-hidden group">
                     {/* Decorative element mimicking a technical graph */}
                     <div className="absolute inset-0 p-8 space-y-4 opacity-40 group-hover:opacity-100 transition-opacity">
                        {[40, 70, 45, 90, 60].map((h, i) => (
                            <div key={i} className="w-full h-1 bg-white/5 relative">
                                <div className="absolute top-0 left-0 h-full bg-[#FF6044]" style={{ width: `${h}%` }} />
                            </div>
                        ))}
                        <div className="mt-12 text-[10px] text-[#FF6044] uppercase font-black animate-pulse">COLLECTING METRICS...</div>
                     </div>
                </div>
            </div>
        </main>

        <footer className="border-t border-white/5 py-12 px-10 text-center">
            <p className="text-[11px] text-white/20 uppercase tracking-[0.5em]">
                Engineered for Infinite Scale. Sentinel © 2026
            </p>
        </footer>
    </div>
  );
};

// Internal icon for the distributed tracing
const Share2 = ({ className }) => (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
);

export default Features;

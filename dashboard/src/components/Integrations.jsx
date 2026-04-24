import React from 'react';
import { Slack, MessageSquare, Mail, Database, Cloud, Github, Cpu, ArrowUpRight, Zap, Bell, Server } from 'lucide-react';
import sentinelLogo from '../assets/sentinellogo.png';

const Integrations = ({ onBack, onNavigate }) => {
  const integrationCategories = [
    {
      title: 'Communication',
      icon: <MessageSquare className="w-5 h-5 text-[#FF6044]" />,
      items: [
        { name: 'Slack', icon: <Slack className="w-6 h-6" />, status: 'SUPPORTED', desc: 'Paste your Slack incoming webhook URL into the alert settings. When an anomaly is detected, Sentinel posts a message to your chosen channel.', link: 'alerts' },
        { name: 'Discord', icon: <MessageSquare className="w-6 h-6" />, status: 'SUPPORTED', desc: "Works exactly like Slack but for Discord servers. Create a webhook in your server settings, paste the URL into Sentinel, and you're done.", link: 'alerts' },
        { name: 'Email', icon: <Mail className="w-6 h-6" />, status: 'NATIVE', desc: 'Add an email address to any alert rule and Sentinel will send a clean HTML email when the threshold is crossed.', link: 'alerts' }
      ]
    },
    {
      title: 'Internal Stack',
      icon: <Server className="w-5 h-5 text-[#FF6044]" />,
      items: [
        { name: 'InfluxDB', icon: <Database className="w-6 h-6" />, status: 'CORE DATABASE', desc: 'All your metrics are stored in InfluxDB. It is built for time-series data and lets Sentinel query millions of data points by time range in under 500ms.', hideAction: true },
        { name: 'Redis', icon: <Zap className="w-6 h-6" />, status: 'CORE CACHE', desc: 'Redis powers the pub/sub channel for live logs and the BullMQ job queue that handles alert delivery without blocking the API.', hideAction: true },
        { name: 'PostgreSQL', icon: <Database className="w-6 h-6" />, status: 'CORE DATABASE', desc: 'Users, projects, alert rules, error logs, and project keys are all stored in PostgreSQL, handling the relational side of Sentinel.', hideAction: true }
      ]
    },
    {
      title: 'Databases',
      icon: <Database className="w-5 h-5 text-[#FF6044]" />,
      items: [
        { name: 'InfluxDB', icon: <Database className="w-6 h-6" />, status: 'CORE', desc: 'Where all your CPU, RAM, and response time readings live. Sentinel writes a new data point every 5 seconds per monitored app.', link: 'database' },
        { name: 'PostgreSQL', icon: <Database className="w-6 h-6" />, status: 'NATIVE', desc: "Stores your account, projects, alert rules, error logs, and alert history. Everything you configure in the dashboard is saved here.", link: 'database' },
        { name: 'Redis', icon: <Zap className="w-6 h-6" />, status: 'NATIVE', desc: 'Broadcasts live logs to your browser via WebSocket pub/sub, and queues alert delivery jobs via BullMQ.', link: 'database' }
      ]
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
          className="bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-2 rounded-lg text-[13px] font-bold transition-all"
        >
          Back to Portal
        </button>
      </nav>

      <main className="pt-40 pb-24 px-10 max-w-7xl mx-auto">
        <div className="max-w-4xl mb-24">
          <h1 className="text-[54px] font-black tracking-tighter mb-8 leading-none">
            Where Sentinel <br />
            <span className="text-[#FF6044]">sends your alerts.</span>
          </h1>
          <p className="text-[18px] text-white/50 leading-relaxed">
            Sentinel doesn't just show problems on a dashboard. It tells you about them wherever you already work. Configure your alert channels once and Sentinel handles the rest automatically.
          </p>
        </div>

        <div className="space-y-32">
          {integrationCategories.map((category, idx) => (
            <div key={idx} className="space-y-12">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white/[0.03] border border-white/10 rounded-xl flex items-center justify-center">
                  {category.icon}
                </div>
                <h3 className="text-[14px] font-black uppercase tracking-[0.4em] text-white/40">{category.title}</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.items.map((item, i) => (
                  <div key={i} className="bg-white/[0.01] border border-white/5 p-8 rounded-3xl hover:bg-white/[0.04] hover:border-white/20 transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowUpRight className="w-5 h-5 text-[#FF6044]" />
                    </div>
                    
                    <div className="flex items-center gap-6 mb-8">
                      <div className="w-14 h-14 bg-black border border-white/10 rounded-2xl flex items-center justify-center shadow-2xl group-hover:border-[#FF6044]/40 transition-colors">
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="text-[18px] font-bold text-white">{item.name}</h4>
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#FF6044]">{item.status}</span>
                      </div>
                    </div>
                    
                    <p className="text-[13px] text-white/40 leading-relaxed h-12">
                      {item.desc}
                    </p>
                    
                    {!item.hideAction && (
                      <button 
                        onClick={() => item.link && onNavigate && onNavigate('documentation', item.link)}
                        className="mt-8 text-[11px] font-bold text-white/30 uppercase tracking-[0.2em] group-hover:text-white transition-colors flex items-center gap-2"
                      >
                         {category.title === 'Databases' ? 'Learn More' : 'Configure Integration'}
                         <Zap className="w-3 h-3 text-[#FF6044]" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 🛠️ SDK CTA Section */}
        <div className="mt-40 bg-gradient-to-r from-[#FF6044]/20 to-transparent border border-[#FF6044]/20 p-12 rounded-[40px] flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden">
           <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#FF6044]/10 blur-[120px] rounded-full" />
           <div className="relative z-10 max-w-xl">
             <h4 className="text-[28px] font-black mb-4">Can't find your stack?</h4>
             <p className="text-[14px] text-white/50 leading-relaxed">
               Sentinel's alert system is built on simple webhooks. If your tool can receive a POST request, you can connect it to Sentinel. Check the documentation for the payload format.
             </p>
           </div>
           <button 
            onClick={() => onNavigate('documentation', 'alerts')}
            className="bg-[#FF6044] hover:bg-[#FF8B77] text-black px-10 py-4 rounded-xl font-black text-[13px] uppercase tracking-widest transition-all shadow-xl shadow-[#FF6044]/10 cursor-pointer"
          >
            View API Docs
          </button>
        </div>
      </main>

      {/* 🏁 Footer */}
      <footer className="border-t border-white/5 py-12 px-10 text-center">
        <p className="text-[11px] text-white/20 uppercase tracking-[0.5em]">
          DISCORD · SLACK · EMAIL · SENTINEL © 2026
        </p>
     </footer>
    </div>
  );
};

export default Integrations;

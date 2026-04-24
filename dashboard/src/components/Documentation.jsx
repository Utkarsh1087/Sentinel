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
      content: 'Initialize the Sentinel SDK in your project with just three lines of code. Get real-time observability in seconds.'
    },
    {
      id: 'metrics',
      title: 'Metrics Tracking',
      icon: <Activity className="w-5 h-5 text-[#FF6044]" />,
      content: 'Monitor CPU, RAM, and Database latency using our high-frequency polling engine.'
    },
    {
      id: 'security',
      title: 'Security',
      icon: <Shield className="w-5 h-5 text-[#FF6044]" />,
      content: 'Sentinel uses zero-trust architecture to ensure your telemetry data is encrypted and isolated.'
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
                { label: 'React Hooks', id: 'react-hooks' },
                { label: 'Go Client', id: 'go-client' },
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
        </aside>

        {/* Right: Main Content */}
        <main className="space-y-24">
          <section id="introduction">
            <h1 className="text-[48px] font-black tracking-tighter mb-8 leading-none">The Vanguard of <br /><span className="text-[#FF6044]">Developer Observability.</span></h1>
            <p className="text-[18px] text-white/60 leading-relaxed max-w-3xl mb-12">
              Sentinel is more than a monitoring tool. It is a logic-driven ecosystem that tracks your application's health, analyzes performance bottlenecks with AI, and secures your infrastructure with real-time alerts.
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
              Sentinel's internal logic is split into three distinct layers: Ingestion, Analysis, and Delivery. Data flows from your Node.js application via the SDK to our regional collectors, where it is analyzed in real-time before being stored in our time-series cluster.
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
                  Before initializing, ensure you have your <span className="text-white font-bold underline decoration-[#FF6044]/40">Organization API Key</span> ready from the Sentinel Dashboard Settings.
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
              All requests to the Sentinel API must be authenticated using an API Key. This key should be passed in the `x-api-key` header for REST requests, or provided during the SDK initialization phase.
            </p>
          </section>

          <section id="node-sdk">
            <div className="flex items-center gap-4 mb-8">
              <Code className="text-[#FF6044] w-6 h-6" />
              <h2 className="text-[28px] font-black tracking-tight uppercase">Node.js SDK</h2>
            </div>
            <p className="text-[15px] text-white/40 leading-relaxed">
              The Node.js SDK is our most mature client. It automatically hooks into the global error handler and the `http` module to track performance without manual instrumentation.
            </p>
          </section>

          <section id="react-hooks">
             <h3 className="text-[20px] font-bold mb-8 flex items-center gap-3">
               <div className="w-2 h-2 bg-[#FF6044] rounded-full" />
               Implementation Example
             </h3>
             <div className="bg-[#0A0A0B] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                <div className="bg-white/5 px-6 py-3 flex items-center justify-between">
                   <span className="text-[11px] text-white/30 uppercase font-bold tracking-widest">App.jsx</span>
                   <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                      <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                      <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
                   </div>
                </div>
                <div className="p-8">
                  <pre className="text-[14px] leading-relaxed text-white/80 overflow-x-auto">
                    {`import { SentinelProvider } from 'sentinel.io';

function App() {
  return (
    <SentinelProvider apiKey="your-key-here">
      <Dashboard />
    </SentinelProvider>
  );
}`}
                  </pre>
                </div>
             </div>
          </section>
          <section id="go-client">
            <div className="flex items-center gap-4 mb-8">
              <Terminal className="text-[#FF6044] w-6 h-6" />
              <h2 className="text-[28px] font-black tracking-tight uppercase">Go Client</h2>
            </div>
            <p className="text-[15px] text-white/40 leading-relaxed max-w-3xl">
              Available as a beta release. The Go client provides high-performance telemetry ingestion for highly concurrent systems using lightweight goroutines.
            </p>
          </section>

          <section id="rest-api">
            <div className="flex items-center gap-4 mb-8">
              <Zap className="text-[#FF6044] w-6 h-6" />
              <h2 className="text-[28px] font-black tracking-tight uppercase">REST API</h2>
            </div>
            <p className="text-[15px] text-white/40 leading-relaxed max-w-3xl">
              For custom implementations, you can push metrics directly to our ingestion endpoint via POST requests. Refer to the Alerts documentation for the precise JSON schema.
            </p>
          </section>

          <section id="metrics">
            <div className="flex items-center gap-4 mb-8">
              <Activity className="text-[#FF6044] w-6 h-6" />
              <h2 className="text-[28px] font-black tracking-tight uppercase">High-Frequency Metrics</h2>
            </div>
            <p className="text-[15px] text-white/40 leading-relaxed mb-8">
              Sentinel polls system resources via the Node.js `os` and `process` modules every 5 seconds. This includes CPU user/system time, RSS memory, and event loop lag. These heartbeat metrics arrive in InfluxDB as time-series points, providing a high-resolution window into your app's health.
            </p>
          </section>

          <section id="database">
            <div className="flex items-center gap-4 mb-8">
              <Database className="text-[#FF6044] w-6 h-6" />
              <h2 className="text-[28px] font-black tracking-tight uppercase">Time-Series (InfluxDB)</h2>
            </div>
            <p className="text-[15px] text-white/40 leading-relaxed">
              We use InfluxDB for its superior handling of high-cardinality time-series data. Each project's metrics are isolated by project keys. Retention policies are enforced at the bucket level, ensuring that stale data is purged based on your tier (24h or 30 days).
            </p>
          </section>

          <section id="alerts">
            <div className="flex items-center gap-4 mb-8">
              <Zap className="text-[#FF6044] w-6 h-6" />
              <h2 className="text-[28px] font-black tracking-tight uppercase">Alerting & Webhooks</h2>
            </div>
            <p className="text-[15px] text-white/40 leading-relaxed">
              Alerts are triggered when our anomaly engine detects a deviation. Integration with Discord and Slack is achieved via standard webhooks. You simply provide the webhook URL in your project settings, and Sentinel will dispatch JSON payloads containing the metric name, violation value, and its architectural context.
            </p>
          </section>
        </main>
      </div>

      {/* 🏁 Footer */}
      <footer className="border-t border-white/5 py-12 px-10 text-center">
        <p className="text-[11px] text-white/20 uppercase tracking-[0.5em]">
          Engineered for reliability. Sentinel © 2026
        </p>
      </footer>
    </div>
  );
};

export default Documentation;

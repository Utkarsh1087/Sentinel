import React from 'react';
import { Shield, Lock, Eye, FileText, ChevronLeft } from 'lucide-react';
import sentinelLogo from '../assets/sentinellogo.png';

const PrivacyPolicy = ({ onBack }) => {
  const sections = [
    {
      title: 'Data Collection & Telemetry',
      icon: <Eye className="w-5 h-5 text-[#FF6044]" />,
      content: 'We collect system-level telemetry (CPU, memory, logs, network latency) solely for the purpose of providing observability services. Sentinel does not inspect the contents of your application memory or database records beyond the metadata required for monitoring.'
    },
    {
      title: 'Encryption Protocols',
      icon: <Lock className="w-5 h-5 text-[#FF6044]" />,
      content: 'All data transmitted to the Sentinel ingestion engine is encrypted via TLS 1.3 in transit and AES-256 at rest. Your Organization API Key is hashed using industry-standard cryptographic functions.'
    },
    {
      title: 'Compliance & sovereignty',
      icon: <Shield className="w-5 h-5 text-[#FF6044]" />,
      content: 'Sentinel adheres to a strict data isolation policy. Each project exists in a logically separate environment. We support GDPR and CCPA requests for data export and deletion through our administrative portal.'
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

      <main className="pt-40 pb-24 px-10 max-w-4xl mx-auto">
        <div className="mb-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-2 bg-[#FF6044] rounded-full animate-pulse" />
            <span className="text-[12px] font-black uppercase tracking-[0.4em] text-white/40">PRIVACY POLICY</span>
          </div>
          <h1 className="text-[54px] font-black tracking-tighter mb-8 leading-none">
            Privacy & Data <br />
            <span className="text-[#FF6044]">Governance.</span>
          </h1>
          <p className="text-[18px] text-white/50 leading-relaxed">
            Sentinel only collects what it needs to work. <br />
            Your app's metrics and logs are used to power <br />
            your dashboard. We don't sell <br />
            data, we don't share it, and we don't look at <br />
            it unless you ask us to help debug something.
          </p>
        </div>

        <div className="space-y-16">
          {/* Section 1 */}
          <div className="bg-white/[0.01] border border-white/5 p-12 rounded-[40px] hover:bg-white/[0.03] transition-all group">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-black border border-white/10 rounded-2xl flex items-center justify-center group-hover:border-[#FF6044]/40 transition-colors">
                <Eye className="w-5 h-5 text-[#FF6044]" />
              </div>
              <h3 className="text-[20px] font-bold">Data Collection & Telemetry</h3>
            </div>
            <p className="text-[15px] text-white/40 leading-relaxed">
              The Sentinel SDK collects CPU usage, RAM usage, HTTP request metadata (route, method, status code, response time), and any logs you explicitly send via sentinel.log(). <br /><br />
              We do not read your database contents, your request bodies, your user data, or anything else your app processes. The SDK only sees what the Node.js runtime exposes — nothing more.
            </p>
          </div>

          {/* Section 2 */}
          <div className="bg-white/[0.01] border border-white/5 p-12 rounded-[40px] hover:bg-white/[0.03] transition-all group">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-black border border-white/10 rounded-2xl flex items-center justify-center group-hover:border-[#FF6044]/40 transition-colors">
                <Lock className="w-5 h-5 text-[#FF6044]" />
              </div>
              <h3 className="text-[20px] font-bold">Encryption Protocols</h3>
            </div>
            <p className="text-[15px] text-white/40 leading-relaxed">
              All data sent from the SDK to the Sentinel server travels over HTTPS; it's encrypted in transit. Your project key is stored as a bcrypt hash in our database, not as plain text. Even if our database were compromised, your key would be safe.
            </p>
          </div>

          {/* Section 3 */}
          <div className="bg-white/[0.01] border border-white/5 p-12 rounded-[40px] hover:bg-white/[0.03] transition-all group">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-black border border-white/10 rounded-2xl flex items-center justify-center group-hover:border-[#FF6044]/40 transition-colors">
                <Shield className="w-5 h-5 text-[#FF6044]" />
              </div>
              <h3 className="text-[20px] font-bold">Your Data, Your Control</h3>
            </div>
            <p className="text-[15px] text-white/40 leading-relaxed">
              Each project's data is stored separately and is only accessible using that project's key. You can delete your project and all its data at any time from the dashboard — one click, permanent, no waiting period. We don't keep backups of deleted data after 24 hours.
            </p>
          </div>

          <div className="mt-20 pt-16 border-t border-white/5 space-y-10">
            <h4 className="text-[18px] font-bold flex items-center gap-3">
              <FileText className="w-5 h-5 text-[#FF6044]" />
              Retention Policy
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <span className="text-[11px] font-black uppercase tracking-widest text-white/30">Free Tier</span>
                <p className="text-[14px] text-white/50">Metrics and logs are kept for 24 hours. After that they are automatically deleted. Good for development and testing.</p>
              </div>
              <div className="space-y-4">
                <span className="text-[11px] font-black uppercase tracking-widest text-[#FF6044]">Pro Tier</span>
                <p className="text-[14px] text-white/50">Metrics and logs are kept for 30 days. Useful for spotting long-term trends and comparing performance week over week.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-32 p-12 rounded-[40px] bg-[#FF6044]/5 border border-[#FF6044]/20">
          <p className="text-[13px] text-white/60 leading-relaxed text-center italic">
            "Sentinel watches your app so you can watch your business. What happens inside your server stays inside your dashboard."
          </p>
        </div>
      </main>

      <footer className="border-t border-white/5 py-12 px-10 text-center">
        <p className="text-[11px] text-white/20 uppercase tracking-[0.5em]">
          SENTINEL © 2026 — BUILT FOR DEVELOPERS
        </p>
      </footer>
    </div>
  );
};

export default PrivacyPolicy;

import React from 'react';
import { Check, Zap, Shield, Globe, Cpu, ArrowRight, MessageSquare, Slack, Mail } from 'lucide-react';
import sentinelLogo from '../assets/sentinellogo.png';

const Pricing = ({ onBack, onGetStarted }) => {
  const plans = [
    {
      name: 'Standard',
      price: '$0',
      description: 'Perfect for side projects, learning, and apps that aren\'t in production yet. No credit card needed.',
      features: ['3 monitored projects', '24 hours of metric history', 'CPU, RAM & response time tracking', 'Discord & email alerts included'],
      buttonText: 'Start for Free',
      accent: false
    },
    {
      name: 'Pro',
      price: '$49',
      description: 'For apps running in production where you need longer history and more projects.',
      features: ['Unlimited monitored projects', '30 days of metric history', 'Full error tracking with stack traces', 'Alert history for last 30 days', 'Custom alert thresholds per project'],
      buttonText: 'Get Started',
      accent: true
    },
    {
      name: 'Self-Hosted',
      price: 'Free',
      description: 'Run Sentinel entirely on your own server. Your data never leaves your infrastructure.',
      features: ['Full source code on GitHub', 'Deploy on any VPS or cloud server', 'No data sent to third parties', 'Docker setup included'],
      buttonText: 'View on GitHub',
      accent: false,
      isExternal: true
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
          className="text-[13px] font-bold text-white/50 hover:text-white transition-colors"
        >
          Back to Portal
        </button>
      </nav>

      <main className="pt-40 pb-24 px-10 max-w-7xl mx-auto">
        <div className="text-center mb-24">
          <h1 className="text-[54px] font-black tracking-tighter mb-6 leading-none">
            Simple pricing. <br />
            <span className="text-[#FF6044]">No surprises.</span>
          </h1>
          <p className="text-white/40 text-[16px] max-w-2xl mx-auto leading-relaxed">
            Start free, stay free as long as you need. Upgrade only when your project grows.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <div 
              key={i}
              className={`relative p-10 rounded-3xl border transition-all duration-500 group ${
                plan.accent 
                ? 'bg-gradient-to-b from-white/[0.05] to-transparent border-[#FF6044]/40 shadow-2xl shadow-[#FF6044]/10' 
                : 'bg-white/[0.02] border-white/5 hover:border-white/10'
              }`}
            >
              {plan.accent && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#FF6044] text-black text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-[0.2em]">
                  Most Popular
                </div>
              )}

              <div className="mb-10">
                <h3 className="text-[14px] font-black text-white/40 uppercase tracking-[0.3em] mb-4">{plan.name}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-[48px] font-black tracking-tighter">{plan.price}</span>
                  {plan.price !== 'Free' && <span className="text-white/20 text-[14px]">/mo</span>}
                </div>
                <p className="text-[13px] text-white/40 mt-4 leading-relaxed">{plan.description}</p>
              </div>

              <div className="space-y-4 mb-10">
                {plan.features.map((feature, j) => (
                  <div key={j} className="flex items-center gap-3">
                    <Check className={`w-4 h-4 ${plan.accent ? 'text-[#FF6044]' : 'text-white/20'}`} />
                    <span className="text-[13px] text-white/60">{feature}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => plan.isExternal ? window.open('https://github.com', '_blank') : onGetStarted()}
                className={`w-full py-4 rounded-xl text-[14px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                  plan.accent 
                  ? 'bg-[#FF6044] text-black hover:bg-[#FF8B77] shadow-xl shadow-[#FF6044]/20' 
                  : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
                }`}
              >
                {plan.buttonText}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* 🏢 Enterprise Trust Section */}
        <div className="mt-32 p-12 rounded-3xl bg-white/[0.01] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-xl">
            <h4 className="text-[20px] font-bold mb-4">Not sure which plan to pick?</h4>
            <p className="text-[14px] text-white/40 leading-relaxed">
              Start with the free plan; it includes everything you need to monitor a side project or small app. Upgrade to Pro when you want longer history or more than 3 projects. Go self-hosted if you want full control over where your data lives.
            </p>
          </div>
          <div className="flex gap-8 opacity-30">
            <div className="flex flex-col items-center gap-3">
              <MessageSquare className="w-6 h-6 text-[#FF6044]" />
              <span className="text-[9px] font-black uppercase tracking-widest text-white/20">Discord</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <Slack className="w-6 h-6 text-[#FF6044]" />
              <span className="text-[9px] font-black uppercase tracking-widest text-white/20">Slack</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <Mail className="w-6 h-6 text-[#FF6044]" />
              <span className="text-[9px] font-black uppercase tracking-widest text-white/20">Email</span>
            </div>
            <div className="flex flex-col items-center gap-3">
              <Zap className="w-6 h-6 text-[#FF6044]" />
              <span className="text-[9px] font-black uppercase tracking-widest text-white/20">Webhooks</span>
            </div>
          </div>
        </div>
      </main>

      {/* 🏁 Footer */}
      <footer className="border-t border-white/5 py-12 px-10 text-center">
        <p className="text-[11px] text-white/20 uppercase tracking-[0.5em]">
          FREE TO START. FREE TO SELF-HOST. SENTINEL © 2026
        </p>
      </footer>
    </div>
  );
};

export default Pricing;

import React, { useState } from 'react';
import { Activity, Mail, Lock, ArrowRight, Github, ShieldCheck, Cpu } from 'lucide-react';
import axios from 'axios';
import sentinelLogo from '../assets/sentinellogo.png';

const Auth = ({ onAuthSuccess, initialIsLogin = true }) => {
  const [isLogin, setIsLogin] = useState(initialIsLogin);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    
    try {
      const response = await axios.post(endpoint, { email, password });
      const { user, token } = response.data;
      
      localStorage.setItem('sentinel_token', token);
      localStorage.setItem('sentinel_user', JSON.stringify(user));
      
      onAuthSuccess(user);
    } catch (err) {
      setError(err.response?.data?.error || 'Access Denied: Invalid Credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050506] text-[#EFFFEB] font-mono flex items-center justify-center p-6 relative overflow-hidden">
      {/* 🏗️ Industrial Grid Background */}
      <div className="absolute inset-0 z-0 opacity-20" 
           style={{ 
             backgroundImage: `radial-gradient(#FF6044 0.5px, transparent 0.5px), linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
             backgroundSize: '40px 40px, 80px 80px, 80px 80px'
           }} 
      />
      
      {/* 🏮 Atmospheric Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#FF6044]/5 blur-[160px] rounded-full pointer-events-none" />

      <div className="w-full max-w-[1100px] grid grid-cols-1 lg:grid-cols-2 bg-black border border-white/5 rounded-[40px] shadow-2xl relative z-10 overflow-hidden">
        
        {/* Left: Branding & Mission */}
        <div className="hidden lg:flex flex-col justify-between px-16 py-12 bg-white/[0.01] border-r border-white/5 relative group">
          <div className="absolute inset-0 bg-[#FF6044]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          
          <img 
            src={sentinelLogo} 
            alt="Sentinel" 
            className="w-64 h-auto relative z-10 brightness-110 contrast-110" 
          />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
               <div className="px-3 py-1 bg-[#FF6044]/10 border border-[#FF6044]/30 rounded text-[10px] font-bold text-[#FF6044] tracking-widest uppercase">
                 Observability Node
               </div>
            </div>
            <h2 className="text-[38px] font-black tracking-tighter leading-none mb-6 mt-4">
              {isLogin ? 'Establish \nSecure Link.' : 'Initialize \nStation.'}
            </h2>
            <p className="text-white/40 text-[13px] leading-relaxed max-w-sm">
              {isLogin 
                ? 'Resume full telemetry control and system oversight.'
                : 'Begin building your system architecture with high-frequency tracking.'}
            </p>
          </div>

          <div className="flex gap-10 opacity-20 relative z-10 uppercase text-[10px] tracking-[0.3em] font-bold mt-8">
            <span className="flex items-center gap-2"><Cpu className="w-4 h-4" /> CPU-LOGIC</span>
            <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> ZERO-TRUST</span>
          </div>
        </div>

        {/* Right: Registration Form */}
        <div className="px-10 lg:px-20 py-10 lg:py-12 flex flex-col justify-center">
          <div className="mb-10">
             <h3 className="text-[18px] font-bold mb-2">{isLogin ? 'Sign In' : 'Register Account'}</h3>
             <p className="text-[12px] text-white/30 uppercase tracking-[0.2em]">Enter Protocol Credentials</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em] block ml-1">Commander ID (Email)</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/10 group-focus-within:text-[#FF6044] transition-colors" />
                <input 
                   type="email" 
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-4 pl-12 pr-4 text-[14px] text-white focus:bg-white/[0.05] focus:border-[#FF6044]/30 focus:outline-none transition-all"
                   placeholder="commander@network.com"
                   required
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em] block ml-1">Access Key (Password)</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/10 group-focus-within:text-[#FF6044] transition-colors" />
                <input 
                   type="password" 
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   className="w-full bg-white/[0.02] border border-white/5 rounded-xl py-4 pl-12 pr-4 text-[14px] text-white focus:bg-white/[0.05] focus:border-[#FF6044]/30 focus:outline-none transition-all"
                   placeholder="••••••••"
                   required
                />
              </div>
            </div>

            {error && (
              <div className="bg-[#FF6044]/10 border border-[#FF6044]/20 text-[#FF6044] text-[11px] font-bold py-3 px-6 rounded-xl flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-[#FF6044] animate-pulse rounded-full" />
                {error}
              </div>
            )}

            <button 
              disabled={loading}
              className="w-full bg-[#FF6044] hover:bg-[#FF8B77] text-black font-black py-5 rounded-xl text-[14px] flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-2xl shadow-[#FF6044]/20 uppercase tracking-widest"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isLogin ? 'Establish Connection' : 'Initialize Station'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <footer className="mt-16 pt-8 border-t border-white/5 flex flex-col gap-6">
            <button className="flex items-center justify-between group bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 px-6 py-4 rounded-xl transition-all">
               <span className="text-[11px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-4">
                 <Github className="w-5 h-5 text-white" />
                 Sign in with Github
               </span>
               <ArrowRight className="w-4 h-4 text-[#FF6044] opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0" />
            </button>

            <p className="text-center text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">
              {isLogin ? "No station identified?" : "Already active station?"}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="ml-3 text-[#FF6044] hover:text-white transition-colors border-b border-[#FF6044]/30 hover:border-white"
              >
                {isLogin ? 'Register New' : 'Sign In Now'}
              </button>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Auth;

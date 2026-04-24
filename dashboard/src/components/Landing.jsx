import React, { useEffect, useState, useRef } from 'react';
import { Activity, Shield, Zap, RefreshCw, BarChart3, Globe, Cloud, Microscope, Cpu, Users, ChevronRight, User, ArrowUpRight, LayoutDashboard } from 'lucide-react';
import sentinelLogo from '../assets/sentinellogo.png';

const Landing = ({ user, onGetStarted, onNavigate, onLogin }) => {
  const [scrollProgress, setScrollProgress] = useState({});
  const [statsScale, setStatsScale] = useState(1.6);
  const sectionRef = useRef(null);
  const statsSectionRef = useRef(null);
  const statsBgRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    // 1. General Reveal Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.reveal-on-scroll').forEach((el) => observer.observe(el));

    // 2. Stats Counter Observer
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target;
            if (target.classList.contains('counter-started')) return;
            target.classList.add('counter-started');
            
            const countTo = parseFloat(target.getAttribute('data-count'));
            let count = 0;
            const duration = 2000;
            const step = (countTo / (duration / 16));
            
            const timer = setInterval(() => {
              count += step;
              if (count >= countTo) {
                target.innerText = target.getAttribute('data-count-text');
                clearInterval(timer);
              } else {
                target.innerText = Math.floor(count);
              }
            }, 16);
          }
        });
      },
      { threshold: 0.5 }
    );

    document.querySelectorAll('.stat-counter').forEach((el) => statsObserver.observe(el));

    // 3. Universal Intersection Animation Engine (Zero-Lag Scroll Mapping)
    const animObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === statsSectionRef.current && statsBgRef.current) {
            const ratio = entry.intersectionRatio; // 0 to 1
            // Zoom IN subtly as it fills the screen (1.0 to 1.25)
            const scale = 1 + (ratio * 0.25); 
            statsBgRef.current.style.transform = `scale(${scale})`;
          }
          
          // 3D Tilt for Features
          if (entry.target.classList.contains('tilt-card')) {
            const rect = entry.target.getBoundingClientRect();
            const progress = 1 - (rect.top + rect.height / 2) / window.innerHeight;
            const tilt = (progress - 0.5) * 2;
            const index = Array.from(document.querySelectorAll('.tilt-card')).indexOf(entry.target);
            setScrollProgress(prev => ({ ...prev, [index]: tilt }));
          }
        });
      },
      { 
        threshold: Array.from({ length: 101 }, (_, i) => i / 100)
      }
    );

    if (statsSectionRef.current) animObserver.observe(statsSectionRef.current);
    document.querySelectorAll('.tilt-card').forEach(el => animObserver.observe(el));

    return () => {
      observer.disconnect();
      statsObserver.disconnect();
      animObserver.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-text-main selection:bg-primary/30 overflow-x-hidden font-mono relative">
      <style>{`
        @keyframes blink-smooth {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
        .animate-blink-smooth {
          animation: blink-smooth 1.5s ease-in-out infinite;
        }
        .reveal-on-scroll {
          opacity: 0;
          transform: translateY(30px);
          transition: all 1s cubic-bezier(0.17, 0.55, 0.55, 1);
        }
        .reveal-visible {
          opacity: 1 !important;
          transform: translateY(0);
        }
        @keyframes particles-drift {
          0% { transform: translate(0, 0); opacity: 0; }
          25% { opacity: 0.8; }
          75% { opacity: 0.8; }
          100% { transform: translate(100px, -100px); opacity: 0; }
        }
        .animate-particles {
          animation: particles-drift 15s linear infinite;
        }
      `}</style>

      {/* 🚀 PRECISION HEADER (Wix Sync 1:1) */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 py-4 pointer-events-none">
        {/* Left: Logo Section */}
        <div className="logo-wrapper pointer-events-auto">
          <a href="/" className="flex items-center gap-3">
            <img 
              src={sentinelLogo} 
              alt="Sentinel Logo" 
              className="h-24 w-auto hover:opacity-80 transition-opacity"
            />
          </a>
        </div>

        {/* Center: Nav Pill (Independent) */}
        <div className="hidden lg:flex items-center pointer-events-auto">
          <div className="flex items-center bg-[#484D47]/44 backdrop-blur-2xl px-10 h-[54px] rounded-xl border border-white/5 gap-8">
            <button 
              onClick={() => user ? onNavigate('dashboard') : onNavigate('register')}
              className="text-[14px] font-black tracking-widest text-[#FF583B] hover:text-white transition-all leading-none bg-transparent border-none p-0 cursor-pointer uppercase flex items-center gap-2"
            >
              <div className={`w-1.5 h-1.5 rounded-full ${user ? 'bg-[#FF583B] animate-pulse' : 'bg-white/20'}`} />
              Dashboard
            </button>
            <div className="w-[1px] h-3 bg-white/10" />
            <button 
              onClick={() => onNavigate('integrations')}
              className="text-[14px] font-bold tracking-tight text-[#FFFFFF] hover:text-[#FF583B] transition-colors leading-none bg-transparent border-none p-0 cursor-pointer"
            >
              Integrations
            </button>
            <div className="w-[1px] h-3 bg-white/10" />
            <button 
              onClick={() => onNavigate('pricing')}
              className="text-[14px] font-bold tracking-tight text-[#FFFFFF] hover:text-[#FF583B] transition-colors leading-none bg-transparent border-none p-0 cursor-pointer"
            >
              Pricing
            </button>
            <div className="w-[1px] h-3 bg-white/10" />
            <button 
              onClick={() => onNavigate('documentation')}
              className="text-[14px] font-bold tracking-tight text-[#FFFFFF] hover:text-[#FF583B] transition-colors leading-none bg-transparent border-none p-0 cursor-pointer"
            >
              Documentation
            </button>
          </div>
        </div>

        {/* Right: Action Cluster (Get Started + Log In) */}
        <div className="flex items-center gap-8 pointer-events-auto">
          {user ? (
            <button 
              onClick={() => onNavigate('dashboard')}
              className="bg-[#FF583B] hover:bg-[#E64B2F] text-black px-8 h-[48px] rounded-[6px] font-black text-[11px] uppercase tracking-[0.2em] transition-all shadow-[0_0_20px_rgba(255,88,59,0.2)] flex items-center gap-3"
            >
              <LayoutDashboard className="w-4 h-4" />
              Go to Dashboard
            </button>
          ) : (
            <>
              <button 
                onClick={onGetStarted}
                className="bg-[#FF583B] hover:bg-[#E64B2F] text-black px-8 h-[48px] rounded-[6px] font-black text-[11px] uppercase tracking-[0.2em] transition-all"
              >
                Get Started
              </button>
              
              <button 
                onClick={onLogin}
                className="flex items-center gap-3 text-[#FFFFFF] font-bold tracking-tight hover:text-[#FF583B] transition-all"
              >
                <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center p-2">
                   <User className="w-full h-full" />
                </div>
                <span className="hidden md:inline text-[16px]">Log In</span>
              </button>
            </>
          )}
        </div>
      </header>

      <section className="relative min-h-[100vh] flex flex-col px-24 pt-48 bg-black">
        <div 
          className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
          style={{ 
            maskImage: 'linear-gradient(to bottom, black 0%, black 70%, rgba(0,0,0,0.95) 75%, rgba(0,0,0,0.8) 80%, rgba(0,0,0,0.6) 85%, rgba(0,0,0,0.4) 90%, rgba(0,0,0,0.2) 95%, rgba(0,0,0,0.1) 98%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 70%, rgba(0,0,0,0.95) 75%, rgba(0,0,0,0.8) 80%, rgba(0,0,0,0.6) 85%, rgba(0,0,0,0.4) 90%, rgba(0,0,0,0.2) 95%, rgba(0,0,0,0.1) 98%, transparent 100%)'
          }}
        >
          <video 
            autoPlay muted loop playsInline 
            poster="https://static.wixstatic.com/media/c837a6_8420aadea8e84c4f979334b25dbccb4df000.jpg"
            className="w-full h-full object-cover opacity-60 grayscale-[0.2]"
            src="https://video.wixstatic.com/video/c837a6_8420aadea8e84c4f979334b25dbccb4d/1080p/mp4/file.mp4"
          />
        </div>
        
        {/* 🏔️ Micro-Atmospheric Anchor (Precision Sink) */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(to top, black 0%, transparent 12%)', pointerEvents: 'none' }} />

        {/* Hero Text - Pixel Perfect Staggered Layout */}
        <div className="relative z-10 flex-grow flex flex-col justify-center w-full max-w-[1700px] pb-[119.7px]">
          <div className="space-y-0 text-[#FFFFFF]">
             <div className="flex items-baseline gap-[240px]">
                <h1 className="text-[83.18px] font-medium tracking-tighter leading-[1.05]">KNOW</h1>
                <h1 className="text-[83.18px] font-normal tracking-tighter leading-[1.05] opacity-70">YOUR</h1>
             </div>
             
             <h1 className="text-[83.18px] font-medium tracking-tighter leading-[1.05] uppercase">APP&nbsp;&nbsp;&nbsp;IS</h1>
             
             <div className="flex items-baseline gap-[240px]">
                <h1 className="text-[83.18px] font-medium tracking-tighter leading-[1.05]">BROKEN</h1>
                <h1 className="text-[83.18px] font-normal tracking-tighter leading-[1.05] opacity-70">BEFORE</h1>
             </div>
             
             <h1 className="text-[81px] font-medium tracking-tighter leading-[1.05] uppercase">YOUR USERS DO</h1>
          </div>

          <div className="mt-10 space-y-10 max-w-lg">
            <p className="text-[#FFFFFF]/90 text-[16.63px] font-medium leading-tight tracking-tight max-w-[400px]">
              Real-time monitoring for Node.js developers. <br />
              CPU, RAM, API speed, and live logs visualized in one dashboard.
            </p>
            <button 
              onClick={() => user ? onNavigate('dashboard') : onGetStarted()}
              className="bg-[#FF583B] hover:bg-[#E64B2F] text-black w-[240px] h-[55px] rounded-[6px] font-black text-[12px] uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-2xl"
            >
              {user ? 'Enter Command Center' : 'START MONITORING FREE'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      <div className="w-full h-px bg-[#EFFFEB]/10" />

      <section className="bg-black pt-32 pb-40 px-24 relative" id="solutions" ref={sectionRef}>
        <div className="max-w-[1700px] mx-auto flex flex-col lg:flex-row gap-20 items-start">
          
          {/* Left-Side Fixed Content (Goal Image 1 Sync) */}
          <div className="lg:w-[50%] sticky top-40 space-y-20 mt-24">
            <h2 className="text-[64px] font-medium leading-[1.1] tracking-tight text-[#EFFFEB] font-mono reveal-on-scroll opacity-0 transition-all duration-1000">
              Everything your <br /> app is doing, <br /> visible in <br /> one place.
            </h2>
            
            <div className="flex items-start gap-6 max-w-[500px]">
              <div className="w-[3px] h-16 bg-[#FF6044] flex-shrink-0 animate-blink-smooth mt-2" />
              <p className="text-[#EFFFEB] text-[16.63px] leading-[1.6] font-mono opacity-80">
                Install the Sentinel SDK with one command. <br />
                Within 5 minutes you can see your server's <br />
                CPU, memory, API response times, and live <br />
                logs. No config files, no complex setup.
              </p>
            </div>
          </div>

          {/* 3D PERSPECTIVE GRID (50/50 Balance) */}
          <div className="lg:w-[50%] grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4" style={{ perspective: '1500px' }}>
            
            <div className="tilt-card reveal-on-scroll transform opacity-0 transition-all duration-700 ease-out bg-[#0D0D0E] p-10 min-h-[400px] flex flex-col items-start gap-10 group hover:bg-[#121214] border border-white/[0.03] rounded-[8px]" 
                 style={{ 
                   transform: `translateY(0px) rotateX(${(scrollProgress[0] || 0) * 15}deg)`,
                   transition: 'transform 0.2s cubic-bezier(0.17, 0.55, 0.55, 1), opacity 1s, background-color 0.3s'
                 }}>
              <div className="w-14 h-14 text-[#EFFFEB]/80">
                <svg viewBox="20.5 20 160 160" className="w-full h-full fill-current">
                   <path d="M176.598 49.268c0-14.009-11.357-25.366-25.366-25.366H49.768c-14.009 0-25.366 11.357-25.366 25.366v101.463c0 14.009 11.357 25.366 25.366 25.366h101.463c14.009 0 25.366-11.357 25.366-25.366V49.268zm3.902 101.464c0 16.165-13.103 29.268-29.268 29.268H49.768C33.604 180 20.5 166.897 20.5 150.732V49.268C20.5 33.104 33.604 20 49.768 20h101.463c16.165 0 29.268 13.104 29.268 29.268v101.464z" className="opacity-20" />
                   <path d="M96.751 53.808c12.67-.397 23.103 9.062 25.416 21.017 13.166.76 24.195 9.631 24.196 21.322 0 12.185-12.171 21.376-26.04 21.376h-7.775v-3.902h7.775c12.551 0 22.138-8.195 22.138-17.473-.001-9.088-9.005-17.05-21.161-17.456l-2.232 2.232-.503-3.943c-1.398-10.94-10.651-19.619-21.692-19.273l.001.001c-5.842.185-10.046 1.72-13.096 3.822-3.059 2.108-5.073 4.865-6.401 7.656-2.674 5.618-2.499 11.215-2.497 11.26l.071 1.727-1.706.279c-8.547 1.399-14.685 7.936-14.686 15.44 0 8.459 7.849 15.727 18.058 15.727H87.68v3.902H76.617c-11.898 0-21.961-8.577-21.961-19.629 0-9.257 7.082-16.794 16.356-18.972.129-2.359.672-6.857 2.841-11.413 1.559-3.275 3.976-6.618 7.71-9.191 3.741-2.578 8.694-4.304 15.188-4.509" />
                   <path d="m120.245 134.495-9.941 8.663c-5.593 4.873-14.561 4.875-20.146-.001l-9.842-8.575 2.563-2.942 9.844 8.576.002.002c4.113 3.591 10.891 3.592 15.016-.002l9.941-8.663z" />
                   <path d="M102.051 97.012v47.385h-3.903V97.012z" />
                </svg>
              </div>
              <div className="space-y-6">
                <h3 className="text-[28px] font-medium leading-tight text-[#EFFFEB]">CPU & Memory <br /> Tracking</h3>
                <p className="text-[#EFFFEB]/50 text-[14px] leading-relaxed max-w-[240px]">
                  See exactly how much CPU and RAM your server is using right now. Get alerted before a memory leak crashes your app.
                </p>
              </div>
            </div>

            <div className="tilt-card reveal-on-scroll transform opacity-0 transition-all duration-700 ease-out bg-[#0D0D0E] p-10 min-h-[400px] flex flex-col items-start gap-10 group hover:bg-[#121214] border border-white/[0.03] rounded-[8px]" 
                 style={{ 
                   transform: `translateY(40px) rotateX(${(scrollProgress[1] || 0) * 15}deg)`,
                   transition: 'transform 0.2s cubic-bezier(0.17, 0.55, 0.55, 1), opacity 1s, background-color 0.3s'
                 }}>
              <div className="w-14 h-14 text-[#EFFFEB]/80">
                <svg viewBox="20.5 20 160 160" className="w-full h-full fill-current">
                   <path d="M176.598 49.268c0-14.009-11.357-25.366-25.366-25.366H49.768c-14.009 0-25.366 11.357-25.366 25.366v101.463c0 14.009 11.357 25.366 25.366 25.366h101.463c14.009 0 25.366-11.357 25.366-25.366V49.268zm3.902 101.464c0 16.165-13.103 29.268-29.268 29.268H49.768C33.604 180 20.5 166.897 20.5 150.732V49.268C20.5 33.104 33.604 20 49.768 20h101.463c16.165 0 29.268 13.104 29.268 29.268v101.464z" className="opacity-20" />
                   <path d="M94.291 126.473v18.322a1.951 1.951 0 0 1-3.902 0v-18.322z" />
                   <path d="M102.451 126.473v18.322a1.951 1.951 0 0 1-3.902 0v-18.322z" />
                   <path d="M110.611 126.473v18.322a1.951 1.951 0 0 1-3.902 0v-18.322z" />
                   <path d="M145.295 106.209a1.951 1.951 0 0 1 0 3.902h-18.323v-3.902z" />
                   <path d="M74.036 110.111H55.705a1.951 1.951 0 0 1 0-3.902h18.331z" />
                   <path d="M108.66 53.254c1.078 0 1.951.874 1.951 1.951v18.332h-3.902V55.205c0-1.078.874-1.951 1.951-1.951" />
                   <path d="M124.128 86.137c0-5.22-4.1-9.483-9.255-9.744l-.501-.012H86.636c-5.388 0-9.756 4.368-9.756 9.756v27.737l.012.501c.261 5.155 4.524 9.255 9.744 9.255h27.736c5.388 0 9.756-4.368 9.756-9.756z" />
                </svg>
              </div>
              <div className="space-y-6">
                <h3 className="text-[28px] font-medium leading-tight text-[#EFFFEB]">Automatic <br /> Anomaly <br /> Alerts</h3>
                <p className="text-[#EFFFEB]/50 text-[14px] leading-relaxed max-w-[240px]">
                  Sentinel watches your baselines and notifies you on Discord or Slack when something looks wrong; no manual thresholds to configure.
                </p>
              </div>
            </div>

            <div className="tilt-card reveal-on-scroll transform opacity-0 transition-all duration-700 ease-out bg-[#0D0D0E] p-10 min-h-[400px] flex flex-col items-start gap-10 group hover:bg-[#121214] border border-white/[0.03] rounded-[8px]" 
                 style={{ 
                   transform: `translateY(20px) rotateX(${(scrollProgress[2] || 0) * 15}deg)`,
                   transition: 'transform 0.2s cubic-bezier(0.17, 0.55, 0.55, 1), opacity 1s, background-color 0.3s'
                 }}>
              <div className="w-14 h-14 text-[#EFFFEB]/80">
                <svg viewBox="20.5 20 160 160" className="w-full h-full fill-current">
                   <path d="M176.598 49.268c0-14.009-11.357-25.366-25.366-25.366H49.768c-14.009 0-25.366 11.357-25.366 25.366v101.463c0 14.009 11.357 25.366 25.366 25.366h101.463c14.009 0 25.366-11.357 25.366-25.366V49.268zm3.902 101.464c0 16.165-13.103 29.268-29.268 29.268H49.768C33.604 180 20.5 166.897 20.5 150.732V49.268C20.5 33.104 33.604 20 49.768 20h101.463c16.165 0 29.268 13.104 29.268 29.268v101.464z" className="opacity-20" />
                   <path d="M157.68 76.96a1.951 1.951 0 1 1 2.974 2.525l-22.149 26.089c-1.18 1.406-3.263 1.515-4.595.332l-.004-.004-15.802-14.116-20.756 24.868-.009.01c-1.594 1.884-4.602 1.702-5.914-.447L76.083 91.198l-36.425 42.116a1.952 1.952 0 0 1-2.951-2.553L73.81 87.863c1.386-1.609 3.949-1.411 5.061.413l15.704 25.61 20.862-24.992a3.406 3.406 0 0 1 4.745-.479l.137.115.003.003 15.658 13.987z" />
                   <path d="M143.101 61.6a3.55 3.55 0 0 0-3.55-3.551H62.75a3.55 3.55 0 0 0-3.551 3.551v76.8a3.55 3.55 0 0 0 3.551 3.551h76.801a3.55 3.55 0 0 0 3.55-3.551zm3.903 76.8a7.453 7.453 0 0 1-7.453 7.454H62.75a7.453 7.453 0 0 1-7.453-7.454V61.6a7.453 7.453 0 0 1 7.453-7.453h76.801a7.453 7.453 0 0 1 7.453 7.453z" />
                   <path d="M103.101 56.098v87.805h-3.902V56.098z" />
                   <path d="m163.464 80.239-6.185-4.732c-.273-.205-.205-.644.117-.81l8.078-4.146a.441.441 0 0 1 .644.488l-1.893 8.878c-.078.351-.488.527-.751.322z" />
                </svg>
              </div>
              <div className="space-y-6">
                <h3 className="text-[28px] font-medium leading-tight text-[#EFFFEB]">Live Log <br /> Terminal</h3>
                <p className="text-[#EFFFEB]/50 text-[14px] leading-relaxed max-w-[240px]">
                  Every log your app writes appears in a live scrolling terminal in your browser. No SSH, no server access needed.
                </p>
              </div>
            </div>

            <div className="tilt-card reveal-on-scroll transform opacity-0 transition-all duration-700 ease-out bg-[#0D0D0E] p-10 min-h-[400px] flex flex-col items-start gap-10 group hover:bg-[#121214] border border-white/[0.03] rounded-[8px]" 
                 style={{ 
                   transform: `translateY(60px) rotateX(${(scrollProgress[3] || 0) * 15}deg)`,
                   transition: 'transform 0.2s cubic-bezier(0.17, 0.55, 0.55, 1), opacity 1s, background-color 0.3s'
                 }}>
              <div className="w-14 h-14 text-[#EFFFEB]/80">
                <svg viewBox="20.5 20 160 160" className="w-full h-full fill-current">
                   <path d="M176.598 49.268c0-14.009-11.357-25.366-25.366-25.366H49.768c-14.009 0-25.366 11.357-25.366 25.366v101.463c0 14.009 11.357 25.366 25.366 25.366h101.463c14.009 0 25.366-11.357 25.366-25.366V49.268zm3.902 101.464c0 16.165-13.103 29.268-29.268 29.268H49.768C33.604 180 20.5 166.897 20.5 150.732V49.268C20.5 33.104 33.604 20 49.768 20h101.463c16.165 0 29.268 13.104 29.268 29.268v101.464z" className="opacity-20" />
                   <path d="M100.48 54.147c7.011 0 12.693 5.683 12.693 12.692 0 1.35-.212 2.65-.602 3.87l10.739 5.375" />
                   <path d="M100.523 124.732c-5.12 0-9.271 4.149-9.271 9.268s4.151 9.268 9.271 9.268 9.272-4.149 9.272-9.268" />
                </svg>
              </div>
              <div className="space-y-6">
                <h3 className="text-[28px] font-medium leading-tight text-[#EFFFEB]">API Response <br /> Times</h3>
                <p className="text-[#EFFFEB]/50 text-[14px] leading-relaxed max-w-[240px]">
                  See which endpoints are slow, which are getting slower over time, and exactly when a spike happened.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <div className="w-full h-px bg-[#EFFFEB]/10" />

      <section className="bg-black pt-16 pb-32 px-24 border-t border-white/5" id="vision">
        <div className="max-w-[1700px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          
          {/* Left Column: Massive Headline (Goal specification: 57px) */}
          <div className="space-y-4">
            <h2 className="text-[57px] font-medium leading-[1.1] tracking-tighter text-[#EFFFEB] font-mono reveal-on-scroll transform -translate-x-10 opacity-0 transition-all duration-1000">
              Set up in <br /> 5 minutes.
            </h2>
            <h2 className="text-[57px] font-medium leading-[1.1] tracking-tighter text-[#EFFFEB] font-mono reveal-on-scroll transform -translate-x-10 opacity-0 transition-all duration-1000 delay-300">
              Know everything <br /> that matters.
            </h2>
          </div>

          {/* Right Column: Mission Repeat + CTA (Goal Image Sync) */}
          <div className="lg:pt-12 space-y-16">
            <div className="flex items-start gap-6 max-w-[507px]">
              <div className="w-[3px] h-16 bg-[#FF6044] flex-shrink-0 animate-blink-smooth mt-2" />
              <p className="text-[#EFFFEB] text-[16.63px] leading-[1.6] font-mono opacity-80">
                Most developers find out their app is broken <br />
                from a user complaint. Sentinel flips that. <br />
                you see the problem the moment it starts, <br />
                not after it's already affected someone.
              </p>
            </div>

            <button 
              onClick={() => onNavigate('how-it-works')}
              className="bg-[#FF6044] hover:bg-[#E64B2F] text-black w-[200px] h-[55px] rounded-[6px] font-medium text-[16px] transition-all flex items-center justify-center mt-8 cursor-pointer"
            >
              See How It Works
            </button>
          </div>
        </div>
      </section>

      {/* 📊 PRIDE IN OUR NUMBERS SECTION (Ken Burns Effect with Scroll Zoom) */}
      <section className="relative h-[90vh] overflow-hidden flex items-center px-24 group" ref={statsSectionRef}>
         <div 
           ref={statsBgRef}
           className="zoom-bg-container absolute inset-0 z-0"
           style={{ 
             willChange: 'transform',
             maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
             WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)'
           }}
         >
           <img 
              src="https://static.wixstatic.com/media/c837a6_77ddcb584752486b9c867965cf469934~mv2.png/v1/fill/w_1901,h_901,fp_0.52_0.12,q_90" 
              className="w-full h-full object-cover"
              alt="Data Nodes"
           />
           <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
         </div>

         <div className="relative z-10 max-w-[1700px] mx-auto w-full">
            <div className="flex flex-col items-center text-center">
              <h2 className="text-[28px] font-medium tracking-[0.4em] text-white/50 mb-32 uppercase reveal-on-scroll opacity-0 transition-all duration-1000">
                BUILT FOR RELIABILITY
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-24 w-full">
                 <div className="space-y-4 reveal-on-scroll opacity-0 transition-all duration-1000 delay-100">
                   <div className="flex items-baseline justify-center">
                      <span className="stat-counter text-[90px] font-bold tracking-tighter text-[#FF583B]" data-count="99.99" data-count-text="99.99%">0</span>
                   </div>
                   <p className="text-white/40 text-[12px] font-bold uppercase tracking-[0.4em]">SDK UPTIME GUARANTEE</p>
                 </div>

                 <div className="space-y-4 reveal-on-scroll opacity-0 transition-all duration-1000 delay-200">
                   <div className="flex items-baseline justify-center">
                      <span className="stat-counter text-[90px] font-bold tracking-tighter text-[#FF583B]" data-count="5" data-count-text="5s">0</span>
                   </div>
                   <p className="text-white/40 text-[12px] font-bold uppercase tracking-[0.4em]">METRIC REFRESH RATE</p>
                 </div>

                 <div className="space-y-4 reveal-on-scroll opacity-0 transition-all duration-1000 delay-300">
                   <div className="flex items-baseline justify-center">
                      <span className="stat-counter text-[90px] font-bold tracking-tighter text-[#FF583B]" data-count="250" data-count-text="250ms">0</span>
                   </div>
                   <p className="text-white/40 text-[12px] font-bold uppercase tracking-[0.4em]">ALERT DELIVERY TIME</p>
                 </div>

                 <div className="space-y-4 reveal-on-scroll opacity-0 transition-all duration-1000 delay-400">
                   <div className="flex items-baseline justify-center">
                      <span className="stat-counter text-[90px] font-bold tracking-tighter text-[#FF583B]" data-count="5" data-count-text="<5ms">0</span>
                   </div>
                   <p className="text-white/40 text-[12px] font-bold uppercase tracking-[0.4em]">SDK OVERHEAD PER REQUEST</p>
                 </div>
              </div>
            </div>
         </div>
      </section>

      {/* 🏁 FINAL CTA SECTION (Goal Image Sync) */}
      <section className="bg-black py-40 px-24 border-t border-white/5 relative overflow-hidden">
        {/* Cinematic Particle Atmosphere - Refined Balance */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-[20%] left-[10%] w-1.5 h-1.5 bg-[#FF6044]/40 rounded-full blur-[1px] animate-particles" style={{ animationDelay: '0s' }} />
          <div className="absolute top-[60%] left-[30%] w-1 h-1 bg-[#FF6044]/30 rounded-full blur-[1px] animate-particles" style={{ animationDelay: '2s' }} />
          <div className="absolute top-[40%] left-[70%] w-2 h-2 bg-[#FF6044]/20 rounded-full blur-[2px] animate-particles" style={{ animationDelay: '5s' }} />
          <div className="absolute top-[80%] left-[50%] w-1 h-1 bg-[#FF6044]/40 rounded-full blur-[1px] animate-particles" style={{ animationDelay: '1s' }} />
          <div className="absolute top-[15%] left-[80%] w-2 h-2 bg-[#FF6044]/30 rounded-full blur-[1px] animate-particles" style={{ animationDelay: '8s' }} />
          <div className="absolute top-[55%] left-[90%] w-1 h-1 bg-[#FF6044]/40 rounded-full blur-[1px] animate-particles" style={{ animationDelay: '10s' }} />
          <div className="absolute top-[35%] left-[45%] w-1.5 h-1.5 bg-[#FF6044]/30 rounded-full animate-particles" style={{ animationDelay: '3s' }} />
        </div>
        
        <div className="max-w-[1700px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-start relative z-10">
          
          {/* Left Column: Final Question */}
          <div className="space-y-4">
            <h2 className="text-[57px] font-medium leading-[1.1] tracking-tighter text-[#EFFFEB] font-mono reveal-on-scroll transform -translate-x-10 opacity-0 transition-all duration-1000">
              Ready to stop <br /> flying blind <br /> in production?
            </h2>
          </div>

          {/* Right Column: Mission Cluster + CTA Button */}
          <div className="lg:pt-12 space-y-16">
            <div className="flex items-start gap-6 max-w-[507px]">
              <div className="w-[3px] h-16 bg-[#FF6044] flex-shrink-0 animate-blink-smooth mt-2" />
              <p className="text-[#EFFFEB] text-[16.63px] leading-[1.6] font-mono opacity-80">
                Three lines of code is all it takes. <br />
                Add Sentinel to your Node.js app today <br />
                and have your first dashboard running <br />
                before your next coffee gets cold.
              </p>
            </div>

            <button 
              onClick={onGetStarted}
              className="bg-[#FF6044] hover:bg-[#E64B2F] text-black w-[172px] h-[55px] rounded-[6px] font-medium text-[16px] transition-all flex items-center justify-center mt-8"
            >
              Get Started
            </button>
          </div>
        </div>
      </section>

      {/* 🧧 FOOTER */}
      <footer className="bg-black pt-24 pb-12 px-24 border-t border-white/5">
        <div className="max-w-[1700px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
            
            {/* Left Column: Logo, Nav, CTA, Contact */}
            <div className="lg:col-span-5 space-y-12">
              <div className="space-y-8">
                <h2 className="text-[24px] font-black tracking-tighter text-white uppercase">Sentinel</h2>
                
                <nav className="flex flex-col space-y-4">
                  {[
                    { label: "Features", path: "features" },
                    { label: "How It Works", path: "how-it-works" },
                    { label: "Documentation", path: "documentation" },
                    { label: "Privacy Policy", path: "privacy" }
                  ].map((link) => (
                    <a 
                      key={link.label} 
                      href={`/#${link.path}`} 
                      onClick={(e) => {
                        e.preventDefault();
                        onNavigate(link.path);
                      }}
                      className="text-[14px] font-bold tracking-tight text-[#FFFFFF] underline decoration-white/20 underline-offset-4 hover:text-[#FF583B] transition-colors hover:decoration-[#FF583B]"
                    >
                      {link.label}
                    </a>
                  ))}
                </nav>
              </div>

              <div className="space-y-12 pt-8">
                <button 
                  onClick={onGetStarted}
                  className="bg-[#FF583B] hover:bg-[#E64B2F] text-black px-12 py-4 rounded-lg font-black text-[13px] uppercase tracking-[0.2em] transition-all cursor-pointer"
                >
                  Get Started
                </button>

                <div className="space-y-6 text-[14px] font-medium text-[#FFFFFF]/80">
                  <p>hello@sentinel.dev</p>
                  <p>Built by developers, for developers.</p>
                </div>
              </div>
            </div>

            {/* Right Column: Mailing List */}
            <div className="lg:col-span-7 lg:pl-12">
              <div className="max-w-xl space-y-10">
                <h2 className="text-4xl md:text-[3.5rem] font-heading font-medium tracking-tighter leading-none text-white">
                  Get updates on <br /> new features
                </h2>
                <p className="text-[14px] font-medium text-[#FFFFFF]/70">
                  New integrations, SDK updates, and <br />
                  monitoring tips. No spam, unsubscribe anytime.
                </p>

                <form className="space-y-10" onSubmit={(e) => e.preventDefault()}>
                  <div className="space-y-4">
                    <label className="text-[12px] font-black uppercase tracking-widest text-white block">
                      Email address *
                    </label>
                    <input 
                      type="email" 
                      placeholder="Enter your email"
                      className="w-full bg-transparent border-b border-white py-4 text-[16px] outline-none placeholder:text-white/20 focus:border-[#FF583B] transition-colors"
                    />
                  </div>

                  <div className="flex items-start gap-3">
                    <input type="checkbox" className="mt-1 w-4 h-4 rounded border-white/20 bg-transparent" id="marketing" />
                    <label htmlFor="marketing" className="text-[13px] font-medium text-[#FFFFFF]/70">
                      Yes, I agree to receive marketing emails. *
                    </label>
                  </div>

                  <button className="bg-[#FF583B] hover:bg-[#E64B2F] text-black w-full md:w-fit px-20 py-4 rounded-lg font-black text-[13px] uppercase tracking-[0.2em] transition-all">
                    Join Now
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12">
             <div className="flex items-center gap-8">
               <span className="text-white hover:text-[#FF583B] transition-colors cursor-pointer"><Users className="w-6 h-6" /></span>
               <span className="text-white hover:text-[#FF583B] transition-colors cursor-pointer"><Globe className="w-6 h-6" /></span>
               <span className="text-white hover:text-[#FF583B] transition-colors cursor-pointer"><Shield className="w-6 h-6" /></span>
             </div>
             <p className="text-[12px] font-medium text-[#FFFFFF]/40 uppercase tracking-widest">
               © 2026 Sentinel Observability Protocol. All telemetry logs encrypted.
             </p>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Landing;

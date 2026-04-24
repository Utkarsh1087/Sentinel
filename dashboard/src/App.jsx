import React, { useState, useEffect } from 'react';
import sentinelBrandLogo from './assets/sentinellogo.png';
import axios from 'axios';
import Auth from './components/Auth';
import Landing from './components/Landing';
import Documentation from './components/Documentation';
import Pricing from './components/Pricing';
import Integrations from './components/Integrations';
import ProjectModal from './components/ProjectModal';
import AlertModal from './components/AlertModal';
import SettingsView from './components/SettingsView';
import PrivacyPolicy from './components/PrivacyPolicy';
import HowItWorks from './components/HowItWorks';
import Features from './components/Features';
import { useQuery } from '@tanstack/react-query';
import { io } from 'socket.io-client';
import { 
  Activity, 
  Cpu, 
  Database, 
  Terminal, 
  AlertCircle, 
  Server, 
  LayoutDashboard, 
  Settings,
  ChevronRight,
  Clock,
  Bell,
  X,
  Plus,
  Power,
  RefreshCw,
  User
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

// --- CONFIGURATION PROTOCOL ---
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
axios.defaults.baseURL = API_BASE_URL;
// ------------------------------

// Removed static mock data
  const fetchSystemMetrics = async (apiKey, range) => {
    const token = localStorage.getItem('sentinel_token');
    const { data } = await axios.get(`/api/metrics/system?apiKey=${apiKey}&start=${range}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return data;
  };

const fetchSlowEndpoints = async (apiKey) => {
  const token = localStorage.getItem('sentinel_token');
  const { data } = await axios.get(`/api/metrics/slow-endpoints?apiKey=${apiKey}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data;
};

const fetchDbPerformance = async (apiKey) => {
  const token = localStorage.getItem('sentinel_token');
  const { data } = await axios.get(`/api/metrics/db-performance?apiKey=${apiKey}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data;
};

const fetchAlertStats = async (projectId) => {
  const token = localStorage.getItem('sentinel_token');
  const { data } = await axios.get(`/api/alerts/stats/${projectId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data;
};

const App = () => {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [activeProject, setActiveProject] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  // Unified Routing Logic
  const [route, setRoute] = useState(() => {
    const path = window.location.pathname.substring(1) || 'landing';
    return ['landing', 'documentation', 'pricing', 'integrations', 'login', 'register', 'dashboard', 'settings', 'privacy', 'how-it-works', 'features'].includes(path) ? path : 'landing';
  });
  const [docSection, setDocSection] = useState(null);

  const navigateTo = (newRoute, sectionArg = null, isPopState = false) => {
    if (newRoute === route && !sectionArg) return;
    
    if (!isPopState) {
      const url = newRoute === 'landing' ? '/' : `/${newRoute}`;
      window.history.pushState({ route: newRoute }, '', url);
    }
    setDocSection(sectionArg);
    setRoute(newRoute);
  };

  useEffect(() => {
    const handlePopState = (event) => {
      const nextRoute = (event.state && event.state.route) || 'landing';
      navigateTo(nextRoute, null, true);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [route]);

  const [authMode, setAuthMode] = useState('login');
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('-1h');
  const [logs, setLogs] = useState([
    { time: new Date().toLocaleTimeString(), level: 'INFO', msg: 'Dashboard initialized' }
  ]);

  useEffect(() => {
    const savedUser = localStorage.getItem('sentinel_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      fetchProjects();
    } else {
      setLoading(false);
    }
  }, []); // Only on mount

  // Sync authMode with route
  useEffect(() => {
    if (route === 'login') setAuthMode('login');
    if (route === 'register') setAuthMode('register');
  }, [route]);

  // WebSockets for Live Logs
  useEffect(() => {
    if (!activeProject) return;

    const token = localStorage.getItem('sentinel_token');
    const socket = io(API_BASE_URL, { auth: { token } });
    
    socket.on('connect', () => {
      socket.emit('join-project', activeProject.id);
      console.log('📡 Connected to project room:', activeProject.id);
    });

    socket.on('new-log', (log) => {
      const formattedLog = {
        time: new Date(log.timestamp).toLocaleTimeString(),
        level: log.level || 'INFO',
        message: log.message || 'No message content',
        id: Math.random()
      };
      setLogs(prev => [formattedLog, ...prev].slice(0, 50));
    });

    return () => socket.disconnect();
  }, [activeProject]);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('sentinel_token');
      const response = await axios.get('/api/projects', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(response.data);
      if (response.data.length > 0 && !activeProject) {
        setActiveProject(response.data[0]);
      }
    } catch (err) {
      console.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  // Live Data Polling
  const { data: systemMetrics = [], isLoading: metricsLoading } = useQuery({
    queryKey: ['system-metrics', activeProject?.api_key, timeRange],
    queryFn: () => fetchSystemMetrics(activeProject.api_key, timeRange),
    enabled: !!activeProject,
    refetchInterval: timeRange === '-1h' ? 10000 : 0 // Only auto-poll for live data
  });

  const { data: slowEndpoints = [] } = useQuery({
    queryKey: ['slow-endpoints', activeProject?.api_key],
    queryFn: () => fetchSlowEndpoints(activeProject.api_key),
    enabled: !!activeProject,
    refetchInterval: 30000 // Polling every 30s
  });

  const { data: dbPerformance = [] } = useQuery({
    queryKey: ['db-performance', activeProject?.api_key],
    queryFn: () => fetchDbPerformance(activeProject.api_key),
    enabled: !!activeProject,
    refetchInterval: 30000 
  });

  const { data: alertStats = { count: 0 } } = useQuery({
    queryKey: ['alert-stats', activeProject?.id],
    queryFn: () => fetchAlertStats(activeProject.id),
    enabled: !!activeProject,
    refetchInterval: 10000
  });

  const handleLogout = () => {
    localStorage.removeItem('sentinel_token');
    localStorage.removeItem('sentinel_user');
    setUser(null);
    setProjects([]);
    setActiveProject(null);
    navigateTo('landing');
  };

  if (loading) return <div className="h-screen bg-[#0A0A0B] flex items-center justify-center"><div className="w-8 h-8 border-4 border-[#FF6044] border-t-transparent rounded-full animate-spin" /></div>;
  if (!user || ['landing', 'documentation', 'pricing', 'integrations', 'login', 'register', 'privacy', 'how-it-works', 'features'].includes(route)) {
    if (route === 'integrations') return <Integrations onBack={() => navigateTo('landing')} onNavigate={navigateTo} />;
    if (route === 'pricing') return <Pricing onBack={() => navigateTo('landing')} onGetStarted={() => navigateTo('register')} />;
    if (route === 'documentation') return <Documentation onBack={() => navigateTo('landing')} section={docSection} />;
    if (route === 'privacy') return <PrivacyPolicy onBack={() => navigateTo('landing')} />;
    if (route === 'how-it-works') return <HowItWorks onBack={() => navigateTo('landing')} onNavigate={navigateTo} />;
    if (route === 'features') return <Features onBack={() => navigateTo('landing')} onGetStarted={() => navigateTo('register')} onNavigate={navigateTo} />;
    if (route === 'login' || route === 'register') return <Auth onAuthSuccess={(user) => { setUser(user); fetchProjects(); navigateTo('dashboard'); }} initialIsLogin={route === 'login'} onToggleMode={() => navigateTo(route === 'login' ? 'register' : 'login')} onBack={() => navigateTo('landing')} />;
    return <Landing 
      user={user}
      onGetStarted={() => navigateTo('register')} 
      onNavigate={navigateTo}
      onLogin={() => navigateTo('login')}
    />;
  }

  return (
    <div className="flex h-screen bg-[#0A0A0B] font-mono text-white/80 overflow-hidden selection:bg-[#FF6044]/30">
      {/* Sidebar - Clean Monolith */}
      <aside className="w-64 bg-[#0A0A0B] border-r border-white/[0.02] flex flex-col relative z-20">
        {/* Branding */}
        <div className="p-8 pb-6 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <img 
              src={sentinelBrandLogo} 
              alt="Sentinel" 
              className="h-16 w-auto cursor-pointer hover:opacity-80 transition-opacity drop-shadow-[0_0_15px_rgba(255,96,68,0.1)]" 
              onClick={() => navigateTo('landing')}
            />
            <div className="px-2 py-0.5 bg-white/[0.03] border border-white/[0.05] rounded-md">
               <span className="text-[8px] font-black uppercase tracking-[0.2em] text-[#FF6044]/60">v2.1</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-8 overflow-y-auto mt-4">
          {/* Main Navigation */}
          <div className="space-y-1">
            <button 
              onClick={() => navigateTo('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${route === 'dashboard' ? 'bg-white/[0.04] text-white border border-white/[0.05]' : 'text-white/30 hover:text-white hover:bg-white/[0.03]'}`}
            >
              <LayoutDashboard className={`w-4 h-4 ${route === 'dashboard' ? 'text-[#FF6044]' : 'group-hover:text-[#FF6044] transition-colors'}`} />
              <span className="text-[14px] font-black tracking-tight uppercase">Dashboard</span>
            </button>
            <button 
              onClick={() => activeProject && navigateTo('settings')}
              disabled={!activeProject}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${!activeProject ? 'opacity-20 grayscale border-dashed cursor-not-allowed' : route === 'settings' ? 'bg-white/[0.04] text-white border border-white/[0.05]' : 'text-white/30 hover:text-white hover:bg-white/[0.03]'}`}
            >
              <Settings className={`w-4 h-4 ${route === 'settings' ? 'text-[#FF6044]' : 'group-hover:text-[#FF6044] transition-colors'}`} />
              <span className="text-[14px] font-black tracking-tight uppercase">Settings</span>
            </button>
          </div>

          <div className="pt-8 space-y-4">
            <div className="px-4 flex items-center justify-between group">
              <span className="text-[11px] font-black text-white/20 uppercase tracking-[0.3em] group-hover:text-white/40 transition-colors">Active Projects</span>
              <button 
                onClick={() => setShowModal(true)}
                className="w-5 h-5 rounded-md bg-white/[0.02] border border-white/5 flex items-center justify-center text-white/20 hover:text-[#FF6044] hover:bg-[#FF6044]/10 transition-all shadow-lg"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-1 pr-2">
              {projects.length === 0 ? (
                <p className="px-4 py-2 text-[10px] text-white/30 uppercase tracking-widest font-bold italic">Awaiting Provisioning</p>
              ) : (
                projects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => setActiveProject(project)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group relative overflow-hidden ${activeProject?.id === project.id ? 'bg-[#FF6044]/5 text-white border border-[#FF6044]/20' : 'text-white/30 hover:text-white/60 hover:bg-white/[0.02]'}`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full ${activeProject?.id === project.id ? 'bg-[#FF6044] shadow-[0_0_8px_#FF6044]' : 'bg-white/20'} transition-all`} />
                    <span className="text-[14px] font-black tracking-tight truncate uppercase">{project.name}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        </nav>

        {/* User Protocol Footer */}
        <div className="p-4 border-t border-white/[0.02] bg-black/[0.1]">
          <div className="flex items-center gap-3 px-4 py-4 rounded-xl bg-white/[0.01] border border-white/[0.02] group hover:border-[#FF6044]/20 transition-all">
            <div className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-white/20 group-hover:text-white/40 transition-colors">
              <User className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
               <p className="text-[12px] font-black text-white/80 truncate uppercase tracking-tighter">
                 {user?.email.split('@')[0]}
               </p>
               <p className="text-[9px] font-black text-[#FF6044]/60 uppercase tracking-widest">Protocol Admin</p>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2.5 rounded-lg text-white/20 hover:text-[#FF6044] hover:bg-[#FF6044]/5 transition-all"
            >
              <Power className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-1 overflow-y-auto bg-[#050506] relative">
        {/* 🏗️ Background Grid Overlay */}
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
             style={{ 
               backgroundImage: `radial-gradient(#FF6044 0.5px, transparent 0.5px), linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
               backgroundSize: '40px 40px, 80px 80px, 80px 80px'
             }} 
        />

        {/* Global Nav / Header */}
        <header className="px-8 py-6 border-b border-white/[0.02] flex items-center justify-between bg-black/20 backdrop-blur-3xl sticky top-0 z-30">
          <div className="flex items-center gap-6">
            <div className="space-y-1">
              <h1 className="text-[24px] font-black text-white/90 tracking-tighter uppercase leading-none">
                {activeProject?.name || 'Initialization'}
              </h1>
              <div className="flex items-center gap-3">
                {activeProject ? (
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#FF6044] shadow-[0_0_8px_#FF6044] animate-pulse" />
                    <span className="text-[9px] text-[#FF6044] font-black uppercase tracking-[0.2em]">Active Uplink</span>
                  </div>
                ) : (
                  <span className="text-[10px] text-white/50 font-black uppercase tracking-[0.2em] italic">Awaiting Architecture Selection</span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-3 bg-white/[0.02] border border-white/10 px-4 py-2 rounded-xl group hover:border-[#FF6044]/30 transition-all">
                <Clock className="w-4 h-4 text-white/20 group-hover:text-[#FF6044] transition-colors" />
                <select 
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="bg-transparent text-[10px] font-black uppercase tracking-[0.2em] text-white/40 focus:outline-none cursor-pointer group-hover:text-white transition-colors"
                >
                  <option value="-1h" className="bg-black">60 Minutes</option>
                  <option value="-6h" className="bg-black">06 Hours</option>
                  <option value="-24h" className="bg-black">24 Hours</option>
                  <option value="-7d" className="bg-black">07 Days</option>
                </select>
             </div>

             <button 
               onClick={() => setShowAlertModal(true)}
               className="bg-[#FF6044] hover:bg-[#FF8B77] text-black px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-2xl shadow-[#FF6044]/10 border-t border-white/30"
             >
               Add Protocol
             </button>
          </div>
        </header>

        {showAlertModal && activeProject && (
          <AlertModal 
            projectId={activeProject.id} 
            onClose={() => setShowAlertModal(false)}
            onRuleCreated={(rule) => console.log('Rule created:', rule)}
          />
        )}

        <div className="p-8 space-y-6">
          {activeProject ? (
            route === 'dashboard' ? (
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard 
                    title="Avg CPU" 
                    value={`${(systemMetrics.reduce((acc, curr) => acc + (curr.cpuUsage || 0), 0) / (systemMetrics.length || 1)).toFixed(1)}%`} 
                    icon={Cpu} 
                    trend="+2.4%" 
                    color="text-primary" 
                    data={systemMetrics.map(m => m.cpuUsage)}
                  />
                  <StatCard 
                    title="Avg RAM" 
                    value={`${(systemMetrics.reduce((acc, curr) => acc + (curr.ramUsage || 0), 0) / (systemMetrics.length || 1)).toFixed(1)}%`} 
                    icon={Database} 
                    trend="-1.2%" 
                    color="text-primary" 
                    data={systemMetrics.map(m => m.ramUsage)}
                  />
                  <StatCard 
                    title="Endpoints" 
                    value={slowEndpoints.length} 
                    icon={Activity} 
                    trend="Stable" 
                    color="text-primary" 
                  />
                  <StatCard 
                    title="Alerts" 
                    value={alertStats.count} 
                    icon={Bell} 
                    trend={alertStats.count > 0 ? 'Fired' : 'None'} 
                    color="text-primary" 
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* System Load Chart */}
                  <div className="lg:col-span-2 bg-white/[0.01] border border-white/[0.04] p-6 rounded-xl min-h-[400px] relative overflow-hidden group hover:border-white/[0.08] transition-all">
                    <div className="flex items-center justify-between mb-8 relative z-10">
                      <div className="space-y-1">
                        <h3 className="font-black text-white/90 text-base tracking-tighter uppercase">Analytical Load</h3>
                        <p className="text-[12px] text-white/50 font-bold uppercase tracking-widest">Real-time System Telemetry</p>
                      </div>
                      <div className="flex items-center gap-6 text-[11px] font-black uppercase tracking-widest">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-[#FF6044] shadow-[0_0_8px_#FF6044]" />
                          <span className="text-white/50">CPU %</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-[#FDBA74] shadow-[0_0_8px_#FDBA74]" />
                          <span className="text-white/50">RAM %</span>
                        </div>
                      </div>
                    </div>
                    <div className="h-[300px] w-full relative z-10">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={systemMetrics}>
                          <defs>
                            <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#FF6044" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#FF6044" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorRam" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#FDBA74" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="#FDBA74" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                          <XAxis 
                            dataKey="time" 
                            stroke="rgba(255,255,255,0.1)" 
                            fontSize={9} 
                            tickLine={false} 
                            axisLine={false} 
                            dy={10}
                            tickFormatter={(t) => t.split(' ')[0]}
                          />
                          <YAxis 
                            stroke="rgba(255,255,255,0.1)" 
                            fontSize={9} 
                            tickLine={false} 
                            axisLine={false} 
                            tickFormatter={(v) => `${v}%`}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#0A0A0B', 
                              border: '1px solid rgba(255,255,255,0.1)', 
                              borderRadius: '12px', 
                              fontSize: '10px',
                              fontWeight: '900',
                              textTransform: 'uppercase',
                              letterSpacing: '1px'
                            }}
                            itemStyle={{ color: '#fff' }}
                            cursor={{ stroke: 'rgba(255,96,68,0.2)', strokeWidth: 2 }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="cpuUsage" 
                            stroke="#FF6044" 
                            strokeWidth={3}
                            fillOpacity={1} 
                            fill="url(#colorCpu)" 
                            animationDuration={2000}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="ramUsage" 
                            stroke="#FDBA74" 
                            strokeWidth={3}
                            fillOpacity={1} 
                            fill="url(#colorRam)" 
                            animationDuration={2500}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Bottlenecks */}
                  <div className="bg-white/[0.01] border border-white/[0.04] p-8 rounded-xl overflow-hidden hover:border-white/[0.08] transition-all flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                       <h3 className="font-black text-white text-[14px] uppercase tracking-tighter">Bottlenecks</h3>
                       <div className="px-2 py-0.5 bg-[#FF6044]/10 border border-[#FF6044]/20 rounded text-[9px] font-black text-[#FF6044] uppercase tracking-widest">Crucial</div>
                    </div>
                    <div className="flex-1 overflow-x-auto custom-scrollbar">
                      <table className="w-full text-left text-sm">
                        <thead className="text-white/50 font-black uppercase text-[10px] tracking-widest border-b border-white/[0.05]">
                          <tr>
                            <th className="pb-4">Endpoint Path</th>
                            <th className="pb-4 text-right">Avg Latency</th>
                          </tr>
                        </thead>
                        <tbody>
                          {slowEndpoints.length === 0 ? (
                            <tr>
                              <td colSpan="2" className="py-10 text-center text-[11px] text-white/20 font-bold uppercase tracking-widest italic">Scanning for Bottlenecks...</td>
                            </tr>
                          ) : (
                            slowEndpoints.map((endpoint, i) => (
                              <EndpointRow key={i} path={endpoint.path} latency={`${endpoint.avgLatency.toFixed(0)}ms`} />
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Real-time DB Queries */}
                  <div className="bg-white/[0.01] border border-white/[0.04] p-6 rounded-xl min-h-[380px] hover:border-white/[0.08] transition-all flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                      <div className="space-y-1">
                        <h3 className="font-black text-white/90 text-[14px] uppercase tracking-tighter flex items-center gap-3">
                          <Database className="w-4 h-4 text-[#FF6248]/80" />
                          Database Forensics
                        </h3>
                        <p className="text-[11px] text-white/50 font-bold uppercase tracking-widest">Query Performance Stream</p>
                      </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 flex flex-col">
                      {dbPerformance.length > 0 ? (
                        <table className="w-full">
                          <thead>
                            <tr className="text-left text-[11px] font-black text-white/50 uppercase tracking-[0.2em] border-b border-white/[0.05]">
                              <th className="pb-4 font-black">Query Descriptor</th>
                              <th className="pb-4 text-right font-black">Avg Latency</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/[0.02]">
                            {dbPerformance.map((db, i) => (
                              <tr key={i} className="group hover:bg-white/[0.02] transition-colors">
                                <td className="py-4">
                                  <div className="flex flex-col gap-1">
                                    <code className="text-[13px] text-white/80 font-mono group-hover:text-white transition-colors truncate max-w-[320px]">{db.query}</code>
                                    <span className="text-[10px] text-white/20 font-bold uppercase tracking-widest">Relational Query</span>
                                  </div>
                                </td>
                                <td className="py-4 text-right">
                                  <span className={`font-black tracking-tighter text-[15px] ${db.avgLatency > 150 ? 'text-[#FF6044]' : 'text-white/90'}`}>
                                    {db.avgLatency.toFixed(1)}ms
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 py-6">
                           <div className="w-14 h-14 rounded-lg bg-white/[0.01] border border-white/[0.05] flex items-center justify-center text-white/10 group-hover:scale-110 transition-transform">
                              <Database className="w-6 h-6" />
                           </div>
                           <div className="space-y-2">
                              <p className="text-[14px] font-black text-white/90 uppercase tracking-widest">Awaiting DB Telemetry</p>
                              <p className="text-[11px] text-white/30 font-bold leading-relaxed px-10">Capture real-time forensics using <code className="bg-white/5 px-2 py-0.5 rounded text-[#FF6248]/80 font-mono">sdk.trackQuery()</code></p>
                           </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Live Logs */}
                  <div className="bg-white/[0.01] border border-white/5 flex flex-col h-[380px] rounded-xl hover:border-white/10 transition-all overflow-hidden">
                    <div className="p-6 border-b border-white/[0.05] flex items-center justify-between bg-white/[0.01]">
                      <h3 className="font-black text-white text-[14px] uppercase tracking-tighter flex items-center gap-3">
                        <Terminal className="w-4 h-4 text-[#FF6248]" />
                        System Protocol Feed
                      </h3>
                      <div className="flex items-center gap-2.5 py-1 bg-[#FF6248]/10 border border-[#FF6248]/20 rounded-lg text-[10px] font-black text-[#FF6248] uppercase tracking-widest">
                         <div className="w-1.5 h-1.5 bg-[#FF6248] animate-pulse rounded-full" />
                         Live
                      </div>
                    </div>
                    <div className="flex-1 p-5 font-mono text-[12px] overflow-y-auto space-y-1 bg-[#050506] flex flex-col-reverse custom-scrollbar">
                      {logs.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 opacity-30 py-20">
                           <Activity className="w-12 h-12" />
                           <p className="text-[11px] font-black uppercase tracking-[0.4em]">Awaiting Telemetry Packet...</p>
                        </div>
                      ) : (
                        logs.map((log, i) => (
                          <LogLine 
                            key={i}
                            time={log.time} 
                            level={log.level} 
                            msg={log.message} 
                            color={log.level === 'ERROR' || log.level === 'CRITICAL' ? 'text-[#FF6044]' : log.level === 'WARN' ? 'text-amber-400' : 'text-white/70'}
                            hasAI={log.level === 'ERROR' || log.level === 'CRITICAL'}
                          />
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <SettingsView 
                project={activeProject} 
                onUpdate={(updated) => {
                  setActiveProject(updated);
                  setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
                }}
                onDelete={(id) => {
                  setProjects(prev => prev.filter(p => p.id !== id));
                  setActiveProject(null);
                  setCurrentView('dashboard');
                }}
              />
            )
          ) : (
            <div className="bg-white/[0.01] border border-white/5 border-dashed rounded-2xl flex flex-col items-center justify-center py-32 group hover:border-[#FF6044]/30 transition-all">
              <div className="w-24 h-24 rounded-full bg-white/[0.02] border border-white/10 flex items-center justify-center mb-10 group-hover:scale-110 transition-transform">
                <Activity className="w-10 h-10 text-white/20 group-hover:text-[#FF6044] transition-colors" />
              </div>
              <h3 className="text-3xl font-black text-white mb-4 tracking-tighter uppercase">No Active Protocol</h3>
              <p className="text-white/40 mb-10 max-w-sm text-center font-bold text-[13px] leading-relaxed px-6">
                Sentinel is standing by. Create your first project and initialize the SDK to begin real-time architectural monitoring.
              </p>
              <button 
                onClick={() => setShowModal(true)}
                className="bg-white text-black hover:bg-[#FF6044] hover:text-white px-10 py-4 rounded-2xl font-black transition-all shadow-2xl uppercase tracking-widest text-[11px]"
              >
                Provision Project 01
              </button>
            </div>
          )}
        </div>
      </main>

      {showModal && (
        <ProjectModal 
          onClose={() => setShowModal(false)} 
          onProjectCreated={(project) => {
            setProjects([...projects, project]);
            setActiveProject(project);
            setShowModal(false);
          }} 
        />
      )}
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, trend, color }) => (
  <div className="bg-white/[0.02] border border-white/5 p-6 rounded-xl hover:bg-white/[0.04] transition-colors group">
    <div className="flex items-center justify-between mb-4">
      <div className="w-9 h-9 rounded-lg bg-white/[0.05] flex items-center justify-center text-[#FF6044] border border-white/5">
        <Icon className="w-4 h-4" />
      </div>
      <div className={`text-[9px] font-bold px-2 py-0.5 rounded ${trend === 'Fired' ? 'bg-[#FF6044]/20 text-[#FF6044]' : 'bg-white/10 text-white/60'} uppercase tracking-tight`}>
        {trend}
      </div>
    </div>
    <div className="space-y-1">
      <span className="text-white/60 text-[10px] font-bold uppercase tracking-wider">{title}</span>
      <p className="text-2xl font-black text-white/90 tracking-tight leading-none">{value}</p>
    </div>
  </div>
);

const EndpointRow = ({ path, latency }) => (
  <tr className="hover:bg-white/[0.04] transition-colors group">
    <td className="px-6 py-5">
       <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 bg-[#FF6044] rounded-full group-hover:shadow-[0_0_8px_#FF6044] transition-all" />
          <span className="font-mono text-[12px] text-white/80 group-hover:text-white transition-colors tracking-tight">{path}</span>
       </div>
    </td>
    <td className="px-6 py-5 text-right">
      <div className="flex items-center justify-end gap-3">
        <span className="font-black text-white tracking-tighter text-[14px]">{latency}</span>
        <div className="w-8 h-1.5 bg-white/10 rounded-full overflow-hidden border border-white/5">
           <div className="w-3/4 h-full bg-[#FF6044] shadow-[0_0_5px_#FF6044]" />
        </div>
      </div>
    </td>
  </tr>
);

const LogLine = ({ time, level, msg, color = 'text-white/60', hasAI = false }) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const handleAIExplain = async () => {
    setAnalyzing(true);
    try {
      const { data } = await axios.post('/api/ai/explain-error', { errorLog: msg });
      setAnalysis(data.analysis);
    } catch (err) {
      setAnalysis("Diagnostic protocol failed. Manual system audit required.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="group space-y-3 py-3 border-b border-white/[0.04] last:border-0 h-auto">
      <div className="flex gap-4 items-center">
        <span className="text-white/30 text-[10px] font-black tracking-widest shrink-0 uppercase">{time}</span>
        <span className={`text-[10px] font-black shrink-0 px-2 py-0.5 rounded border tracking-widest ${level === 'ERROR' ? 'bg-[#FF6044]/20 border-[#FF6044]/40 text-[#FF6044]' : 'bg-white/10 border-white/10 text-white/70'}`}>
          {level}
        </span>
        <span className={`${color} flex-1 text-[12px] leading-relaxed font-semibold truncate group-hover:text-white transition-colors`}>{msg}</span>
        {hasAI && !analysis && (
          <button 
            onClick={handleAIExplain}
            disabled={analyzing}
            className="hidden group-hover:flex items-center gap-2 text-[9px] bg-white text-black px-4 py-2 rounded-lg font-black hover:bg-[#FF6044] transition-all uppercase tracking-widest shadow-xl"
          >
            {analyzing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Activity className="w-3.5 h-3.5" />}
            {analyzing ? 'Processing' : 'Analyze'}
          </button>
        )}
      </div>
      {analysis && (
        <div className="bg-[#0A0A0B] border border-white/10 rounded-xl p-6 text-[12px] text-white/70 relative ml-12 shadow-2xl animate-in zoom-in-95 duration-500 overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
             <Activity className="w-12 h-12" />
          </div>
          <div className="flex items-center gap-3 mb-4 text-[#FF6044] uppercase font-black tracking-[0.4em] text-[10px]">
            <div className="w-2 h-2 bg-[#FF6044] animate-pulse rounded-full shadow-[0_0_5px_#FF6044]" />
            Sentinel Intelligence Diagnostic
          </div>
          <div className="space-y-4 leading-relaxed relative z-10">
            {analysis.split('\n').filter(line => line.trim()).map((line, idx) => {
              const formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<span class="text-white font-black">$1</span>');
              if (line.startsWith('SUMMARY:')) return <div key={idx} className="font-black text-[15px] text-white tracking-tight pb-4 mb-2 border-b border-white/10" dangerouslySetInnerHTML={{ __html: formattedLine }} />;
              if (line.startsWith('CAUSE:')) return <div key={idx} className="text-[#FF6044] bg-[#FF6044]/5 p-4 rounded-lg border border-[#FF6044]/20 italic" dangerouslySetInnerHTML={{ __html: formattedLine }} />;
              if (line.startsWith('FIX:')) return <div key={idx} className="font-black text-white uppercase text-[11px] mt-6 mb-2 tracking-[0.2em] flex items-center gap-3">
                 <div className="w-1.5 h-1.5 bg-[#FF6044] rounded-full" />
                 <span dangerouslySetInnerHTML={{ __html: formattedLine }} />
              </div>;
              return <div key={idx} className="pl-5 border-l-2 border-white/10 ml-1.5 font-medium" dangerouslySetInnerHTML={{ __html: formattedLine }} />;
            })}
          </div>
          <button 
            onClick={() => setAnalysis(null)} 
            className="absolute top-5 right-5 p-2 rounded-lg hover:bg-white/10 transition-colors text-white/30 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default App;

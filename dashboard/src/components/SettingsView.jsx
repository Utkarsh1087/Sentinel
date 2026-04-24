import React, { useState } from 'react';
import { Settings, Trash2, Edit3, Users, CreditCard, ChevronRight, AlertTriangle } from 'lucide-react';
import axios from 'axios';

const SettingsView = ({ project, onUpdate, onDelete }) => {
  const [name, setName] = useState(project.name);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('sentinel_token');
      await axios.put(`/api/projects/${project.id}`, { name }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onUpdate({ ...project, name });
      alert('Project updated successfully!');
    } catch (err) {
      alert('Failed to update project');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you absolutely sure? All historical data will be lost.')) return;
    setIsDeleting(true);
    try {
      const token = localStorage.getItem('sentinel_token');
      await axios.delete(`/api/projects/${project.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onDelete(project.id);
    } catch (err) {
      alert('Failed to delete project');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-700 pb-24">
      {/* 🛠️ Header Logic */}
      <div className="flex flex-col gap-1 mb-2">
        <h2 className="text-[28px] font-black text-white/90 tracking-tighter uppercase leading-none">Protocol Authority</h2>
        <p className="text-[11px] text-[#FF6248]/60 font-black uppercase tracking-[0.4em]">System Configuration & Credential Governance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Designation and Identity */}
        <div className="lg:col-span-2 space-y-6">
          <section className="relative overflow-hidden group bg-white/[0.01] border border-white/[0.02] rounded-xl p-8 hover:border-[#FF6248]/20 transition-all duration-500">
             <div className="relative z-10 space-y-10">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#FF6248]/10 border border-[#FF6248]/20 flex items-center justify-center shadow-[0_0_15px_rgba(255,98,72,0.05)]">
                    <Settings className="w-5 h-5 text-[#FF6248]/80" />
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="text-[14px] font-black text-white/80 uppercase tracking-widest">General Designate</h3>
                    <p className="text-[11px] text-white/50 font-bold uppercase tracking-widest">Active Project Metadata</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-8">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                       <label className="text-[11px] font-black text-white/60 uppercase tracking-[0.3em]">Project Name</label>
                       <span className="text-[10px] font-black text-[#FF6248]/80 uppercase tracking-widest">Sync Required</span>
                    </div>
                    <div className="flex gap-3 p-1.5 bg-black/20 border border-white/[0.05] rounded-xl focus-within:border-[#FF6248]/30 transition-all">
                      <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="flex-1 bg-transparent py-3 px-5 text-[14px] font-bold text-white/80 focus:outline-none"
                      />
                      <button 
                        onClick={handleUpdate}
                        className="bg-[#FF6248]/80 text-black hover:bg-white px-8 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all"
                      >
                        Push
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-white/60 uppercase tracking-[0.3em]">Authorized API Hash</label>
                    <div className="bg-black/40 border border-white/[0.05] rounded-xl p-6 flex items-center justify-between hover:border-[#FF6248]/20 transition-all relative overflow-hidden group/key">
                        <div className="flex flex-col gap-1.5">
                           <code className="text-[14px] font-black text-[#FF6248]/60 tracking-widest font-mono">{project.api_key}</code>
                           <span className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em]">Unique Technical Identifier</span>
                        </div>
                        <button 
                          onClick={() => navigator.clipboard.writeText(project.api_key)}
                          className="bg-white/[0.03] hover:bg-[#FF6248] hover:text-white text-white/50 px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border border-white/[0.05]"
                        >
                          Copy
                        </button>
                    </div>
                  </div>
                </div>
             </div>
          </section>

          {/* Collaborators Panel */}
          <section className="bg-white/[0.01] border border-white/[0.02] rounded-xl p-8 relative group overflow-hidden">
             <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-5">
                   <div className="w-12 h-12 rounded-full bg-white/[0.03] border border-white/[0.05] flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Users className="w-5 h-5 text-white/20 group-hover:text-[#FF6248]/60 transition-colors" />
                   </div>
                   <div className="space-y-1">
                      <h3 className="text-[16px] font-black text-white/80 uppercase tracking-tighter">Team Allocation</h3>
                      <p className="text-[12px] text-white/50 font-bold max-w-[280px]">Invite contributors to monitor this protocol stream.</p>
                   </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                   <span className="text-[10px] font-black text-[#FF6248]/40 uppercase tracking-[0.3em] bg-[#FF6248]/5 px-3 py-1 rounded-full border border-[#FF6248]/10">Pro Required</span>
                </div>
             </div>
          </section>
        </div>

        {/* Right Column: Billing and Status */}
        <div className="space-y-6">
           <section className="bg-white/[0.01] border border-white/[0.02] rounded-xl p-8 flex flex-col items-center text-center space-y-6">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#FF6248]/60 to-[#FF8B77]/40 p-px">
                 <div className="w-full h-full bg-[#0A0A0B] rounded-[14px] flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-[#FF6248]/60" />
                 </div>
              </div>
              <div className="space-y-1">
                 <h4 className="text-[18px] font-black text-white/80 tracking-tighter uppercase">Basic Node</h4>
                 <p className="text-[11px] text-white/50 font-black tracking-[0.3em] uppercase">Active Tier</p>
              </div>
              <div className="w-full bg-black/20 border border-white/[0.05] rounded-lg p-5 space-y-3">
                 <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-widest text-white/30">
                    <span>Uptime</span>
                    <span className="text-white/40">99.9%</span>
                 </div>
                 <div className="w-full h-1 bg-white/[0.03] rounded-full overflow-hidden">
                    <div className="w-[99%] h-full bg-[#FF6248]/60" />
                 </div>
              </div>
              <button className="w-full bg-white/[0.05] border border-white/20 text-white/90 hover:bg-white hover:text-black py-4 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] transition-all">
                 Upgrade Matrix
              </button>
           </section>

           {/* Danger Zone */}
           <section className="bg-[#FF6248]/[0.01] border border-[#FF6248]/10 rounded-xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                 <AlertTriangle className="w-4 h-4 text-[#FF6248]/60" />
                 <h4 className="text-[12px] font-black text-[#FF6248]/80 uppercase tracking-widest">Protocol Termination</h4>
              </div>
              <p className="text-[11px] text-white/50 font-bold leading-relaxed">Warning: Initiates total architectural purge. Non-recoverable.</p>
              <button 
                disabled={isDeleting}
                onClick={handleDelete}
                className="w-full border border-[#FF6248]/20 text-[#FF6248]/60 hover:bg-[#FF6248] hover:text-black py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all"
              >
                {isDeleting ? 'Purging...' : 'Execute Shutdown'}
              </button>
           </section>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;

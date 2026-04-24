import React, { useState } from 'react';
import { X, Copy, Check, Server, ShieldCheck } from 'lucide-react';
import axios from 'axios';

const ProjectModal = ({ onClose, onProjectCreated }) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem('sentinel_token');
      const response = await axios.post('/api/projects', { name }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApiKey(response.data.api_key);
      onProjectCreated(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="glass-panel w-full max-w-md relative z-10 p-8 shadow-2xl border-primary/20">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        {!apiKey ? (
          <>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                <Server className="text-primary w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-white">Create New Project</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Project Name</label>
                <input 
                  type="text" 
                  autoFocus
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg py-2.5 px-4 text-sm text-white focus:border-primary focus:outline-none transition-colors"
                  placeholder="e.g. My Node API"
                />
              </div>

              <button 
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-2.5 rounded-lg text-sm transition-all"
              >
                {loading ? 'Creating...' : 'Initialize Monitoring'}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="text-success w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Success!</h2>
            <p className="text-slate-400 text-sm mb-8">Save this key. You will need it to initialize the SDK in your codebase.</p>

            <div className="bg-[#050506] border border-border rounded-lg p-4 mb-8 flex items-center justify-between group">
              <code className="text-primary font-mono text-xs">{apiKey}</code>
              <button 
                onClick={copyToClipboard}
                className="text-slate-500 hover:text-white p-1 hover:bg-white/5 rounded transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <button 
              onClick={onClose}
              className="w-full border border-border py-2.5 rounded-lg text-sm text-slate-300 hover:bg-white/5 transition-colors font-bold"
            >
              Go to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectModal;

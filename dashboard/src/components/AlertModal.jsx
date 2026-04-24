import React, { useState } from 'react';
import { X, Bell, Hash, Link as LinkIcon, Send } from 'lucide-react';
import axios from 'axios';

const AlertModal = ({ projectId, onClose, onRuleCreated }) => {
  const [metricType, setMetricType] = useState('latency');
  const [threshold, setThreshold] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [telegramChatId, setTelegramChatId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem('sentinel_token');
      const response = await axios.post('/api/alerts', {
        projectId,
        metricType,
        threshold: parseFloat(threshold),
        webhookUrl,
        telegramChatId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      onRuleCreated(response.data);
      onClose();
    } catch (err) {
      console.error('Failed to create alert rule');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="glass-panel w-full max-w-md relative z-10 p-8 shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-danger/20 rounded-lg flex items-center justify-center">
            <Bell className="text-danger w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-white">Create Alert Rule</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Metric Type</label>
            <select 
              value={metricType}
              onChange={(e) => setMetricType(e.target.value)}
              className="w-full bg-background border border-border rounded-lg py-2.5 px-4 text-sm text-white focus:border-primary focus:outline-none transition-colors"
            >
              <option value="latency">API Latency (ms)</option>
              <option value="cpu">CPU Usage (%)</option>
              <option value="ram">RAM Usage (%)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Threshold</label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="number" 
                required
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                className="w-full bg-background border border-border rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:border-primary focus:outline-none"
                placeholder={metricType === 'latency' ? 'e.g. 500' : 'e.g. 85'}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Discord Webhook URL</label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="url" 
                required
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="w-full bg-background border border-border rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:border-primary focus:outline-none"
                placeholder="https://discord.com/api/webhooks/..."
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Telegram Chat ID (Optional)</label>
            <div className="relative">
              <Send className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                value={telegramChatId}
                onChange={(e) => setTelegramChatId(e.target.value)}
                className="w-full bg-background border border-border rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:border-primary focus:outline-none"
                placeholder="e.g. 123456789"
              />
            </div>
          </div>

          <button 
            disabled={loading}
            className="w-full bg-danger hover:bg-red-600 text-white font-bold py-2.5 rounded-lg text-sm transition-all"
          >
            {loading ? 'Creating...' : 'Enable Alert'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AlertModal;

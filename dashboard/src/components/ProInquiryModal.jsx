import React, { useState } from 'react';
import { X, Send, Rocket, Globe, MessageSquare, CheckCircle2 } from 'lucide-react';

const ProInquiryModal = ({ isOpen, onClose, userEmail }) => {
  const [formData, setFormData] = useState({
    useCase: '',
    referral: '',
    teamSize: '1-5',
    additionalInfo: ''
  });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/notifications/pro-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          email: userEmail
        })
      });

      if (response.ok) {
        setStatus('success');
        setTimeout(() => {
          onClose();
          setStatus('idle');
        }, 3000);
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm">
      <div className="relative w-full max-w-xl bg-[#050506] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl">
        {/* Progress bar for success */}
        {status === 'success' && (
          <div className="absolute top-0 left-0 h-1 bg-green-500 animate-progress" style={{ width: '100%' }} />
        )}

        <div className="p-10">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#FF6044]/10 rounded-2xl flex items-center justify-center border border-[#FF6044]/20">
                <Rocket className="w-6 h-6 text-[#FF6044]" />
              </div>
              <div>
                <h2 className="text-[24px] font-black tracking-tight text-white">Upgrade to Pro</h2>
                <p className="text-[13px] text-white/40 uppercase tracking-widest">Application Protocol</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/5 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-white/20" />
            </button>
          </div>

          {status === 'success' ? (
            <div className="py-12 text-center animate-in fade-in zoom-in duration-300">
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-500/20">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="text-[20px] font-bold mb-4 text-white">Application Sent</h3>
              <p className="text-[14px] text-white/40 leading-relaxed max-w-sm mx-auto">
                We will contact you with the payment link on your email shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {!userEmail && (
                <div className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-[0.2em] text-white/30 flex items-center gap-2">
                    Your Email Address *
                  </label>
                  <input 
                    required
                    type="email"
                    placeholder="Where can we reach you?"
                    className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-5 py-4 text-[14px] outline-none focus:border-[#FF6044]/40 transition-all placeholder:text-white/10"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-white/30 flex items-center gap-2">
                  <Globe className="w-3 h-3" /> Where will you use Sentinel?
                </label>
                <input 
                  required
                  placeholder="e.g. Fintech Startup, E-commerce dashboard..."
                  className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-5 py-4 text-[14px] outline-none focus:border-[#FF6044]/40 transition-all placeholder:text-white/10"
                  value={formData.useCase}
                  onChange={(e) => setFormData({...formData, useCase: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-white/30 flex items-center gap-2">
                  <MessageSquare className="w-3 h-3" /> How did you hear about us?
                </label>
                <input 
                  required
                  placeholder="e.g. Twitter, GitHub, Friend..."
                  className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-5 py-4 text-[14px] outline-none focus:border-[#FF6044]/40 transition-all placeholder:text-white/10"
                  value={formData.referral}
                  onChange={(e) => setFormData({...formData, referral: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-white/30 flex items-center gap-2">
                   Additional Details
                </label>
                <textarea 
                  placeholder="Any specific features or requirements?"
                  rows={3}
                  className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-5 py-4 text-[14px] outline-none focus:border-[#FF6044]/40 transition-all placeholder:text-white/10 resize-none"
                  value={formData.additionalInfo}
                  onChange={(e) => setFormData({...formData, additionalInfo: e.target.value})}
                />
              </div>

              <div className="p-4 bg-[#FF6044]/5 border border-[#FF6044]/20 rounded-xl">
                 <p className="text-[12px] text-[#FF6044]/80 leading-relaxed italic">
                   Note: After submission, we will review your application and send a payment link to {userEmail || 'your email'}. Your Pro features will be activated once payment is confirmed.
                 </p>
              </div>

              <button 
                disabled={status === 'loading'}
                className="w-full py-5 bg-[#FF6044] hover:bg-[#FF8B77] disabled:opacity-50 text-black text-[14px] font-black uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-[#FF6044]/20 flex items-center justify-center gap-3"
              >
                {status === 'loading' ? 'Encrypting...' : (
                  <>
                    Submit Application <Send className="w-4 h-4" />
                  </>
                )}
              </button>

              {status === 'error' && (
                <p className="text-center text-red-500 text-[12px] font-bold">Uplink failed. Please check your connection and try again.</p>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProInquiryModal;

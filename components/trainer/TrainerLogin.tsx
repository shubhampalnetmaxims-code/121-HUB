import React, { useState } from 'react';
import { Mail, ArrowRight, UserCircle, ShieldCheck } from 'lucide-react';
import { Trainer } from '../../types';
import { useToast } from '../ToastContext';

interface TrainerLoginProps {
  trainers: Trainer[];
  onLogin: (trainer: Trainer) => void;
}

const TrainerLogin: React.FC<TrainerLoginProps> = ({ trainers, onLogin }) => {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trainer = trainers.find(t => t.email.toLowerCase() === email.toLowerCase());
    if (!trainer) {
      showToast('Unauthorized email. Access denied.', 'error');
      return;
    }
    setStep('otp');
    showToast('Magic code sent!', 'info');
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) {
      showToast('Enter valid code', 'warning');
      return;
    }
    const trainer = trainers.find(t => t.email.toLowerCase() === email.toLowerCase());
    if (trainer) {
      onLogin(trainer);
      showToast(`Welcome back, Coach ${trainer.name}`, 'success');
    }
  };

  return (
    <div className="h-full bg-white flex flex-col p-8 text-left animate-in fade-in duration-500">
      <div className="mb-12 flex flex-col items-center pt-10">
        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-[32px] flex items-center justify-center mb-6 shadow-sm">
           <UserCircle className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Trainer Portal</h2>
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-2">Coach Access Only</p>
      </div>

      {step === 'email' ? (
        <form onSubmit={handleEmailSubmit} className="space-y-8">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Institutional Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
              <input 
                autoFocus
                type="email" 
                placeholder="coach@121.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-5 bg-slate-50 border border-slate-100 rounded-[24px] outline-none font-bold text-slate-900 focus:ring-4 focus:ring-blue-600/10"
              />
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase mt-4 px-1">Try: eross@121.com</p>
          </div>
          <button 
            type="submit"
            className="w-full bg-black text-white py-5 rounded-[24px] font-black text-lg shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            Identify <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      ) : (
        <form onSubmit={handleOtpSubmit} className="space-y-8 animate-in slide-in-from-right duration-300">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Magic Code</label>
            <input 
              autoFocus
              type="text" 
              placeholder="0000"
              maxLength={4}
              value={otp}
              onChange={e => setOtp(e.target.value)}
              className="w-full px-4 py-6 bg-slate-50 border border-slate-100 rounded-[24px] outline-none font-black text-4xl text-center tracking-[0.5em] focus:ring-4 focus:ring-blue-600/10"
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-black text-white py-5 rounded-[24px] font-black text-lg shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            Authenticate <ShieldCheck className="w-5 h-5" />
          </button>
          <button type="button" onClick={() => setStep('email')} className="w-full text-slate-400 font-bold uppercase text-[10px] tracking-widest">Back</button>
        </form>
      )}
    </div>
  );
};

export default TrainerLogin;
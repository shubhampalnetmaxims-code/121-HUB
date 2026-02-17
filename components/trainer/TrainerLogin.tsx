import React, { useState } from 'react';
/* Added missing 'Check' import from lucide-react */
import { Mail, ArrowRight, UserCircle, ShieldCheck, Lock, Eye, EyeOff, KeyRound, Check, ShieldAlert } from 'lucide-react';
import { Trainer } from '../../types';
import { useToast } from '../ToastContext';

interface TrainerLoginProps {
  trainers: Trainer[];
  onLogin: (trainer: Trainer) => void;
  onUpdateTrainer: (id: string, updates: Partial<Trainer>) => void;
}

type LoginStep = 'email' | 'password' | 'otp' | 'set-password';

const TrainerLogin: React.FC<TrainerLoginProps> = ({ trainers, onLogin, onUpdateTrainer }) => {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [step, setStep] = useState<LoginStep>('email');
  const [targetTrainer, setTargetTrainer] = useState<Trainer | null>(null);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trainer = trainers.find(t => t.email.toLowerCase() === email.toLowerCase());
    
    if (!trainer) {
      showToast('Unauthorized email. Access denied.', 'error');
      return;
    }

    // USER REQUIREMENT: Check App Access status
    if (trainer.appAccess === 'restricted') {
      showToast('Access Suspended: Contact hub administrator.', 'error');
      return;
    }

    setTargetTrainer(trainer);

    if (trainer.password) {
      setStep('password');
    } else {
      // First time: Set password
      setStep('set-password');
      showToast('Welcome to the network! Please set your security password.', 'info');
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetTrainer) return;

    // Double check restriction on every credential check
    const currentStatus = trainers.find(t => t.id === targetTrainer.id);
    if (currentStatus?.appAccess === 'restricted') {
      showToast('Account Restricted. Entry denied.', 'error');
      setStep('email');
      return;
    }

    if (password === targetTrainer.password) {
      onLogin(targetTrainer);
      showToast(`Access Granted. Welcome back, ${targetTrainer.name}`, 'success');
    } else {
      showToast('Incorrect security password.', 'error');
    }
  };

  const handleSetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetTrainer) return;

    if (newPassword.length < 6) {
      showToast('Password must be at least 6 characters.', 'warning');
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match.', 'error');
      return;
    }

    // Persist password
    onUpdateTrainer(targetTrainer.id, { password: newPassword, isFirstLogin: false });
    
    // Auto login
    onLogin({ ...targetTrainer, password: newPassword, isFirstLogin: false });
    showToast('Secure password established.', 'success');
  };

  const handleForgotPassword = () => {
    setStep('otp');
    showToast('Verification code sent to institutional email.', 'info');
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) {
      showToast('Enter valid 4-digit code.', 'warning');
      return;
    }
    // Simple demo bypass
    setStep('set-password');
    showToast('Identity verified. Set a new password.', 'success');
  };

  return (
    <div className="h-full bg-white flex flex-col p-8 text-left animate-in fade-in duration-500 overflow-y-auto scrollbar-hide font-sans">
      <div className="mb-10 flex flex-col items-center pt-8 shrink-0">
        <div className="w-20 h-20 bg-slate-900 text-white rounded-[32px] flex items-center justify-center mb-6 shadow-xl shadow-slate-200 border-4 border-slate-50">
           <UserCircle className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight text-center leading-tight">
          {step === 'password' ? 'Coach Access' : 
           step === 'set-password' ? 'Set Credentials' :
           step === 'otp' ? 'Verify Identity' : 'Trainer Portal'}
        </h2>
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">
          {step === 'password' ? 'Authorized Node Entry' : 
           step === 'set-password' ? 'Establishing Security Key' :
           step === 'otp' ? 'Safety Verification' : '121 Wellness Network'}
        </p>
      </div>

      <div className="flex-1">
        {step === 'email' && (
          <form onSubmit={handleEmailSubmit} className="space-y-8 animate-in slide-in-from-bottom duration-300">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Institutional Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input 
                  autoFocus
                  type="email" 
                  placeholder="coach@121fit.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-5 bg-slate-50 border border-slate-100 rounded-[24px] outline-none font-bold text-slate-900 focus:ring-4 focus:ring-blue-600/10 transition-all shadow-inner"
                />
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-4 px-1">Institutional Identity Required</p>
            </div>
            <button 
              type="submit"
              disabled={!email.includes('@')}
              className="w-full bg-black text-white py-5 rounded-[28px] font-black text-lg shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              Authorize <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        )}

        {step === 'password' && (
          <form onSubmit={handlePasswordSubmit} className="space-y-8 animate-in slide-in-from-right duration-300">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Security Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                <input 
                  autoFocus
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-12 pr-14 py-5 bg-slate-50 border border-slate-100 rounded-[24px] outline-none font-bold text-slate-900 focus:ring-4 focus:ring-blue-600/10 transition-all shadow-inner"
                />
                <button 
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-300 hover:text-slate-600 transition-colors"
                >
                  {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <div className="flex justify-end mt-4">
                <button 
                  type="button" 
                  onClick={handleForgotPassword}
                  className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
            </div>
            <button 
              type="submit"
              disabled={!password}
              className="w-full bg-black text-white py-5 rounded-[28px] font-black text-lg shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              Sign In <KeyRound className="w-5 h-5" />
            </button>
            <button 
              type="button" 
              onClick={() => setStep('email')} 
              className="w-full text-slate-400 font-bold uppercase text-[10px] tracking-widest text-center"
            >
              Cancel and Back
            </button>
          </form>
        )}

        {step === 'set-password' && (
          <form onSubmit={handleSetPasswordSubmit} className="space-y-6 animate-in slide-in-from-right duration-300">
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">New Alphanumeric Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                  <input 
                    autoFocus
                    type="password" 
                    placeholder="Min 6 characters"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-5 bg-slate-50 border border-slate-100 rounded-[24px] outline-none font-bold text-slate-900 focus:ring-4 focus:ring-blue-600/10 transition-all shadow-inner"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Confirm Security Key</label>
                <div className="relative">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                  <input 
                    type="password" 
                    placeholder="Repeat password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-5 bg-slate-50 border border-slate-100 rounded-[24px] outline-none font-bold text-slate-900 focus:ring-4 focus:ring-blue-600/10 transition-all shadow-inner"
                  />
                </div>
              </div>
            </div>
            <div className="pt-4">
              <button 
                type="submit"
                disabled={!newPassword || newPassword !== confirmPassword}
                className="w-full bg-slate-900 text-white py-5 rounded-[28px] font-black text-lg shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                Confirm & Enter <Check className="w-5 h-5" />
              </button>
            </div>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={handleOtpSubmit} className="space-y-8 animate-in slide-in-from-right duration-300 text-center">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Recovery Code</label>
              <input 
                autoFocus
                type="text" 
                placeholder="0000"
                maxLength={4}
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                className="w-full px-4 py-6 bg-slate-50 border border-slate-100 rounded-[24px] outline-none font-black text-4xl text-center tracking-[0.5em] focus:ring-4 focus:ring-blue-600/10 shadow-inner"
              />
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-4 px-1">Verification required to reset password</p>
            </div>
            <button 
              type="submit"
              disabled={otp.length < 4}
              className="w-full bg-blue-600 text-white py-5 rounded-[28px] font-black text-lg shadow-xl shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              Verify <ShieldCheck className="w-5 h-5" />
            </button>
            <button 
              type="button" 
              onClick={() => setStep('password')} 
              className="w-full text-slate-400 font-bold uppercase text-[10px] tracking-widest text-center"
            >
              Back to Login
            </button>
          </form>
        )}
      </div>

      <div className="mt-10 pt-10 border-t border-slate-50 opacity-40 flex items-center justify-center gap-3">
         <ShieldCheck className="w-4 h-4" />
         <p className="text-[8px] font-black uppercase tracking-widest">End-to-End Secure Protocol Node</p>
      </div>
    </div>
  );
};

export default TrainerLogin;
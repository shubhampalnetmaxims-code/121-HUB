
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Mail, ShieldCheck, User, Phone, CreditCard, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { User as UserType } from '../../types';
import { useToast } from '../ToastContext';

interface OnboardingFlowProps {
  onComplete: (data: Omit<UserType, 'id' | 'status' | 'createdAt'>) => void;
  onCancel: () => void;
}

type OnboardingStep = 'email' | 'otp' | 'details' | 'payment';

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete, onCancel }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [step, setStep] = useState<OnboardingStep>('email');
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    phone: '',
    gender: 'Other',
    paymentMethod: 'skipped' as 'added' | 'skipped',
    otp: ''
  });

  // Extract where to return to after completion
  const returnTo = (location.state as any)?.returnTo || '/app/home';

  const nextStep = () => {
    if (step === 'email') {
      if (!formData.email.includes('@')) {
        showToast('Please enter a valid email address', 'error');
        return;
      }
      setStep('otp');
    }
    else if (step === 'otp') {
      if (formData.otp.length < 4) {
        showToast('Please enter the verification code', 'warning');
        return;
      }
      showToast('Verification successful', 'success');
      setStep('details');
    }
    else if (step === 'details') {
      if (!formData.fullName || !formData.phone) {
        showToast('Please complete your profile details', 'warning');
        return;
      }
      setStep('payment');
    }
  };

  const prevStep = () => {
    if (step === 'otp') setStep('email');
    else if (step === 'details') setStep('otp');
    else if (step === 'payment') setStep('details');
    else onCancel();
  };

  const handleFinalize = (isPaymentAdded: boolean) => {
    onComplete({
      email: formData.email,
      fullName: formData.fullName,
      phone: formData.phone,
      gender: formData.gender,
      paymentMethod: isPaymentAdded ? 'added' : 'skipped'
    });
    if (isPaymentAdded) {
       showToast('Payment method linked successfully', 'success');
    }
    // Navigate back to where they started
    navigate(returnTo, { replace: true });
  };

  return (
    <div className="h-full bg-white flex flex-col p-8 text-left animate-in slide-in-from-right duration-300">
      <div className="flex items-center justify-between mb-12">
        <button onClick={prevStep} className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex gap-1.5">
          {['email', 'otp', 'details', 'payment'].map((s, idx) => (
            <div 
              key={s} 
              className={`h-1.5 rounded-full transition-all duration-300 ${
                ['email', 'otp', 'details', 'payment'].indexOf(step) >= idx ? 'w-6 bg-blue-600' : 'w-3 bg-slate-100'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {step === 'email' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-500">
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">Start Your Journey</h2>
              <p className="text-slate-500 font-medium">Enter your email to join the 121 community.</p>
            </div>
            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  autoFocus
                  type="email" 
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                  className="w-full pl-12 pr-4 py-5 bg-slate-50 border border-slate-100 rounded-[24px] outline-none focus:ring-4 focus:ring-blue-600/10 font-bold"
                />
              </div>
              <button 
                onClick={nextStep}
                disabled={!formData.email.includes('@')}
                className="w-full bg-black text-white py-5 rounded-[24px] font-black text-lg flex items-center justify-center gap-2 hover:bg-slate-800 transition-all disabled:opacity-50"
              >
                Continue <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {step === 'otp' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-500">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-[24px] flex items-center justify-center">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">Verify Email</h2>
              <p className="text-slate-500 font-medium">We sent a magic code to <br/><span className="text-slate-900 font-bold">{formData.email}</span></p>
            </div>
            <div className="space-y-6">
              <input 
                autoFocus
                type="text" 
                maxLength={6}
                placeholder="000 000"
                value={formData.otp}
                onChange={e => setFormData(p => ({ ...p, otp: e.target.value }))}
                className="w-full px-4 py-6 bg-slate-50 border border-slate-100 rounded-[24px] outline-none focus:ring-4 focus:ring-blue-600/10 font-black text-4xl text-center tracking-[0.5em]"
              />
              <button 
                onClick={nextStep}
                disabled={formData.otp.length < 4}
                className="w-full bg-black text-white py-5 rounded-[24px] font-black text-lg flex items-center justify-center gap-2 hover:bg-slate-800 transition-all disabled:opacity-50"
              >
                Verify Code
              </button>
              <button 
                type="button"
                onClick={() => showToast('Magic code resent', 'info')}
                className="w-full text-blue-600 font-bold text-sm"
              >
                Resend OTP
              </button>
            </div>
          </div>
        )}

        {step === 'details' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-500">
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">About You</h2>
              <p className="text-slate-500 font-medium">Let's personalize your hub experience.</p>
            </div>
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={e => setFormData(p => ({ ...p, fullName: e.target.value }))}
                  className="w-full pl-12 pr-4 py-5 bg-slate-50 border border-slate-100 rounded-[24px] outline-none focus:ring-4 focus:ring-blue-600/10 font-bold"
                />
              </div>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="tel" 
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                  className="w-full pl-12 pr-4 py-5 bg-slate-50 border border-slate-100 rounded-[24px] outline-none focus:ring-4 focus:ring-blue-600/10 font-bold"
                />
              </div>
              <div className="flex gap-2">
                {['Male', 'Female', 'Other'].map(g => (
                  <button 
                    key={g}
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, gender: g }))}
                    className={`flex-1 py-4 rounded-2xl font-bold text-sm transition-all border ${
                      formData.gender === g ? 'bg-black text-white border-black' : 'bg-white text-slate-400 border-slate-100'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
              <button 
                onClick={nextStep}
                disabled={!formData.fullName || !formData.phone}
                className="w-full mt-4 bg-black text-white py-5 rounded-[24px] font-black text-lg flex items-center justify-center gap-2 hover:bg-slate-800 transition-all disabled:opacity-50"
              >
                Almost There <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {step === 'payment' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-500">
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">One Last Step</h2>
              <p className="text-slate-500 font-medium">Add a payment method for seamless bookings and market purchases.</p>
            </div>
            
            <div className="p-8 bg-blue-600 rounded-[40px] text-white relative overflow-hidden shadow-2xl shadow-blue-500/20">
               <div className="relative z-10 space-y-8">
                 <div className="flex justify-between items-start">
                    <CreditCard className="w-10 h-10 opacity-60" />
                    <div className="text-right">
                       <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Default Method</p>
                    </div>
                 </div>
                 <div className="text-xl font-bold tracking-widest opacity-20 italic">•••• •••• •••• ••••</div>
                 <div className="flex justify-between items-end">
                    <p className="font-bold uppercase text-xs tracking-widest">{formData.fullName || 'Member Name'}</p>
                    <button type="button" className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Add Card</button>
                 </div>
               </div>
               <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
            </div>

            <div className="space-y-4 pt-4">
              <button 
                onClick={() => handleFinalize(true)}
                className="w-full bg-black text-white py-5 rounded-[24px] font-black text-lg flex items-center justify-center gap-2 hover:bg-slate-800 transition-all"
              >
                Finish & Enter Hub <Check className="w-5 h-5" />
              </button>
              <button 
                onClick={() => handleFinalize(false)}
                className="w-full py-4 text-slate-400 font-bold hover:text-slate-600 transition-colors"
              >
                Skip for now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingFlow;

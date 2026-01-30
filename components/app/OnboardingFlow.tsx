import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Mail, ShieldCheck, User, Phone, CreditCard, ArrowLeft, ArrowRight, Check, Plus, Trash2, Shield, Camera, CloudUpload } from 'lucide-react';
import { User as UserType, PaymentCard } from '../../types';
import { useToast } from '../ToastContext';
import CardFormModal from './CardFormModal';

interface OnboardingFlowProps {
  users: UserType[];
  onComplete: (data: any) => void;
  onCancel: () => void;
}

type OnboardingStep = 'email' | 'otp' | 'details' | 'payment';

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ users, onComplete, onCancel }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<OnboardingStep>('email');
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    phone: '',
    gender: 'Other',
    profilePicture: '',
    otp: ''
  });
  const [paymentCards, setPaymentCards] = useState<PaymentCard[]>([]);

  const returnTo = (location.state as any)?.returnTo || '/app/home';

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profilePicture: reader.result as string }));
        showToast('Profile picture added', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const nextStep = () => {
    if (step === 'email') {
      if (!formData.email.includes('@')) {
        showToast('Please enter a valid email address', 'error');
        return;
      }
      
      const existing = users.find(u => u.email.toLowerCase() === formData.email.toLowerCase());
      if (existing) {
        setIsExistingUser(true);
      }
      setStep('otp');
    }
    else if (step === 'otp') {
      if (formData.otp.length < 4) {
        showToast('Please enter the verification code', 'warning');
        return;
      }
      showToast('Verification successful', 'success');
      
      if (isExistingUser) {
        const user = users.find(u => u.email.toLowerCase() === formData.email.toLowerCase());
        if (user) {
          onComplete(user);
          navigate(returnTo, { replace: true });
        }
      } else {
        setStep('details');
      }
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

  const handleAddCard = (cardData: Omit<PaymentCard, 'id' | 'createdAt'>) => {
    const newCard: PaymentCard = {
      ...cardData,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: Date.now(),
      isPrimary: paymentCards.length === 0 ? true : cardData.isPrimary
    };
    
    setPaymentCards(prev => {
      let updated = [...prev];
      if (newCard.isPrimary) {
        updated = updated.map(c => ({ ...c, isPrimary: false }));
      }
      return [...updated, newCard];
    });
    
    setIsCardModalOpen(false);
    showToast('Card validated and added', 'success');
  };

  const removeCard = (id: string) => {
    setPaymentCards(prev => {
      const filtered = prev.filter(c => c.id !== id);
      if (filtered.length === 1) filtered[0].isPrimary = true;
      return filtered;
    });
  };

  const handleFinalize = (skipPayment: boolean = false) => {
    onComplete({
      email: formData.email,
      fullName: formData.fullName,
      phone: formData.phone,
      gender: formData.gender,
      profilePicture: formData.profilePicture,
      paymentMethod: (!skipPayment && paymentCards.length > 0) ? 'added' : 'skipped',
      paymentCards: skipPayment ? [] : paymentCards
    });
    navigate(returnTo, { replace: true });
  };

  return (
    <div className="h-full bg-white flex flex-col p-8 text-left animate-in slide-in-from-right duration-300">
      <div className="flex items-center justify-between mb-12 shrink-0">
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

      <div className="flex-1 flex flex-col overflow-y-auto scrollbar-hide">
        {step === 'email' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-500">
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-4 leading-none">Start Your Journey</h2>
              <p className="text-slate-500 font-medium leading-relaxed">Enter your email to join the 121 community.</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-4">Try: shubham@gmail.com</p>
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
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-4 leading-none">Verify Email</h2>
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
                {isExistingUser ? 'Login' : 'Verify Code'}
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
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-500 pb-8">
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-4 leading-none">About You</h2>
              <p className="text-slate-500 font-medium leading-relaxed">Let's personalize your hub experience.</p>
            </div>

            <div className="flex justify-center mb-4">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-24 h-24 rounded-full bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden cursor-pointer hover:border-blue-500 transition-all"
              >
                {formData.profilePicture ? (
                  <img src={formData.profilePicture} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <Camera className="w-6 h-6 text-slate-400" />
                    <span className="text-[8px] font-black text-slate-400 uppercase">Photo</span>
                  </div>
                )}
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
              </div>
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
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-500 pb-10">
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-4 leading-none">Wallet Setup</h2>
              <p className="text-slate-500 font-medium leading-relaxed">Add one or more cards for seamless bookings and market purchases.</p>
            </div>
            
            <div className="space-y-4">
              {paymentCards.map(card => (
                <div 
                  key={card.id}
                  className={`p-5 rounded-[28px] border-2 transition-all relative ${
                    card.isPrimary ? 'border-blue-600 bg-blue-50/10' : 'border-slate-100 bg-slate-50/50'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-6 bg-slate-900 rounded-md flex items-center justify-center text-[7px] font-black italic text-white uppercase">{card.brand}</div>
                      <div className="text-left">
                        <p className="font-mono text-sm tracking-widest leading-none mb-1">{card.cardNumber}</p>
                        <div className="flex items-center gap-2">
                           {card.isPrimary && <span className="text-[8px] font-black text-blue-600 uppercase tracking-widest">Primary</span>}
                           <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Exp: {card.expiryDate}</span>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => removeCard(card.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              <button 
                onClick={() => setIsCardModalOpen(true)}
                className="w-full py-6 border-2 border-dashed border-slate-200 rounded-[32px] flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-blue-600 hover:border-blue-600 hover:bg-blue-50/30 transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Plus className="w-5 h-5" />
                </div>
                <span className="font-bold text-xs">Add Payment Card</span>
              </button>
            </div>

            <div className="space-y-4 pt-4">
              <button 
                onClick={() => handleFinalize(false)}
                disabled={paymentCards.length === 0}
                className="w-full bg-black text-white py-5 rounded-[24px] font-black text-lg flex items-center justify-center gap-2 hover:bg-slate-800 transition-all disabled:opacity-50"
              >
                Finish & Enter Hub <Check className="w-5 h-5" />
              </button>
              <button 
                onClick={() => handleFinalize(true)}
                className="w-full py-4 text-slate-400 font-bold hover:text-slate-600 transition-colors"
              >
                Skip for now
              </button>
            </div>
            
            <div className="flex items-center justify-center gap-2 py-4 opacity-40 grayscale pointer-events-none">
               <Shield className="w-4 h-4" />
               <p className="text-[10px] font-black uppercase tracking-widest">Encrypted Data Only</p>
            </div>
          </div>
        )}
      </div>

      {isCardModalOpen && (
        <CardFormModal 
          onClose={() => setIsCardModalOpen(false)} 
          onSave={handleAddCard} 
        />
      )}
    </div>
  );
};

export default OnboardingFlow;

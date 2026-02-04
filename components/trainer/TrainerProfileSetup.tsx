import React, { useState, useRef } from 'react';
import { Camera, ShieldCheck, User, Star, Award, ArrowRight, Check } from 'lucide-react';
import { Trainer } from '../../types';
import { useToast } from '../ToastContext';

interface TrainerProfileSetupProps {
  trainer: Trainer;
  onComplete: (updates: Partial<Trainer>) => void;
}

const TrainerProfileSetup: React.FC<TrainerProfileSetupProps> = ({ trainer, onComplete }) => {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
    profilePicture: trainer.profilePicture || '',
    description: trainer.description || '',
    speciality: trainer.speciality || '',
    experience: trainer.experience || ''
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData(p => ({ ...p, profilePicture: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const handleNext = () => {
    if (step === 1) {
      if (formData.password.length < 4) {
        showToast('Password must be at least 4 characters', 'warning');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
      }
      setStep(2);
    } else {
      onComplete(formData);
      showToast('Profile configured successfully', 'success');
    }
  };

  return (
    <div className="h-full bg-white flex flex-col p-8 text-left animate-in slide-in-from-bottom duration-500 overflow-hidden">
      <div className="flex items-center justify-between mb-12 shrink-0">
        <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">Security<br/>Setup</h2>
        <div className="flex gap-1">
          {[1, 2].map(s => (
            <div key={s} className={`h-1 rounded-full transition-all duration-300 ${step >= s ? 'w-8 bg-blue-600' : 'w-4 bg-slate-100'}`} />
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide pb-20">
        {step === 1 ? (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div>
              <p className="text-slate-500 font-medium leading-relaxed">Establish your coach credentials for the 121 network.</p>
            </div>
            <div className="space-y-4">
               <div className="relative">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input 
                    type="password" 
                    placeholder="New Security Password"
                    value={formData.password}
                    onChange={e => setFormData(p => ({ ...p, password: e.target.value }))}
                    className="w-full pl-11 pr-4 py-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold"
                  />
               </div>
               <div className="relative">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input 
                    type="password" 
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={e => setFormData(p => ({ ...p, confirmPassword: e.target.value }))}
                    className="w-full pl-11 pr-4 py-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold"
                  />
               </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-in slide-in-from-right duration-500">
            <div className="flex justify-center">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-28 h-28 rounded-[40px] bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden cursor-pointer hover:border-blue-500 transition-all relative group"
              >
                {formData.profilePicture ? (
                  <img src={formData.profilePicture} className="w-full h-full object-cover group-hover:opacity-60" />
                ) : (
                  <Camera className="w-8 h-8 text-slate-300" />
                )}
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
              </div>
            </div>

            <div className="space-y-5">
               <div className="relative">
                  <Star className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input 
                    type="text" 
                    placeholder="Primary Speciality (e.g. Boxing)"
                    value={formData.speciality}
                    onChange={e => setFormData(p => ({ ...p, speciality: e.target.value }))}
                    className="w-full pl-11 pr-4 py-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold"
                  />
               </div>
               <div className="relative">
                  <Award className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input 
                    type="text" 
                    placeholder="Years of Experience"
                    value={formData.experience}
                    onChange={e => setFormData(p => ({ ...p, experience: e.target.value }))}
                    className="w-full pl-11 pr-4 py-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold"
                  />
               </div>
               <textarea 
                  placeholder="Tell members about your training philosophy..."
                  value={formData.description}
                  onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                  className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[32px] outline-none font-medium text-sm min-h-[120px]"
               />
            </div>
          </div>
        )}
      </div>

      <div className="p-8 pt-0 sticky bottom-0 left-0 right-0 bg-white">
        <button 
          onClick={handleNext}
          className="w-full py-5 bg-black text-white rounded-[28px] font-black text-xl shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          {step === 1 ? 'Next' : 'Complete Setup'} <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default TrainerProfileSetup;
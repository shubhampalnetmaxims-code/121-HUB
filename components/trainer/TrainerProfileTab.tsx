import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Mail, Phone, Building, ShieldCheck, Edit3, Save, Star, Award, Camera, HelpCircle } from 'lucide-react';
import { Trainer, Facility } from '../../types';
import { useToast } from '../ToastContext';

interface TrainerProfileTabProps {
  trainer: Trainer;
  facilities: Facility[];
  onLogout: () => void;
  onUpdateTrainer: (id: string, updates: Partial<Trainer>) => void;
}

const TrainerProfileTab: React.FC<TrainerProfileTabProps> = ({ trainer, facilities, onLogout, onUpdateTrainer }) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    description: trainer.description,
    speciality: trainer.speciality || '',
    experience: trainer.experience || ''
  });

  const assignedFacilities = facilities.filter(f => trainer.facilityIds.includes(f.id));

  const handleSave = () => {
    onUpdateTrainer(trainer.id, formData);
    setIsEditing(false);
    showToast('Profile updated', 'success');
  };

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden text-left relative">
      <div className="bg-white p-6 pt-10 border-b border-slate-100 shrink-0 flex justify-between items-center">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 uppercase">Coach Profile</h2>
        <div className="flex gap-2">
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="p-2 bg-slate-50 text-blue-600 rounded-xl hover:bg-blue-50 transition-colors"
            >
              <Edit3 className="w-5 h-5" />
            </button>
          ) : (
            <button 
              onClick={handleSave}
              className="p-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors"
            >
              <Save className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 pb-24 space-y-6 scrollbar-hide">
        <section className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-5 relative z-10">
            <div className="w-20 h-20 rounded-[28px] bg-slate-100 overflow-hidden flex items-center justify-center border border-slate-100 shadow-sm shrink-0">
              {trainer.profilePicture ? (
                <img src={trainer.profilePicture} className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-slate-300" />
              )}
            </div>
            <div className="flex-1 overflow-hidden">
              <h3 className="text-xl font-black text-slate-900 tracking-tight truncate leading-none uppercase mb-2">{trainer.name}</h3>
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Master Hub Specialist</p>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-slate-50 space-y-2 relative z-10">
            <div className="flex items-center gap-3">
              <Mail className="w-3.5 h-3.5 text-slate-300" />
              <span className="text-xs font-bold text-slate-500">{trainer.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-3.5 h-3.5 text-slate-300" />
              <span className="text-xs font-bold text-slate-500">{trainer.phone}</span>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-4">
           <button onClick={() => navigate('/trainer/support')} className="p-5 bg-white border border-slate-100 rounded-[32px] flex flex-col items-center justify-center gap-2 active:scale-95 transition-all shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                 <HelpCircle className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-700">Get Support</span>
           </button>
           <button onClick={onLogout} className="p-5 bg-white border border-slate-100 rounded-[32px] flex flex-col items-center justify-center gap-2 active:scale-95 transition-all shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                 <LogOut className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-700">Sign Out</span>
           </button>
        </section>

        <section className="space-y-4">
           <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Professional Specs</h4>
           {isEditing ? (
             <div className="space-y-3">
                <div className="relative">
                   <Star className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                   <input 
                      type="text" 
                      value={formData.speciality}
                      onChange={e => setFormData(p => ({ ...p, speciality: e.target.value }))}
                      className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-sm"
                      placeholder="Primary Speciality"
                   />
                </div>
                <div className="relative">
                   <Award className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                   <input 
                      type="text" 
                      value={formData.experience}
                      onChange={e => setFormData(p => ({ ...p, experience: e.target.value }))}
                      className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-sm"
                      placeholder="Experience (e.g. 5 Years)"
                   />
                </div>
                <textarea 
                   value={formData.description}
                   onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                   className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[28px] outline-none font-medium text-sm min-h-[120px]"
                   placeholder="Your professional bio..."
                />
             </div>
           ) : (
             <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                   <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Focus</p>
                      <p className="font-bold text-slate-900 text-xs">{trainer.speciality || 'Generalist'}</p>
                   </div>
                   <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Legacy</p>
                      <p className="font-bold text-slate-900 text-xs">{trainer.experience || '--'}</p>
                   </div>
                </div>
                <div className="p-6 bg-slate-900 rounded-[32px] text-white relative overflow-hidden">
                   <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-3 relative z-10">Biography</p>
                   <p className="text-xs font-medium leading-relaxed italic opacity-90 relative z-10" dangerouslySetInnerHTML={{ __html: trainer.description }} />
                   <Edit3 className="absolute -right-4 -bottom-4 w-24 h-24 text-white/5 rotate-12" />
                </div>
             </div>
           )}
        </section>

        <section className="space-y-4">
           <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Network Deployment</h4>
           <div className="space-y-2">
              {assignedFacilities.map(f => (
                <div key={f.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl shadow-xs">
                   <div className="flex items-center gap-3 text-left">
                      <Building className="w-4 h-4 text-blue-600" />
                      <span className="text-xs font-extrabold text-slate-900 uppercase tracking-tight">{f.name}</span>
                   </div>
                   <ShieldCheck className="w-4 h-4 text-green-600" />
                </div>
              ))}
           </div>
        </section>
      </div>
    </div>
  );
};

export default TrainerProfileTab;

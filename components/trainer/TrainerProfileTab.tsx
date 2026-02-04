import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Mail, Phone, Building, ShieldCheck, Edit3 } from 'lucide-react';
import { Trainer, Facility } from '../../types';

interface TrainerProfileTabProps {
  trainer: Trainer;
  facilities: Facility[];
  onLogout: () => void;
  onUpdateTrainer: (id: string, updates: Partial<Trainer>) => void;
}

const TrainerProfileTab: React.FC<TrainerProfileTabProps> = ({ trainer, facilities, onLogout, onUpdateTrainer }) => {
  const navigate = useNavigate();
  const assignedFacilities = facilities.filter(f => trainer.facilityIds.includes(f.id));

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden text-left">
      <div className="bg-white p-6 pt-10 border-b border-slate-100 shrink-0">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 uppercase">Coach Profile</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-5 pb-24 space-y-6 scrollbar-hide">
        <section className="bg-white p-6 rounded-md border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-5 relative z-10">
            <div className="w-16 h-16 rounded-md bg-slate-100 overflow-hidden flex items-center justify-center border border-slate-100 shadow-xs">
              {trainer.profilePicture ? (
                <img src={trainer.profilePicture} className="w-full h-full object-cover" />
              ) : (
                <User className="w-8 h-8 text-slate-300" />
              )}
            </div>
            <div className="flex-1 overflow-hidden">
              <h3 className="text-xl font-bold text-slate-900 tracking-tight truncate leading-none uppercase mb-2">{trainer.name}</h3>
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Verified 121 Specialist</p>
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

        <section className="space-y-4">
           <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Network Access</h4>
           <div className="space-y-2">
              {assignedFacilities.map(f => (
                <div key={f.id} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-md">
                   <div className="flex items-center gap-3">
                      <Building className="w-4 h-4 text-slate-400" />
                      <span className="text-xs font-bold text-slate-700 uppercase">{f.name}</span>
                   </div>
                   <ShieldCheck className="w-4 h-4 text-green-600" />
                </div>
              ))}
           </div>
        </section>

        <section className="bg-slate-900 rounded-md p-6 text-white space-y-2">
           <div className="flex justify-between items-center mb-2">
             <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest">Professional Bio</h4>
             <Edit3 className="w-3.5 h-3.5 opacity-40" />
           </div>
           <p className="text-xs font-medium leading-relaxed italic opacity-80" dangerouslySetInnerHTML={{ __html: trainer.description }} />
        </section>

        <button 
          onClick={onLogout}
          className="w-full py-4 bg-red-50 text-red-600 rounded-md font-black text-[10px] uppercase tracking-widest active:scale-[0.98] transition-all border border-red-100 flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" /> Sign Out Session
        </button>
      </div>
    </div>
  );
};

export default TrainerProfileTab;

import React from 'react';
import { X, Mail, Phone, Users, MapPin, Calendar, Palette } from 'lucide-react';
import { Trainer, Facility } from '../../types';

interface TrainerViewModalProps {
  trainer: Trainer;
  facilities: Facility[];
  onClose: () => void;
}

const TrainerViewModal: React.FC<TrainerViewModalProps> = ({ trainer, facilities, onClose }) => {
  const assignedFacilities = facilities.filter(f => trainer.facilityIds.includes(f.id));

  return (
    <div className="fixed inset-0 z-[160] overflow-hidden flex items-center justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>
      <div className="relative h-full w-full max-w-xl bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
        <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">Trainer Details</h3>
          <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-2xl transition-colors"><X className="w-6 h-6" /></button>
        </div>
        
        <div className="flex-1 p-6 md:p-10 space-y-10 overflow-y-auto pb-24 scrollbar-hide text-left">
          <div className="flex flex-col md:flex-row items-center gap-8 border-b border-slate-50 pb-10">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-[40px] overflow-hidden bg-slate-100 ring-8 ring-slate-50 shadow-inner">
               {trainer.profilePicture ? (
                 <img src={trainer.profilePicture} className="w-full h-full object-cover" />
               ) : (
                 <Users className="w-12 h-12 mx-auto mt-10 text-slate-300" />
               )}
            </div>
            <div className="text-center md:text-left">
               <h4 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter mb-2">{trainer.name}</h4>
               <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Master Trainer Portfolio</p>
               <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                    <Mail className="w-4 h-4 text-blue-600" /> {trainer.email}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-600 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                    <Phone className="w-4 h-4 text-blue-600" /> {trainer.phone}
                  </div>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Identity Context</label>
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-2xl shadow-lg flex items-center justify-center text-white" style={{ backgroundColor: trainer.colorCode }}>
                   <Palette className="w-5 h-5" />
                 </div>
                 <div>
                   <p className="font-bold text-slate-900 text-sm">{trainer.colorCode}</p>
                   <p className="text-[10px] text-slate-400 uppercase font-black">Brand Hex</p>
                 </div>
               </div>
            </div>
            <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Member Since</label>
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-blue-600">
                   <Calendar className="w-5 h-5" />
                 </div>
                 <div>
                   <p className="font-bold text-slate-900 text-sm">{new Date(trainer.createdAt).toLocaleDateString()}</p>
                   <p className="text-[10px] text-slate-400 uppercase font-black">Staff Onboarding</p>
                 </div>
               </div>
            </div>
          </div>

          <div>
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block">Associated Facilities</label>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
               {assignedFacilities.map(f => (
                 <div key={f.id} className="flex items-center gap-3 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                   <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                      <MapPin className="w-4 h-4" />
                   </div>
                   <span className="font-bold text-slate-800">{f.name}</span>
                 </div>
               ))}
             </div>
          </div>

          <div>
             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 block">Professional Biography</label>
             <div 
              className="p-8 bg-slate-50 rounded-[32px] border border-slate-100 text-slate-600 leading-relaxed font-medium prose prose-blue max-w-none"
              dangerouslySetInnerHTML={{ __html: trainer.description }}
             />
          </div>

          <button onClick={onClose} className="w-full bg-black text-white py-5 rounded-[28px] font-black text-lg shadow-2xl hover:bg-slate-800 transition-all active:scale-95">Close Profile</button>
        </div>
      </div>
    </div>
  );
};

export default TrainerViewModal;

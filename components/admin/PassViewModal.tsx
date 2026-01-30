import React from 'react';
// Fix: Added Check to the lucide-react icon imports
import { X, Ticket, Users, Layers, MapPin, BookOpen, DollarSign, Info, Check } from 'lucide-react';
import { Pass, Class } from '../../types';

interface PassViewModalProps {
  pass: Pass;
  facilityName: string;
  classes: Class[];
  onClose: () => void;
}

const PassViewModal: React.FC<PassViewModalProps> = ({ pass, facilityName, classes, onClose }) => {
  const allowedClasses = pass.isAllClasses 
    ? [{ name: 'All Sessions at ' + facilityName }] 
    : classes.filter(c => pass.allowedClassIds.includes(c.id));

  return (
    <div className="fixed inset-0 z-[160] overflow-hidden flex items-center justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>
      <div className="relative h-full w-full max-w-xl bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
           <div>
             <h3 className="text-2xl font-black text-slate-900">Pass Specification</h3>
             <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Facility: {facilityName}</p>
           </div>
           <button onClick={onClose} className="p-3 bg-white rounded-2xl hover:bg-slate-100 transition-colors shadow-sm"><X className="w-6 h-6" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-10 pb-32 scrollbar-hide text-left">
           <section className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden">
              <div className="relative z-10 space-y-6">
                <div className="flex justify-between items-start">
                   <div className="p-3 bg-white/10 rounded-2xl"><Ticket className="w-8 h-8 text-blue-400" /></div>
                   <div className="text-right">
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Value Structure</p>
                      <p className="text-4xl font-black text-blue-400">${pass.price}</p>
                   </div>
                </div>
                <div>
                   <h4 className="text-3xl font-black tracking-tighter leading-none mb-2">{pass.name}</h4>
                   <div className="flex gap-4">
                      <div className="flex items-center gap-1.5"><Layers className="w-4 h-4 opacity-40" /><span className="text-xs font-bold">{pass.credits} Credits</span></div>
                      <div className="flex items-center gap-1.5"><Users className="w-4 h-4 opacity-40" /><span className="text-xs font-bold">{pass.personsPerBooking} / Booking</span></div>
                   </div>
                </div>
              </div>
              <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"></div>
           </section>

           <section className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Info className="w-3.5 h-3.5" /> Core Description</label>
              <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100">
                <p className="text-slate-600 leading-relaxed font-medium">{pass.description}</p>
              </div>
           </section>

           <section className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><BookOpen className="w-3.5 h-3.5" /> Eligibility Reach</label>
              <div className="grid grid-cols-1 gap-2">
                {allowedClasses.map((c, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                    <Check className="w-4 h-4 text-green-500 shrink-0" />
                    <span className="text-sm font-bold text-slate-900">{c.name}</span>
                  </div>
                ))}
              </div>
           </section>

           <div className="p-6 bg-blue-50/50 rounded-[32px] border border-blue-100/50 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black text-blue-600/60 uppercase tracking-widest">Inventory Management</p>
                <p className="font-extrabold text-blue-900">{pass.quantity} units available</p>
              </div>
              <div className={`px-4 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest ${pass.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                {pass.status}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PassViewModal;
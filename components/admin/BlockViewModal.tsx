
import React from 'react';
import { X, Layers, Calendar, Clock, User, DollarSign, Info, CheckCircle, MapPin, Users } from 'lucide-react';
import { Block, DAYS_OF_WEEK } from '../../types';

interface BlockViewModalProps {
  block: Block;
  facilityName: string;
  trainerName: string;
  onClose: () => void;
}

const BlockViewModal: React.FC<BlockViewModalProps> = ({ block, facilityName, trainerName, onClose }) => {
  return (
    <div className="fixed inset-0 z-[160] overflow-hidden flex items-center justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>
      <div className="relative h-full w-full max-w-xl bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 text-left">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
           <div>
             <h3 className="text-2xl font-black text-slate-900 uppercase">Block Protocol</h3>
             <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{facilityName}</p>
           </div>
           <button onClick={onClose} className="p-3 bg-white rounded-2xl hover:bg-slate-100 transition-colors shadow-sm"><X className="w-6 h-6" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-10 pb-32 scrollbar-hide">
           <section className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl shadow-slate-900/20">
              <div className="relative z-10 space-y-6">
                <div className="flex justify-between items-start">
                   <div className="p-3 bg-white/10 rounded-2xl"><Layers className="w-8 h-8 text-blue-400" /></div>
                   <div className="text-right">
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Total Contract Value</p>
                      <p className="text-4xl font-black text-blue-400">${block.totalAmount}</p>
                   </div>
                </div>
                <div>
                   <h4 className="text-3xl font-black tracking-tighter leading-none mb-2 uppercase">{block.name}</h4>
                   <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4 opacity-40" /><span className="text-xs font-bold">{block.numWeeks} Weeks</span></div>
                      <div className="flex items-center gap-1.5"><Clock className="w-4 h-4 opacity-40" /><span className="text-xs font-bold">{block.startTime} • {block.duration}</span></div>
                      <div className="flex items-center gap-1.5"><User className="w-4 h-4 opacity-40" /><span className="text-xs font-bold">{trainerName}</span></div>
                   </div>
                </div>
              </div>
              <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"></div>
           </section>

           <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-slate-50 border border-slate-100 rounded-[32px]">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Pricing Breakdown</p>
                 <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold"><span className="text-slate-400">Join Fee</span><span className="text-slate-900">${block.bookingAmount}</span></div>
                    <div className="flex justify-between text-xs font-bold"><span className="text-slate-400">Weekly x {block.numWeeks}</span><span className="text-slate-900">${block.weeklyAmount}</span></div>
                 </div>
              </div>
              <div className="p-6 bg-slate-50 border border-slate-100 rounded-[32px]">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Operational Logic</p>
                 <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold"><span className="text-slate-400">Total Capacity</span><span className="text-slate-900">{block.maxPersons}</span></div>
                    <div className="flex justify-between text-xs font-bold"><span className="text-slate-400">Book Max</span><span className="text-slate-900">{block.maxPersonsPerBooking}</span></div>
                 </div>
              </div>
           </div>

           <section className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Info className="w-3.5 h-3.5" /> High-Level Summary</label>
              <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100">
                <p className="text-slate-900 font-bold mb-4">{block.about}</p>
                <div className="pt-4 border-t border-slate-200">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Member Expectations</p>
                  <p className="text-slate-600 text-sm leading-relaxed font-medium">{block.expect}</p>
                </div>
              </div>
           </section>

           <section className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> Recurrence Cycle</label>
              <div className="flex flex-wrap gap-2">
                 {DAYS_OF_WEEK.map((day, idx) => {
                    const isActive = block.daysOfWeek.includes(idx);
                    return (
                      <div key={day} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${isActive ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-slate-50 text-slate-300 border border-slate-100'}`}>
                         {day}
                      </div>
                    );
                 })}
              </div>
           </section>

           <div className="p-6 bg-blue-50/50 rounded-[32px] border border-blue-100/50 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black text-blue-600/60 uppercase tracking-widest">Public Status</p>
                <p className="font-extrabold text-blue-900">{block.status === 'active' ? 'Visible to Users' : 'System Hidden'}</p>
              </div>
              <CheckCircle className={`w-8 h-8 ${block.status === 'active' ? 'text-green-500' : 'text-slate-300'}`} />
           </div>

           <button onClick={onClose} className="w-full py-5 bg-black text-white rounded-[28px] font-black text-lg shadow-2xl active:scale-95 transition-all">Close Perspective</button>
        </div>
      </div>
    </div>
  );
};

export default BlockViewModal;

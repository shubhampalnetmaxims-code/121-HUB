
import React, { useState, useEffect } from 'react';
import { X, Layers, Calendar, Clock, Users, DollarSign, Info, Check, Plus } from 'lucide-react';
import { Facility, Block, Trainer, DAYS_OF_WEEK } from '../../types';
import ConfirmationModal from './ConfirmationModal';

interface BlockFormModalProps {
  block: Block | null;
  facilities: Facility[];
  trainers: Trainer[];
  initialFacilityId: string;
  onClose: () => void;
  onSave: (data: any) => void;
}

const BlockFormModal: React.FC<BlockFormModalProps> = ({ block, facilities, trainers, initialFacilityId, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    facilityId: block?.facilityId || initialFacilityId,
    trainerId: block?.trainerId || '',
    name: block?.name || '',
    about: block?.about || '',
    expect: block?.expect || '',
    numWeeks: block?.numWeeks || 4,
    daysOfWeek: block?.daysOfWeek || [] as number[],
    startDate: block?.startDate ? new Date(block.startDate).toISOString().split('T')[0] : '',
    startTime: block?.startTime || '18:00',
    duration: block?.duration || '1 hour',
    maxPersons: block?.maxPersons || 12,
    maxPersonsPerBooking: block?.maxPersonsPerBooking || 1,
    bookingAmount: block?.bookingAmount || 0,
    weeklyAmount: block?.weeklyAmount || 0,
    status: block?.status || 'active'
  });
  
  const [totalAmount, setTotalAmount] = useState(0);
  const [isConfirmingSave, setIsConfirmingSave] = useState(false);

  useEffect(() => {
    const total = formData.bookingAmount + (formData.weeklyAmount * formData.numWeeks);
    setTotalAmount(total);
  }, [formData.bookingAmount, formData.weeklyAmount, formData.numWeeks]);

  const toggleDay = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek.includes(idx) 
        ? prev.daysOfWeek.filter(d => d !== idx) 
        : [...prev.daysOfWeek, idx]
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsConfirmingSave(true);
  };

  const finalSave = () => {
    onSave({ 
      ...formData, 
      startDate: new Date(formData.startDate).getTime(),
      totalAmount 
    });
    setIsConfirmingSave(false);
  };

  const filteredTrainers = trainers.filter(t => t.facilityIds.includes(formData.facilityId));

  return (
    <>
      <div className="fixed inset-0 z-[160] overflow-hidden flex items-center justify-end">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>
        <div className="relative h-full w-full max-w-xl bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 text-left">
          <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
            <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight uppercase">{block ? 'Edit Block' : 'New Block'}</h3>
            <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-2xl transition-colors"><X className="w-6 h-6" /></button>
          </div>
          
          <form onSubmit={handleFormSubmit} className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto pb-32 scrollbar-hide">
            
            <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">Host Facility</label>
                <select required value={formData.facilityId} onChange={e => setFormData(p => ({ ...p, facilityId: e.target.value, trainerId: '' }))} className="w-full px-4 py-3 bg-white border border-blue-100 rounded-xl outline-none font-bold text-sm">
                  <option value="">Select...</option>
                  {facilities.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">Assigned Trainer</label>
                <select required value={formData.trainerId} onChange={e => setFormData(p => ({ ...p, trainerId: e.target.value }))} className="w-full px-4 py-3 bg-white border border-blue-100 rounded-xl outline-none font-bold text-sm">
                  <option value="">Select...</option>
                  {filteredTrainers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Block Title</label>
              <input required value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-black text-lg placeholder:text-slate-200" placeholder="e.g. Boxing Pro Series" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">About (Short)</label>
                <textarea required value={formData.about} onChange={e => setFormData(p => ({ ...p, about: e.target.value }))} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none font-medium text-sm h-24" placeholder="Brief summary..." />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">What to Expect</label>
                <textarea required value={formData.expect} onChange={e => setFormData(p => ({ ...p, expect: e.target.value }))} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none font-medium text-sm h-24" placeholder="Session details..." />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
               <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Schedule Configuration</label>
               <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="space-y-2">
                    <p className="text-[9px] font-bold text-slate-400 uppercase">Weeks</p>
                    <input type="number" min="1" value={formData.numWeeks} onChange={e => setFormData(p => ({ ...p, numWeeks: parseInt(e.target.value) || 1 }))} className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg outline-none font-bold" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-[9px] font-bold text-slate-400 uppercase">Start Date</p>
                    <input type="date" value={formData.startDate} onChange={e => setFormData(p => ({ ...p, startDate: e.target.value }))} className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg outline-none font-bold" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-[9px] font-bold text-slate-400 uppercase">Time</p>
                    <input type="time" value={formData.startTime} onChange={e => setFormData(p => ({ ...p, startTime: e.target.value }))} className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg outline-none font-bold" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-[9px] font-bold text-slate-400 uppercase">Duration</p>
                    <input type="text" value={formData.duration} onChange={e => setFormData(p => ({ ...p, duration: e.target.value }))} className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg outline-none font-bold" placeholder="1.5 hours" />
                  </div>
               </div>
               
               <div className="mt-4 flex flex-wrap gap-2">
                  {DAYS_OF_WEEK.map((day, idx) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(idx)}
                      className={`px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border ${formData.daysOfWeek.includes(idx) ? 'bg-black text-white border-black' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'}`}
                    >
                      {day.substr(0, 3)}
                    </button>
                  ))}
               </div>
            </div>

            <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Max Capacity</label>
                  <input type="number" min="1" value={formData.maxPersons} onChange={e => setFormData(p => ({ ...p, maxPersons: parseInt(e.target.value) || 1 }))} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none font-bold" />
               </div>
               <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Max Per Booking</label>
                  <input type="number" min="1" value={formData.maxPersonsPerBooking} onChange={e => setFormData(p => ({ ...p, maxPersonsPerBooking: parseInt(e.target.value) || 1 }))} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none font-bold" />
               </div>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-4">
               <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Pricing Structure ($)</label>
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[9px] font-bold text-slate-400 uppercase mb-2">Joining Amount</p>
                    <div className="flex items-center gap-2">
                       <DollarSign className="w-4 h-4 text-slate-400" />
                       <input type="number" min="0" value={formData.bookingAmount} onChange={e => setFormData(p => ({ ...p, bookingAmount: parseFloat(e.target.value) || 0 }))} className="bg-transparent outline-none font-black text-xl w-full" />
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[9px] font-bold text-slate-400 uppercase mb-2">Weekly Amount</p>
                    <div className="flex items-center gap-2">
                       <DollarSign className="w-4 h-4 text-slate-400" />
                       <input type="number" min="0" value={formData.weeklyAmount} onChange={e => setFormData(p => ({ ...p, weeklyAmount: parseFloat(e.target.value) || 0 }))} className="bg-transparent outline-none font-black text-xl w-full" />
                    </div>
                  </div>
               </div>
               <div className="p-6 bg-slate-900 rounded-[28px] text-white flex justify-between items-center shadow-xl shadow-slate-900/10">
                  <div>
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Total Block Valuation</p>
                    <p className="text-2xl font-black">${totalAmount.toFixed(2)}</p>
                  </div>
                  <Check className="w-8 h-8 text-blue-500 opacity-20" />
               </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 pt-10 sticky bottom-0 bg-white/80 backdrop-blur-md pb-4">
              <button type="button" onClick={onClose} className="flex-1 py-4 border-2 border-slate-100 rounded-2xl font-bold text-slate-400 hover:bg-slate-50 transition-colors uppercase text-sm">Discard</button>
              <button type="submit" className="flex-1 py-4 bg-black text-white rounded-2xl font-black shadow-2xl hover:bg-slate-800 transition-all uppercase text-sm">Save Block</button>
            </div>
          </form>
        </div>
      </div>

      {isConfirmingSave && (
        <ConfirmationModal
          title="Publish Block?"
          message={`Confirm all details and publish "${formData.name}". This will be visible to all members at ${facilities.find(f => f.id === formData.facilityId)?.name}.`}
          confirmText="Yes, Publish"
          onConfirm={finalSave}
          onCancel={() => setIsConfirmingSave(false)}
        />
      )}
    </>
  );
};

export default BlockFormModal;

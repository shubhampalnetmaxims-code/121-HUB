import React, { useState, useRef } from 'react';
import { X, CreditCard, Clock, Calendar, DollarSign, Info, Check, Plus, Bold, Italic, List } from 'lucide-react';
import { Facility, Membership } from '../../types';
import ConfirmationModal from './ConfirmationModal';

interface MembershipFormModalProps {
  membership: Membership | null;
  facilities: Facility[];
  initialFacilityId: string;
  onClose: () => void;
  onSave: (data: any) => void;
}

const MembershipFormModal: React.FC<MembershipFormModalProps> = ({ membership, facilities, initialFacilityId, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    facilityId: membership?.facilityId || initialFacilityId,
    title: membership?.title || '',
    description: membership?.description || '',
    price: membership?.price || 0,
    durationDays: membership?.durationDays || 30,
    allow24Hour: membership?.allow24Hour ?? true,
    startTime: membership?.startTime || '09:00',
    endTime: membership?.endTime || '18:00',
    daysAccess: membership?.daysAccess || 'all',
    status: membership?.status || 'active'
  });
  
  const [customDuration, setCustomDuration] = useState(false);
  const [isConfirmingSave, setIsConfirmingSave] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsConfirmingSave(true);
  };

  const finalSave = () => {
    onSave({
      ...formData,
      description: editorRef.current?.innerHTML || formData.description
    });
    setIsConfirmingSave(false);
  };

  const execCommand = (command: string) => {
    document.execCommand(command, false, '');
  };

  const durationOptions = [7, 15, 30, 60, 90];

  return (
    <>
      <div className="fixed inset-0 z-[160] overflow-hidden flex items-center justify-end">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>
        <div className="relative h-full w-full max-w-xl bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 text-left border-l border-slate-200">
          <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
            <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight uppercase">{membership ? 'Edit Plan' : 'New Membership'}</h3>
            <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-2xl transition-colors"><X className="w-6 h-6" /></button>
          </div>
          
          <form onSubmit={handleFormSubmit} className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto pb-32 scrollbar-hide">
            
            <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100">
              <label className="block text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">Host Facility</label>
              <select required value={formData.facilityId} onChange={e => setFormData(p => ({ ...p, facilityId: e.target.value }))} className="w-full px-4 py-3 bg-white border border-blue-100 rounded-xl outline-none font-bold text-sm">
                <option value="">Select Facility...</option>
                {facilities.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Plan Title</label>
              <input required value={formData.title} onChange={e => setFormData(p => ({ ...p, title: e.target.value }))} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-black text-lg" placeholder="e.g. Platinum Access" />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Description</label>
              <div className="border border-slate-200 rounded-[28px] overflow-hidden bg-slate-50">
                <div className="flex items-center gap-1 p-2 bg-white border-b border-slate-200">
                  <button type="button" onClick={() => execCommand('bold')} className="p-2 hover:bg-slate-50 rounded-lg"><Bold className="w-4 h-4 text-slate-600" /></button>
                  <button type="button" onClick={() => execCommand('italic')} className="p-2 hover:bg-slate-50 rounded-lg"><Italic className="w-4 h-4 text-slate-600" /></button>
                  <button type="button" onClick={() => execCommand('insertUnorderedList')} className="p-2 hover:bg-slate-50 rounded-lg"><List className="w-4 h-4 text-slate-600" /></button>
                </div>
                <div
                  ref={editorRef}
                  contentEditable
                  className="w-full min-h-[120px] p-6 outline-none text-slate-700 text-sm font-medium bg-white"
                  dangerouslySetInnerHTML={{ __html: formData.description }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
               <div className="space-y-4">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Time Access</label>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                     <span className="text-xs font-bold text-slate-700">24-Hour Access</span>
                     <input type="checkbox" checked={formData.allow24Hour} onChange={e => setFormData(p => ({ ...p, allow24Hour: e.target.checked }))} className="w-5 h-5 accent-blue-600" />
                  </div>
                  {!formData.allow24Hour && (
                    <div className="grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Start</p>
                        <input type="time" value={formData.startTime} onChange={e => setFormData(p => ({ ...p, startTime: e.target.value }))} className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl outline-none font-bold text-xs" />
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase mb-1">End</p>
                        <input type="time" value={formData.endTime} onChange={e => setFormData(p => ({ ...p, endTime: e.target.value }))} className="w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl outline-none font-bold text-xs" />
                      </div>
                    </div>
                  )}
               </div>

               <div className="space-y-4">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Days Reach</label>
                  <div className="grid grid-cols-1 gap-2">
                    <button type="button" onClick={() => setFormData(p => ({ ...p, daysAccess: 'all' }))} className={`px-4 py-3 rounded-2xl border-2 text-xs font-black uppercase transition-all ${formData.daysAccess === 'all' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-50 bg-slate-50 text-slate-400'}`}>All Days</button>
                    <button type="button" onClick={() => setFormData(p => ({ ...p, daysAccess: 'weekdays' }))} className={`px-4 py-3 rounded-2xl border-2 text-xs font-black uppercase transition-all ${formData.daysAccess === 'weekdays' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-50 bg-slate-50 text-slate-400'}`}>Monday - Friday</button>
                  </div>
               </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
               <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Plan Duration (Days)</label>
               <div className="flex flex-wrap gap-2">
                  {durationOptions.map(opt => (
                    <button 
                      key={opt} 
                      type="button"
                      onClick={() => { setFormData(p => ({ ...p, durationDays: opt })); setCustomDuration(false); }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${formData.durationDays === opt && !customDuration ? 'bg-black text-white border-black' : 'bg-white text-slate-400 border-slate-100'}`}
                    >
                      {opt}d
                    </button>
                  ))}
                  <button 
                    type="button"
                    onClick={() => setCustomDuration(true)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${customDuration ? 'bg-black text-white border-black' : 'bg-white text-slate-400 border-slate-100'}`}
                  >
                    Custom
                  </button>
               </div>
               {customDuration && (
                 <input type="number" min="1" value={formData.durationDays} onChange={e => setFormData(p => ({ ...p, durationDays: parseInt(e.target.value) || 1 }))} className="mt-3 w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none font-bold animate-in fade-in duration-300" placeholder="Number of days" />
               )}
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-4">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Pricing Matrix ($)</label>
              <div className="p-6 bg-slate-900 rounded-[32px] text-white flex justify-between items-center shadow-xl shadow-slate-900/10">
                <div className="flex-1">
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Total Amount</p>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-6 h-6 text-blue-500" />
                    <input type="number" step="0.01" value={formData.price} onChange={e => setFormData(p => ({ ...p, price: parseFloat(e.target.value) || 0 }))} className="bg-transparent outline-none font-black text-4xl w-full tracking-tighter" />
                  </div>
                </div>
                <CreditCard className="w-10 h-10 text-white/10" />
              </div>
            </div>

            <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[32px] border border-slate-100">
              <div>
                <p className="font-bold text-slate-900 text-sm">Plan Visibility</p>
                <p className="text-[10px] text-slate-500 uppercase font-black">Publish to mobile application</p>
              </div>
              <input type="checkbox" checked={formData.status === 'active'} onChange={e => setFormData(p => ({ ...p, status: e.target.checked ? 'active' : 'inactive' }))} className="w-6 h-6 accent-blue-600 rounded-lg cursor-pointer" />
            </div>

            <div className="flex flex-col md:flex-row gap-4 pt-10 sticky bottom-0 bg-white/80 backdrop-blur-md pb-4">
              <button type="button" onClick={onClose} className="flex-1 py-4 border-2 border-slate-100 rounded-2xl font-bold text-slate-400 hover:bg-slate-50 transition-colors text-sm uppercase">Discard</button>
              <button type="submit" className="flex-1 py-4 bg-black text-white rounded-2xl font-black shadow-2xl hover:bg-slate-800 transition-all text-sm uppercase">Create Plan</button>
            </div>
          </form>
        </div>
      </div>

      {isConfirmingSave && (
        <ConfirmationModal
          title="Publish Membership?"
          message={`Are you sure you want to save the "${formData.title}" plan for users?`}
          confirmText="Confirm Save"
          onConfirm={finalSave}
          onCancel={() => setIsConfirmingSave(false)}
        />
      )}
    </>
  );
};

export default MembershipFormModal;
import React, { useState } from 'react';
import { X, DollarSign, Ticket, Users, Layers, Info, Check, Search } from 'lucide-react';
import { Facility, Pass, Class } from '../../types';
import ConfirmationModal from './ConfirmationModal';

interface PassFormModalProps {
  pass: Pass | null;
  facilities: Facility[];
  classes: Class[];
  initialFacilityId: string;
  onClose: () => void;
  onSave: (data: any) => void;
}

const PassFormModal: React.FC<PassFormModalProps> = ({ pass, facilities, classes, initialFacilityId, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    facilityId: pass?.facilityId || initialFacilityId,
    name: pass?.name || '',
    price: pass?.price || 0,
    credits: pass?.credits || 1,
    personsPerBooking: pass?.personsPerBooking || 1,
    allowedClassIds: pass?.allowedClassIds || [] as string[],
    isAllClasses: pass?.isAllClasses ?? true,
    description: pass?.description || '',
    quantity: pass?.quantity || 100,
    status: pass?.status || 'active'
  });
  
  const [searchClass, setSearchClass] = useState('');
  const [isConfirmingSave, setIsConfirmingSave] = useState(false);

  const filteredClasses = classes.filter(c => c.facilityId === formData.facilityId && c.name.toLowerCase().includes(searchClass.toLowerCase()));

  const toggleClassSelection = (id: string) => {
    setFormData(prev => {
      const exists = prev.allowedClassIds.includes(id);
      if (exists) return { ...prev, allowedClassIds: prev.allowedClassIds.filter(cid => cid !== id) };
      return { ...prev, allowedClassIds: [...prev.allowedClassIds, id] };
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsConfirmingSave(true);
  };

  const finalSave = () => {
    onSave(formData);
    setIsConfirmingSave(false);
  };

  return (
    <>
      <div className="fixed inset-0 z-[160] overflow-hidden flex items-center justify-end">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>
        <div className="relative h-full w-full max-w-xl bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
          <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
            <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">{pass ? 'Edit Pass' : 'New Pass'}</h3>
            <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-2xl transition-colors"><X className="w-6 h-6" /></button>
          </div>
          <form onSubmit={handleFormSubmit} className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto text-left pb-32 scrollbar-hide">
            
            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Host Facility</label>
              <select required value={formData.facilityId} onChange={e => setFormData(p => ({ ...p, facilityId: e.target.value, allowedClassIds: [] }))} className="w-full px-6 py-4 bg-white border border-slate-100 rounded-2xl outline-none font-bold text-slate-900">
                <option value="">Select Facility...</option>
                {facilities.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Pass Name</label>
              <input required value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold" placeholder="e.g. 10-Session Fitness Pass" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Pass Price ($)</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input required type="number" min="0" value={formData.price} onChange={e => setFormData(p => ({ ...p, price: parseFloat(e.target.value) || 0 }))} className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Total Credits</label>
                <div className="relative">
                  <Layers className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input required type="number" min="1" value={formData.credits} onChange={e => setFormData(p => ({ ...p, credits: parseInt(e.target.value) || 1 }))} className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Persons per Booking</label>
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input required type="number" min="1" value={formData.personsPerBooking} onChange={e => setFormData(p => ({ ...p, personsPerBooking: parseInt(e.target.value) || 1 }))} className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Stock Quantity</label>
                <input required type="number" min="0" value={formData.quantity} onChange={e => setFormData(p => ({ ...p, quantity: parseInt(e.target.value) || 0 }))} className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                 <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Applicable Classes</label>
                 <div className="flex items-center gap-2">
                   <span className="text-[10px] font-bold text-slate-400 uppercase">Allow for All</span>
                   <input type="checkbox" checked={formData.isAllClasses} onChange={e => setFormData(p => ({ ...p, isAllClasses: e.target.checked, allowedClassIds: [] }))} className="w-5 h-5 accent-blue-600 rounded-lg cursor-pointer" />
                 </div>
              </div>

              {!formData.isAllClasses && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" placeholder="Filter classes..." value={searchClass} onChange={e => setSearchClass(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto scrollbar-hide">
                    {filteredClasses.map(c => {
                      const isSelected = formData.allowedClassIds.includes(c.id);
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => toggleClassSelection(c.id)}
                          className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all text-left ${isSelected ? 'border-blue-600 bg-blue-50' : 'border-slate-50 bg-white'}`}
                        >
                          <span className={`text-[10px] font-bold ${isSelected ? 'text-blue-900' : 'text-slate-500'}`}>{c.name}</span>
                          {isSelected && <Check className="w-3 h-3 text-blue-600" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Pass Description</label>
              <textarea required value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none min-h-[100px] text-sm leading-relaxed" placeholder="Details about pass benefits and rules..." />
            </div>

            <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100">
              <div>
                <p className="font-bold text-slate-900 text-sm">Pass Status</p>
                <p className="text-[10px] text-slate-500 uppercase font-black">Active passes are visible to users</p>
              </div>
              <input type="checkbox" checked={formData.status === 'active'} onChange={e => setFormData(p => ({ ...p, status: e.target.checked ? 'active' : 'inactive' }))} className="w-6 h-6 accent-blue-600 rounded-lg cursor-pointer" />
            </div>

            <div className="flex flex-col md:flex-row gap-4 pt-10 sticky bottom-0 bg-white/80 backdrop-blur-md pb-4">
              <button type="button" onClick={onClose} className="flex-1 py-4 border-2 border-slate-100 rounded-2xl font-bold text-slate-400 hover:bg-slate-50 transition-colors">Discard</button>
              <button type="submit" className="flex-1 py-4 bg-black text-white rounded-2xl font-extrabold shadow-2xl hover:bg-slate-800 transition-all">Publish Pass</button>
            </div>
          </form>
        </div>
      </div>

      {isConfirmingSave && (
        <ConfirmationModal
          title="Save Pass?"
          message={`Are you sure you want to save "${formData.name}" for this facility?`}
          confirmText="Confirm Save"
          onConfirm={finalSave}
          onCancel={() => setIsConfirmingSave(false)}
        />
      )}
    </>
  );
};

export default PassFormModal;

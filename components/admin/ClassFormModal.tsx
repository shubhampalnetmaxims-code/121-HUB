
import React, { useState, useRef } from 'react';
import { X, Clock, Package, Signal } from 'lucide-react';
import { Facility, Class, CLASS_LEVELS } from '../../types';

interface ClassFormModalProps {
  editingClass: Class | null;
  facilities: Facility[];
  initialFacilityId?: string;
  onClose: () => void;
  onSave: (data: any) => void;
}

const ClassFormModal: React.FC<ClassFormModalProps> = ({ editingClass, facilities, initialFacilityId, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    facilityId: editingClass?.facilityId || initialFacilityId || '',
    name: editingClass?.name || '',
    shortDescription: editingClass?.shortDescription || '',
    duration: editingClass?.duration || '',
    requirements: editingClass?.requirements || '',
    level: editingClass?.level || 'All Levels',
    imageUrl: editingClass?.imageUrl || ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-[160] overflow-hidden flex items-center justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>
      <div className="relative h-full w-full max-w-xl bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
        <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">{editingClass ? 'Update Session' : 'Create Class'}</h3>
          <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-2xl transition-colors"><X className="w-6 h-6" /></button>
        </div>
        <form onSubmit={(e) => {
          e.preventDefault();
          onSave(formData);
        }} className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto text-left pb-32 scrollbar-hide">
          <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100">
            <label className="block text-xs font-black text-blue-600 uppercase tracking-widest mb-3">Host Facility</label>
            <select required value={formData.facilityId} onChange={e => setFormData(p => ({ ...p, facilityId: e.target.value }))} className="w-full px-6 py-4 bg-white border border-blue-100 rounded-2xl outline-none focus:ring-4 focus:ring-blue-600/10 font-bold text-slate-900">
              <option value="">Choose location...</option>
              {facilities.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Class Title</label>
            <input required value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold" placeholder="e.g. Power Lifting" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Class Level</label>
              <div className="relative">
                <Signal className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select 
                  required 
                  value={formData.level} 
                  onChange={e => setFormData(p => ({ ...p, level: e.target.value }))} 
                  className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold appearance-none"
                >
                  {CLASS_LEVELS.map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Thumbnail</label>
              <div onClick={() => fileInputRef.current?.click()} className="h-[56px] bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center cursor-pointer overflow-hidden text-[10px] font-black uppercase text-slate-400 hover:bg-slate-100 transition-colors">
                {formData.imageUrl ? "✓ Image Attached" : "Upload Thumbnail"}
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Duration</label>
            <div className="relative">
              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input required value={formData.duration} onChange={e => setFormData(p => ({ ...p, duration: e.target.value }))} className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold" placeholder="e.g. 1 hour" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Quick Intro</label>
            <textarea required value={formData.shortDescription} onChange={e => setFormData(p => ({ ...p, shortDescription: e.target.value }))} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none min-h-[100px] text-sm leading-relaxed" placeholder="Briefly describe the session..." />
          </div>
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Member Checklist</label>
            <div className="relative">
               <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
               <input required value={formData.requirements} onChange={e => setFormData(p => ({ ...p, requirements: e.target.value }))} className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold" placeholder="e.g. Sweat towel" />
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4 pt-10 sticky bottom-0 bg-white/80 backdrop-blur-md pb-4">
            <button type="button" onClick={onClose} className="flex-1 py-4 border-2 border-slate-100 rounded-2xl font-bold text-slate-400 hover:bg-slate-50 transition-colors">Discard</button>
            <button type="submit" className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-extrabold shadow-2xl shadow-blue-600/20 hover:bg-blue-700 transition-all">Publish Class</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClassFormModal;

import React, { useState, useRef } from 'react';
import { X, Bold, Italic, List, CloudUpload, User, Mail, Phone, Check, ShieldCheck, RefreshCw, XCircle, Share2 } from 'lucide-react';
import { Facility, Trainer } from '../../types';
import ConfirmationModal from './ConfirmationModal';

interface TrainerFormModalProps {
  trainer: Trainer | null;
  facilities: Facility[];
  onClose: () => void;
  onSave: (data: any) => void;
}

const TrainerFormModal: React.FC<TrainerFormModalProps> = ({ trainer, facilities, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    facilityIds: trainer?.facilityIds || [],
    name: trainer?.name || '',
    email: trainer?.email || '',
    phone: trainer?.phone || '',
    profilePicture: trainer?.profilePicture || '',
    description: trainer?.description || '',
    colorCode: trainer?.colorCode || '#2563eb',
    permissions: trainer?.permissions || {
      canCancel: true,
      canReschedule: false,
      canTransfer: false
    }
  });
  const [isConfirmingSave, setIsConfirmingSave] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData(prev => ({ ...prev, profilePicture: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const toggleFacility = (id: string) => {
    setFormData(prev => {
      const exists = prev.facilityIds.includes(id);
      if (exists) {
        return { ...prev, facilityIds: prev.facilityIds.filter(fid => fid !== id) };
      } else {
        return { ...prev, facilityIds: [...prev.facilityIds, id] };
      }
    });
  };

  const execCommand = (command: string) => {
    document.execCommand(command, false);
    if (editorRef.current) setFormData(prev => ({ ...prev, description: editorRef.current!.innerHTML }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsConfirmingSave(true);
  };

  const finalSave = () => {
    onSave({ ...formData, description: editorRef.current?.innerHTML || formData.description });
    setIsConfirmingSave(false);
  };

  return (
    <>
      <div className="fixed inset-0 z-[160] overflow-hidden flex items-center justify-end">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>
        <div className="relative h-full w-full max-w-xl bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
          <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
            <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight uppercase">{trainer ? 'Edit Trainer' : 'Add Trainer'}</h3>
            <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-2xl transition-colors"><X className="w-6 h-6" /></button>
          </div>
          <form onSubmit={handleFormSubmit} className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto text-left pb-32 scrollbar-hide">
            
            <div className="space-y-3">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Assign to Facilities</label>
              <div className="grid grid-cols-2 gap-3">
                {facilities.map(f => {
                  const isSelected = formData.facilityIds.includes(f.id);
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => toggleFacility(f.id)}
                      className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all text-left ${
                        isSelected ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'
                      }`}
                    >
                      <span className="font-bold text-sm">{f.name}</span>
                      {isSelected && <Check className="w-4 h-4" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Permissions</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                 <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                    <div className="flex items-center gap-3">
                       <XCircle className="w-4 h-4 text-slate-400" />
                       <span className="text-sm font-bold text-slate-700">Cancel classes</span>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={formData.permissions.canCancel} 
                      onChange={e => setFormData(prev => ({ ...prev, permissions: { ...prev.permissions, canCancel: e.target.checked } }))}
                      className="w-6 h-6 accent-blue-600 rounded-lg cursor-pointer"
                    />
                 </div>
                 <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                    <div className="flex items-center gap-3">
                       <RefreshCw className="w-4 h-4 text-slate-400" />
                       <span className="text-sm font-bold text-slate-700">Reschedule classes</span>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={formData.permissions.canReschedule} 
                      onChange={e => setFormData(prev => ({ ...prev, permissions: { ...prev.permissions, canReschedule: e.target.checked } }))}
                      className="w-6 h-6 accent-blue-600 rounded-lg cursor-pointer"
                    />
                 </div>
                 <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                    <div className="flex items-center gap-3">
                       <Share2 className="w-4 h-4 text-slate-400" />
                       <span className="text-sm font-bold text-slate-700">Transfer classes</span>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={formData.permissions.canTransfer} 
                      onChange={e => setFormData(prev => ({ ...prev, permissions: { ...prev.permissions, canTransfer: e.target.checked } }))}
                      className="w-6 h-6 accent-blue-600 rounded-lg cursor-pointer"
                    />
                 </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 pt-4 border-t border-slate-100">
              <div className="flex-1 space-y-6">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input required value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold" placeholder="e.g. Rahul Sharma" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Institutional Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input required type="email" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold" placeholder="rahul@121.com" />
                  </div>
                </div>
              </div>
              <div className="w-full md:w-32 flex flex-col items-center gap-3">
                 <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Avatar</label>
                 <div onClick={() => fileInputRef.current?.click()} className="w-24 h-24 rounded-3xl bg-slate-100 border-2 border-dashed border-slate-200 flex items-center justify-center cursor-pointer overflow-hidden group hover:border-blue-500 transition-all">
                   {formData.profilePicture ? (
                     <img src={formData.profilePicture} className="w-full h-full object-cover group-hover:opacity-60" />
                   ) : (
                     <CloudUpload className="text-slate-300 w-8 h-8" />
                   )}
                   <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                 </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input required value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold" placeholder="+1..." />
                </div>
              </div>
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Identity Color</label>
                <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5">
                  <input type="color" value={formData.colorCode} onChange={e => setFormData(p => ({ ...p, colorCode: e.target.value }))} className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-none" />
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{formData.colorCode}</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Initial Bio (Admin View)</label>
              <div className="border border-slate-200 rounded-[28px] overflow-hidden bg-slate-50">
                <div className="flex items-center gap-1 p-3 bg-white border-b border-slate-200">
                  <button type="button" onClick={() => execCommand('bold')} className="p-2.5 hover:bg-slate-50 rounded-xl transition-colors"><Bold className="w-4 h-4" /></button>
                  <button type="button" onClick={() => execCommand('italic')} className="p-2.5 hover:bg-slate-50 rounded-xl transition-colors"><Italic className="w-4 h-4" /></button>
                  <button type="button" onClick={() => execCommand('insertUnorderedList')} className="p-2.5 hover:bg-slate-50 rounded-xl transition-colors"><List className="w-4 h-4" /></button>
                </div>
                <div
                  ref={editorRef}
                  contentEditable
                  className="w-full min-h-[150px] p-6 outline-none text-slate-700 text-sm bg-white"
                  dangerouslySetInnerHTML={{ __html: formData.description }}
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 pt-10 sticky bottom-0 bg-white/80 backdrop-blur-md pb-4">
              <button type="button" onClick={onClose} className="flex-1 py-4 border-2 border-slate-100 rounded-2xl font-bold text-slate-400 hover:bg-slate-50 transition-colors">Discard</button>
              <button type="submit" disabled={formData.facilityIds.length === 0} className="flex-1 py-4 bg-black text-white rounded-2xl font-extrabold shadow-2xl shadow-black/20 hover:bg-slate-800 transition-all disabled:opacity-50">Enroll Trainer</button>
            </div>
          </form>
        </div>
      </div>

      {isConfirmingSave && (
        <ConfirmationModal
          title="Save Trainer Profile?"
          message={`Are you sure you want to enroll "${formData.name}"? They will receive an email to set their password.`}
          confirmText="Yes, Save"
          onConfirm={finalSave}
          onCancel={() => setIsConfirmingSave(false)}
        />
      )}
    </>
  );
};

export default TrainerFormModal;
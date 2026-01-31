
import React, { useState, useRef } from 'react';
import { X, Bold, Italic, List, CloudUpload } from 'lucide-react';
import { Facility } from '../../types';
import ConfirmationModal from './ConfirmationModal';

interface FacilityFormModalProps {
  facility: Facility | null;
  onClose: () => void;
  onSave: (data: any) => void;
}

const FacilityFormModal: React.FC<FacilityFormModalProps> = ({ facility, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: facility?.name || '',
    description: facility?.description || '',
    icon: facility?.icon || 'Activity',
    imageUrl: facility?.imageUrl || '',
    isActive: facility ? facility.isActive : true
  });
  const [isConfirmingSave, setIsConfirmingSave] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const execCommand = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
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
        <div className="relative h-full w-full max-w-xl bg-white shadow-xl flex flex-col animate-in slide-in-from-right duration-300 border-l border-slate-200">
          <div className="p-6 md:p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight uppercase">{facility ? 'Edit Profile' : 'New Location'}</h3>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-md transition-colors"><X className="w-5 h-5" /></button>
          </div>
          <form onSubmit={handleFormSubmit} className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto text-left pb-24 scrollbar-hide">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Location Title</label>
              <input required value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-md outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all font-bold text-lg" placeholder="e.g. 121 Wellness Hub" />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Facility Media</label>
              <div onClick={() => fileInputRef.current?.click()} className="aspect-video bg-slate-50 border border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center cursor-pointer overflow-hidden relative group hover:border-blue-500 transition-colors shadow-inner">
                {formData.imageUrl ? (
                  <img src={formData.imageUrl} className="w-full h-full object-cover group-hover:opacity-60 transition-opacity" />
                ) : (
                  <div className="text-center p-6"><CloudUpload className="mx-auto mb-3 text-slate-300 w-10 h-10" /><p className="text-[10px] font-bold text-slate-400 uppercase">Upload Cover Photo</p></div>
                )}
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">About Facility</label>
              </div>
              <div className="border border-slate-200 rounded-md overflow-hidden bg-slate-50">
                <div className="flex items-center gap-1 p-2 bg-white border-b border-slate-200">
                  <button type="button" onClick={() => execCommand('bold')} className="p-2 hover:bg-slate-100 rounded-md transition-colors"><Bold className="w-3.5 h-3.5" /></button>
                  <button type="button" onClick={() => execCommand('italic')} className="p-2 hover:bg-slate-100 rounded-md transition-colors"><Italic className="w-3.5 h-3.5" /></button>
                  <button type="button" onClick={() => execCommand('insertUnorderedList')} className="p-2 hover:bg-slate-100 rounded-md transition-colors"><List className="w-3.5 h-3.5" /></button>
                </div>
                <div
                  ref={editorRef}
                  contentEditable
                  className="w-full min-h-[180px] p-6 outline-none prose prose-blue max-w-none text-slate-700 text-sm bg-white"
                  onBlur={() => setFormData(prev => ({ ...prev, description: editorRef.current?.innerHTML || '' }))}
                  dangerouslySetInnerHTML={{ __html: formData.description }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-6 bg-slate-50 rounded-lg border border-slate-200">
              <div>
                <p className="font-bold text-slate-900 text-sm">Facility Visibility</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Control public visibility in the User App.</p>
              </div>
              <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))} className="w-5 h-5 accent-blue-600 rounded-sm" />
            </div>

            <div className="flex flex-col md:flex-row gap-3 pt-10 sticky bottom-0 bg-white/90 backdrop-blur-sm pb-4">
              <button type="button" onClick={onClose} className="flex-1 py-3 border border-slate-200 rounded-md font-bold text-slate-400 hover:bg-slate-50 transition-colors text-sm uppercase">Discard</button>
              <button type="submit" className="flex-1 py-3 bg-slate-900 text-white rounded-md font-bold shadow-md hover:bg-black transition-all text-sm uppercase">Save Changes</button>
            </div>
          </form>
        </div>
      </div>

      {isConfirmingSave && (
        <ConfirmationModal
          title="Save Changes?"
          message={`Are you sure you want to save the changes for "${formData.name}"?`}
          confirmText="Confirm Save"
          onConfirm={finalSave}
          onCancel={() => setIsConfirmingSave(false)}
        />
      )}
    </>
  );
};

export default FacilityFormModal;
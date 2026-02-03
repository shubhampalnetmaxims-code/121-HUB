import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Camera, Plus, Calendar, Trash2, X, Check, Image as ImageIcon } from 'lucide-react';
import { User, PhotoLog } from '../../types';
import { useToast } from '../ToastContext';

interface PhotoLogViewProps {
  currentUser: User | null;
  photoLogs: PhotoLog[];
  onAddPhotoLog: (p: Omit<PhotoLog, 'id'>) => void;
  onDeletePhotoLog: (id: string) => void;
  onAuthTrigger: () => void;
}

const PhotoLogView: React.FC<PhotoLogViewProps> = ({ currentUser, photoLogs, onAddPhotoLog, onDeletePhotoLog, onAuthTrigger }) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoLog | null>(null);
  
  const [formData, setFormData] = useState({
    imageUrl: '',
    note: '',
    date: new Date().toISOString().split('T')[0]
  });

  if (!currentUser) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-10 text-center bg-white">
        <div className="w-20 h-20 bg-slate-100 rounded-[32px] flex items-center justify-center text-slate-300 mb-6">
          <Camera className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2 uppercase">Photo Logs</h2>
        <p className="text-slate-500 font-medium text-sm leading-relaxed mb-8">Visual progress is powerful. Sign in to keep a private photo log of your journey.</p>
        <button onClick={onAuthTrigger} className="w-full py-5 bg-black text-white rounded-[28px] font-black text-lg shadow-2xl active:scale-95 transition-all uppercase">Authenticate</button>
      </div>
    );
  }

  const userPhotos = photoLogs.filter(p => p.userId === currentUser.id).sort((a, b) => b.date - a.date);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData(p => ({ ...p, imageUrl: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!formData.imageUrl) return;
    onAddPhotoLog({
      userId: currentUser.id,
      imageUrl: formData.imageUrl,
      note: formData.note,
      date: new Date(formData.date).getTime()
    });
    setFormData({ imageUrl: '', note: '', date: new Date().toISOString().split('T')[0] });
    setIsAdding(false);
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden text-left relative">
      <div className="bg-white p-6 pt-12 border-b border-slate-100 shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/app/activity')} className="p-2 hover:bg-slate-100 rounded-xl"><ChevronLeft className="w-5 h-5" /></button>
          <div className="text-left">
            <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase">Transformation</h2>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Photo Log</p>
          </div>
        </div>
        <button onClick={() => setIsAdding(true)} className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg active:scale-90 transition-all"><Plus className="w-5 h-5" /></button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 scrollbar-hide pb-32">
        {userPhotos.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
             {userPhotos.map(photo => (
               <button 
                key={photo.id} 
                onClick={() => setSelectedPhoto(photo)}
                className="aspect-[3/4] bg-white rounded-3xl border border-slate-100 overflow-hidden relative group shadow-sm active:scale-95 transition-all"
               >
                 <img src={photo.imageUrl} className="w-full h-full object-cover" alt="" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                 <div className="absolute bottom-4 left-4 text-white text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                    {new Date(photo.date).toLocaleDateString()}
                 </div>
               </button>
             ))}
          </div>
        ) : (
          <div className="py-24 text-center space-y-6">
             <div className="w-20 h-20 bg-white rounded-[40px] flex items-center justify-center mx-auto border border-slate-100 text-slate-200">
                <ImageIcon className="w-8 h-8" />
             </div>
             <p className="text-lg font-bold text-slate-400">Empty gallery</p>
             <button onClick={() => setIsAdding(true)} className="px-10 py-4 bg-slate-900 text-white rounded-[24px] font-black text-sm uppercase shadow-xl active:scale-95 transition-all">Add Photo</button>
          </div>
        )}
      </div>

      {isAdding && (
        <div className="absolute inset-0 z-[110] bg-white flex flex-col animate-in slide-in-from-bottom duration-500 overflow-hidden text-left">
           <div className="bg-slate-50/50 p-6 pt-12 border-b border-slate-100 flex items-center justify-between shrink-0">
             <h3 className="text-xl font-bold tracking-tight uppercase">New Log Entry</h3>
             <button onClick={() => setIsAdding(false)} className="p-3 hover:bg-slate-100 rounded-2xl transition-colors shrink-0"><X className="w-6 h-6" /></button>
           </div>
           <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-32 scrollbar-hide">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="aspect-[3/4] bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer overflow-hidden relative group hover:border-blue-500 transition-colors"
              >
                 {formData.imageUrl ? (
                    <img src={formData.imageUrl} className="w-full h-full object-cover" />
                 ) : (
                    <div className="text-center p-10"><Camera className="w-12 h-12 text-slate-300 mx-auto mb-4" /><p className="text-xs font-black text-slate-400 uppercase tracking-widest">Capture or Upload</p></div>
                 )}
                 <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
              </div>
              <div className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Log Date</label>
                    <input type="date" value={formData.date} onChange={e => setFormData(p => ({...p, date: e.target.value}))} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Optional Note</label>
                    <textarea value={formData.note} onChange={e => setFormData(p => ({...p, note: e.target.value}))} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-medium text-sm outline-none h-24" placeholder="How are you feeling today?" />
                 </div>
              </div>
           </div>
           <div className="p-6 pt-2 pb-12 border-t border-slate-50 bg-white/95 backdrop-blur-md absolute bottom-0 left-0 right-0">
             <button onClick={handleSave} disabled={!formData.imageUrl} className="w-full py-5 bg-black text-white rounded-[28px] font-black text-xl shadow-2xl active:scale-95 transition-all uppercase disabled:opacity-50">Log Transformation</button>
           </div>
        </div>
      )}

      {selectedPhoto && (
        <div className="absolute inset-0 z-[120] bg-black/95 flex flex-col animate-in fade-in duration-300 overflow-hidden text-left">
           <div className="p-6 pt-12 flex items-center justify-between shrink-0">
              <div className="text-white">
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-1">Entry Date</p>
                 <p className="font-bold text-lg">{new Date(selectedPhoto.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
              <button onClick={() => setSelectedPhoto(null)} className="p-3 bg-white/10 text-white rounded-2xl backdrop-blur-md"><X className="w-6 h-6" /></button>
           </div>
           <div className="flex-1 flex items-center justify-center p-4">
              <img src={selectedPhoto.imageUrl} className="max-w-full max-h-full rounded-[40px] shadow-2xl" />
           </div>
           {selectedPhoto.note && (
              <div className="p-10 text-center">
                 <p className="text-white/60 text-sm font-medium italic leading-relaxed">"{selectedPhoto.note}"</p>
              </div>
           )}
           <div className="p-10 pt-0 flex justify-center">
              <button onClick={() => { onDeletePhotoLog(selectedPhoto.id); setSelectedPhoto(null); }} className="flex items-center gap-2 text-red-500 font-black text-[10px] uppercase tracking-[0.2em] px-6 py-3 bg-red-500/10 rounded-xl"><Trash2 className="w-4 h-4" /> Delete Log</button>
           </div>
        </div>
      )}
    </div>
  );
};

export default PhotoLogView;
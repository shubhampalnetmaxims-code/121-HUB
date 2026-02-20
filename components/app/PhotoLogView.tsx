
import React, { useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Camera, Plus, Calendar, Trash2, X, Check, Image as ImageIcon, Sparkles, ArrowRight, MousePointer2 } from 'lucide-react';
import { User, PhotoLog } from '../../types';
import { useToast } from '../ToastContext';

interface PhotoLogViewProps {
  currentUser: User | null;
  photoLogs: PhotoLog[];
  onAddPhotoLog: (p: Omit<PhotoLog, 'id'>) => void;
  onDeletePhotoLog: (id: string) => void;
  onAuthTrigger: () => void;
}

const PhotoComparisonModal = ({ before, after, onClose }: { before: PhotoLog, after: PhotoLog, onClose: () => void }) => {
  const [sliderPos, setSliderPos] = useState(50);
  
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPos(parseInt(e.target.value));
  };

  return (
    <div className="absolute inset-0 z-[130] bg-black flex flex-col animate-in fade-in duration-300">
      <div className="p-6 pt-12 flex items-center justify-between shrink-0 bg-black/40 backdrop-blur-md relative z-10">
         <div className="text-white">
            <h3 className="text-xl font-black uppercase tracking-tighter">Transformation View</h3>
            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Before & After Slider</p>
         </div>
         <button onClick={onClose} className="p-3 bg-white/10 text-white rounded-2xl backdrop-blur-md"><X className="w-6 h-6" /></button>
      </div>

      <div className="flex-1 relative overflow-hidden flex items-center justify-center">
         {/* After Image (Background) */}
         <div className="absolute inset-0 w-full h-full">
            <img src={after.imageUrl} className="w-full h-full object-contain" alt="After" />
            <div className="absolute bottom-10 right-10 bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl text-white border border-white/10">
               <p className="text-[8px] font-black uppercase tracking-[0.2em] opacity-40">After</p>
               <p className="font-bold text-xs">{new Date(after.date).toLocaleDateString()}</p>
            </div>
         </div>

         {/* Before Image (Foreground with Clip) */}
         <div 
           className="absolute inset-0 w-full h-full select-none pointer-events-none"
           style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
         >
            <img src={before.imageUrl} className="w-full h-full object-contain" alt="Before" />
            <div className="absolute bottom-10 left-10 bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl text-white border border-white/10">
               <p className="text-[8px] font-black uppercase tracking-[0.2em] opacity-40">Before</p>
               <p className="font-bold text-xs">{new Date(before.date).toLocaleDateString()}</p>
            </div>
         </div>

         {/* Slider Line */}
         <div 
           className="absolute inset-y-0 w-1 bg-white/50 backdrop-blur-md z-20 pointer-events-none shadow-2xl"
           style={{ left: `${sliderPos}%` }}
         >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-2xl flex items-center justify-center">
               <div className="flex gap-1">
                  <div className="w-1 h-3 bg-slate-300 rounded-full" />
                  <div className="w-1 h-3 bg-slate-300 rounded-full" />
               </div>
            </div>
         </div>

         {/* Invisible Input for Control */}
         <input 
           type="range" 
           min="0" 
           max="100" 
           value={sliderPos} 
           onChange={handleSliderChange}
           className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
         />
      </div>

      <div className="p-10 bg-black/40 backdrop-blur-md shrink-0 text-center">
         <div className="flex items-center justify-center gap-3 text-white/40 mb-2">
            <MousePointer2 className="w-4 h-4" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em]">Drag to compare progress</p>
         </div>
      </div>
    </div>
  );
};

const PhotoLogView: React.FC<PhotoLogViewProps> = ({ currentUser, photoLogs, onAddPhotoLog, onDeletePhotoLog, onAuthTrigger }) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoLog | null>(null);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [comparisonSelection, setComparisonSelection] = useState<string[]>([]);
  const [showSlider, setShowSlider] = useState(false);
  
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

  const userPhotos = useMemo(() => 
    photoLogs.filter(p => p.userId === currentUser.id).sort((a, b) => b.date - a.date),
    [photoLogs, currentUser.id]
  );

  const toggleComparisonSelect = (id: string) => {
    setComparisonSelection(prev => {
      if (prev.includes(id)) return prev.filter(pid => pid !== id);
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });
  };

  const startComparison = () => {
    if (comparisonSelection.length !== 2) return;
    setShowSlider(true);
  };

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
    showToast('Progress image saved', 'success');
  };

  const comparePhotos = useMemo(() => {
    if (comparisonSelection.length !== 2) return null;
    const p1 = userPhotos.find(p => p.id === comparisonSelection[0])!;
    const p2 = userPhotos.find(p => p.id === comparisonSelection[1])!;
    return p1.date < p2.date ? { before: p1, after: p2 } : { before: p2, after: p1 };
  }, [comparisonSelection, userPhotos]);

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden text-left relative">
      <div className="bg-white p-6 pt-12 border-b border-slate-100 shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => comparisonMode ? setComparisonMode(false) : navigate('/app/activity')} className="p-2 hover:bg-slate-100 rounded-xl transition-all">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="text-left">
            <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase">Gallery</h2>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{comparisonMode ? 'Select 2 photos' : 'Visual Progress'}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {!comparisonMode && userPhotos.length >= 2 && (
            <button onClick={() => setComparisonMode(true)} className="p-3 bg-slate-900 text-white rounded-2xl shadow-lg active:scale-90 transition-all">
               <Sparkles className="w-5 h-5" />
            </button>
          )}
          {!comparisonMode && (
            <button onClick={() => setIsAdding(true)} className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg active:scale-90 transition-all">
               <Plus className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 scrollbar-hide pb-40">
        {userPhotos.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
             {userPhotos.map(photo => {
               const isSelected = comparisonSelection.includes(photo.id);
               return (
                <button 
                  key={photo.id} 
                  onClick={() => comparisonMode ? toggleComparisonSelect(photo.id) : setSelectedPhoto(photo)}
                  className={`aspect-[3/4] bg-white rounded-3xl border-4 overflow-hidden relative group active:scale-[0.98] transition-all ${
                    isSelected ? 'border-blue-600 ring-4 ring-blue-100' : 'border-white shadow-sm'
                  }`}
                >
                  <img src={photo.imageUrl} className="w-full h-full object-cover" alt="" />
                  {isSelected && (
                    <div className="absolute inset-0 bg-blue-600/20 flex items-center justify-center">
                       <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg">
                          <Check className="w-5 h-5" />
                       </div>
                    </div>
                  )}
                  <div className="absolute bottom-4 left-4 right-4 bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg text-white text-[8px] font-black uppercase tracking-widest text-center">
                      {new Date(photo.date).toLocaleDateString()}
                  </div>
                </button>
               );
             })}
          </div>
        ) : (
          <div className="py-24 text-center space-y-6">
             <div className="w-20 h-20 bg-white rounded-[40px] flex items-center justify-center mx-auto border border-slate-100 text-slate-200">
                <ImageIcon className="w-8 h-8" />
             </div>
             <p className="text-lg font-bold text-slate-400 uppercase tracking-widest">Zero Memories</p>
             <button onClick={() => setIsAdding(true)} className="px-10 py-4 bg-slate-900 text-white rounded-[24px] font-black text-sm uppercase shadow-xl active:scale-95 transition-all">Add First Photo</button>
          </div>
        )}
      </div>

      {/* Comparison Action Bar */}
      {comparisonMode && (
        <div className="p-6 pt-4 pb-12 border-t border-slate-100 bg-white/95 backdrop-blur-md absolute bottom-0 left-0 right-0 z-10 animate-in slide-in-from-bottom duration-300">
           <button 
             onClick={startComparison}
             disabled={comparisonSelection.length !== 2}
             className="w-full py-5 bg-blue-600 text-white rounded-[28px] font-black text-lg shadow-2xl active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
           >
             Compare Visuals <ArrowRight className="w-5 h-5" />
           </button>
        </div>
      )}

      {isAdding && (
        <div className="absolute inset-0 z-[110] bg-white flex flex-col animate-in slide-in-from-bottom duration-500 overflow-hidden text-left">
           <div className="bg-slate-50/50 p-6 pt-12 border-b border-slate-100 flex items-center justify-between shrink-0">
             <h3 className="text-xl font-bold tracking-tight uppercase">Add Log</h3>
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
                    <div className="text-center p-10"><Camera className="w-12 h-12 text-slate-300 mx-auto mb-4" /><p className="text-xs font-black text-slate-400 uppercase tracking-widest">Select Image</p></div>
                 )}
                 <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
              </div>
              <div className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Log Date</label>
                    <input type="date" value={formData.date} onChange={e => setFormData(p => ({...p, date: e.target.value}))} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none" />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Note (Optional)</label>
                    <textarea value={formData.note} onChange={e => setFormData(p => ({...p, note: e.target.value}))} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-medium text-sm outline-none h-24" placeholder="How was the workout?" />
                 </div>
              </div>
           </div>
           <div className="p-6 pt-2 pb-12 border-t border-slate-50 bg-white/95 backdrop-blur-md absolute bottom-0 left-0 right-0">
             <button onClick={handleSave} disabled={!formData.imageUrl} className="w-full py-5 bg-black text-white rounded-[28px] font-black text-xl shadow-2xl active:scale-95 transition-all uppercase disabled:opacity-50">Log Image</button>
           </div>
        </div>
      )}

      {selectedPhoto && !comparisonMode && (
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

      {showSlider && comparePhotos && (
        <PhotoComparisonModal 
          before={comparePhotos.before} 
          after={comparePhotos.after} 
          onClose={() => setShowSlider(false)} 
        />
      )}
    </div>
  );
};

export default PhotoLogView;

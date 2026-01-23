
import React from 'react';
import { X, ArrowLeft, Users } from 'lucide-react';
import { Trainer } from '../../types';

interface TrainerBioModalProps {
  trainer: Trainer;
  onClose: () => void;
}

const TrainerBioModal: React.FC<TrainerBioModalProps> = ({ trainer, onClose }) => {
  return (
    <div className="absolute inset-0 z-[70] bg-black/40 backdrop-blur-sm flex items-end animate-in fade-in duration-300">
      <div className="w-full bg-white rounded-t-[48px] overflow-hidden max-h-[90%] flex flex-col animate-in slide-in-from-bottom duration-500 shadow-2xl">
        {/* Profile Image Header - Reduced Height */}
        <div className="relative h-48 w-full bg-slate-100 shrink-0">
          <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-20">
             <button 
              onClick={onClose} 
              className="p-3 rounded-2xl bg-black/10 backdrop-blur hover:bg-black/20 text-white transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={onClose} 
              className="p-3 rounded-2xl bg-black/10 backdrop-blur hover:bg-black/20 text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Smaller, refined avatar placement */}
          <div className="absolute -bottom-10 left-10 w-32 h-32 rounded-[32px] overflow-hidden bg-white border-4 border-white shadow-xl z-10">
            {trainer.profilePicture ? (
              <img src={trainer.profilePicture} className="w-full h-full object-cover" alt={trainer.name} />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-200 bg-slate-50">
                <Users className="w-12 h-12" />
              </div>
            )}
          </div>
          
          {/* Background pattern/gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="p-10 pt-16 pb-16 overflow-y-auto text-left scrollbar-hide">
          <div className="text-left mb-8">
            <h3 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-2">{trainer.name}</h3>
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full" style={{ backgroundColor: trainer.colorCode }}></div>
               <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Master Coach Portfolio</p>
            </div>
          </div>

          <div className="space-y-8">
            <div 
              className="text-slate-600 leading-relaxed text-lg font-medium prose prose-blue max-w-none"
              dangerouslySetInnerHTML={{ __html: trainer.description }}
            />
            
            <button 
              onClick={onClose} 
              className="w-full mt-12 bg-black text-white font-black py-5 rounded-[28px] text-xl shadow-xl shadow-black/10 active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerBioModal;

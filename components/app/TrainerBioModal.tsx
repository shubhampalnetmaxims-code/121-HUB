
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
        {/* Profile Image Hero */}
        <div className="relative aspect-[4/3] w-full bg-slate-100">
          {trainer.profilePicture ? (
            <img src={trainer.profilePicture} className="w-full h-full object-cover" alt={trainer.name} />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-200">
              <Users className="w-20 h-20" />
            </div>
          )}
          <button 
            onClick={onClose} 
            className="absolute top-6 right-6 p-3 rounded-full bg-white/20 backdrop-blur hover:bg-white/40 text-white transition-all shadow-2xl"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-10 pb-16 overflow-y-auto text-left scrollbar-hide">
          <div className="text-left mb-8">
            <h3 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-2">{trainer.name}</h3>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Professional Portfolio</p>
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
              <ArrowLeft className="w-5 h-5" />
              Back to Facility
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerBioModal;

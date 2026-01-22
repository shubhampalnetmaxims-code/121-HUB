
import React from 'react';
import { X, Activity } from 'lucide-react';
import { Facility } from '../../types';

interface FacilityInfoModalProps {
  facility: Facility;
  onClose: () => void;
}

const FacilityInfoModal: React.FC<FacilityInfoModalProps> = ({ facility, onClose }) => {
  return (
    <div className="absolute inset-0 z-[60] bg-black/70 backdrop-blur-md flex items-end animate-in fade-in duration-300">
      <div className="w-full bg-white rounded-t-[48px] overflow-hidden max-h-[95%] flex flex-col animate-in slide-in-from-bottom duration-500">
        <div className="relative aspect-[16/10] w-full bg-slate-100">
          {facility.imageUrl ? (
            <img src={facility.imageUrl} className="w-full h-full object-cover" alt={facility.name} />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-blue-600 bg-blue-50">
               <Activity className="w-16 h-16" />
            </div>
          )}
          <button 
            onClick={onClose} 
            className="absolute top-6 right-6 p-3 rounded-full bg-black/30 backdrop-blur hover:bg-black/50 text-white transition-all shadow-2xl"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-10 pb-16 overflow-y-auto text-left">
          <div className="flex items-center gap-3 mb-2">
             <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest">Facility Details</span>
          </div>
          <h3 className="text-4xl font-black mb-8 tracking-tighter text-slate-900 leading-tight">{facility.name}</h3>
          
          <div className="space-y-8">
            <div 
              className="text-slate-600 leading-relaxed text-lg font-medium prose prose-blue max-w-none"
              dangerouslySetInnerHTML={{ __html: facility.description }}
            />
            
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Operation</p>
                <p className="font-extrabold text-slate-900">Open 24/7</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Tier</p>
                <p className="font-extrabold text-slate-900">All Members</p>
              </div>
            </div>

            <button 
              onClick={onClose} 
              className="w-full mt-6 bg-black text-white font-black py-5 rounded-[28px] text-xl shadow-2xl shadow-black/30 hover:bg-slate-800 transition-all active:scale-95 uppercase tracking-tighter"
            >
              Return to Hub
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacilityInfoModal;

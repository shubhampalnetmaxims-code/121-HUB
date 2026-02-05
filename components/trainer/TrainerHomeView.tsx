import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ChevronRight, Activity } from 'lucide-react';
import { Facility, Trainer } from '../../types';

interface TrainerHomeViewProps {
  facilities: Facility[];
  trainer: Trainer;
}

const TrainerHomeView: React.FC<TrainerHomeViewProps> = ({ facilities, trainer }) => {
  const navigate = useNavigate();
  const assignedFacilities = facilities.filter(f => trainer.facilityIds.includes(f.id));

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden text-left">
      <div className="p-6 pt-10 border-b border-slate-100 shrink-0">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 uppercase">Coach Dashboard</h2>
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Authorized Hub Access</p>
      </div>

      <div className="flex-1 overflow-y-auto p-5 pb-24 space-y-4 scrollbar-hide">
        <div className="grid grid-cols-1 gap-4">
          {assignedFacilities.map(f => (
            <div 
              key={f.id} 
              onClick={() => navigate(`/trainer/facility/${f.id}`)}
              className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm active:scale-[0.98] transition-all cursor-pointer group"
            >
              <div className="relative aspect-[21/9] w-full bg-slate-100">
                {f.imageUrl ? (
                  <img src={f.imageUrl} className="w-full h-full object-cover" alt="" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-blue-600">
                    <Activity className="w-8 h-8" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-5">
                   <h4 className="text-white font-bold text-lg uppercase tracking-tight">{f.name}</h4>
                   <p className="text-white/60 text-[8px] font-black uppercase tracking-widest flex items-center gap-1">
                      <MapPin className="w-2.5 h-2.5" /> 121 Wellness Node
                   </p>
                </div>
              </div>
              <div className="p-4 flex justify-between items-center bg-white">
                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Facility Operations</span>
                 <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <ChevronRight className="w-4 h-4" />
                 </div>
              </div>
            </div>
          ))}
        </div>
        
        {assignedFacilities.length === 0 && (
          <div className="py-24 text-center">
             <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100 text-slate-300">
               <MapPin className="w-8 h-8" />
             </div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No Assigned Facilities</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainerHomeView;
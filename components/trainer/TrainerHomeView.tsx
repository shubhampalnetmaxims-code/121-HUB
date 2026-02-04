import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, MapPin, ChevronRight } from 'lucide-react';
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
        <h2 className="text-xl font-bold tracking-tight text-slate-900">Welcome, {trainer.name.split(' ')[0]}</h2>
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Select Facility to View Classes</p>
      </div>

      <div className="flex-1 overflow-y-auto p-5 pb-24 space-y-4">
        {assignedFacilities.map(f => (
          <div 
            key={f.id} 
            onClick={() => navigate(`/trainer/facility/${f.id}`)}
            className="bg-white rounded-md border border-slate-200 overflow-hidden shadow-sm active:scale-[0.98] transition-all cursor-pointer"
          >
            <div className="p-5 flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-md flex items-center justify-center text-blue-600">
                    <Dumbbell className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-slate-900 text-lg leading-none mb-1 uppercase">{f.name}</h4>
                    <div className="flex items-center gap-1.5 text-slate-400 text-[9px] font-bold uppercase tracking-wider">
                       <MapPin className="w-3 h-3" /> 121 Network
                    </div>
                  </div>
               </div>
               <ChevronRight className="w-5 h-5 text-slate-300" />
            </div>
          </div>
        ))}
        {assignedFacilities.length === 0 && (
          <div className="py-20 text-center text-slate-400 font-medium">No assigned facilities found.</div>
        )}
      </div>
    </div>
  );
};

export default TrainerHomeView;
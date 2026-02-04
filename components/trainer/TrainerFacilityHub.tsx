import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, ChevronRight, User } from 'lucide-react';
import { Facility, Class, Trainer } from '../../types';

interface TrainerFacilityHubProps {
  facilities: Facility[];
  classes: Class[];
  trainer: Trainer;
}

const TrainerFacilityHub: React.FC<TrainerFacilityHubProps> = ({ facilities, classes, trainer }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const facility = facilities.find(f => f.id === id);
  
  if (!facility) return null;
  
  // In a real system, we'd filter classes the trainer is assigned to.
  // For demo, we show classes belonging to this facility.
  const facilityClasses = classes.filter(c => c.facilityId === id && c.status === 'active');

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden text-left">
      <div className="bg-white p-6 pt-10 border-b border-slate-100 flex items-center gap-4 shrink-0">
        <button onClick={() => navigate('/trainer/home')} className="p-2 hover:bg-slate-50 rounded-md">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-lg font-bold tracking-tight">{facility.name}</h2>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Your Assigned Classes</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 pb-24 space-y-4">
        {facilityClasses.map(c => (
          <div 
            key={c.id}
            onClick={() => navigate(`/trainer/facility/${id}/timetable/${c.id}`)}
            className="bg-white p-5 rounded-md border border-slate-200 shadow-sm active:scale-[0.98] transition-all cursor-pointer flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-md flex items-center justify-center shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="flex-1 overflow-hidden">
               <h4 className="font-bold text-slate-900 text-sm uppercase truncate mb-1">{c.name}</h4>
               <div className="flex items-center gap-2">
                 <User className="w-3 h-3 text-slate-300" />
                 <span className="text-[10px] font-bold text-slate-400 uppercase">{trainer.name}</span>
               </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainerFacilityHub;
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, Check, X, Calendar as CalendarIcon, CheckCircle2 } from 'lucide-react';
import { Facility, Class, ClassSlot, Trainer, DAYS_OF_WEEK } from '../../types';
import { useToast } from '../ToastContext';

interface TrainerTimetableViewProps {
  facilities: Facility[];
  classes: Class[];
  trainer: Trainer;
  classSlots: ClassSlot[];
  onUpdateSlot: (id: string, updates: Partial<ClassSlot>) => void;
}

const TrainerTimetableView: React.FC<TrainerTimetableViewProps> = ({ facilities, classes, trainer, classSlots, onUpdateSlot }) => {
  const { id, classId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const cls = classes.find(c => c.id === classId);
  const facility = facilities.find(f => f.id === id);

  const mySlots = classSlots.filter(s => s.classId === classId && s.trainerId === trainer.id && s.facilityId === id);

  const handleAcceptAll = () => {
    mySlots.filter(s => s.trainerStatus === 'pending').forEach(s => {
      onUpdateSlot(s.id, { trainerStatus: 'accepted' });
    });
    showToast('All slots accepted', 'success');
  };

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden text-left">
      <div className="bg-white p-6 pt-10 border-b border-slate-100 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
           <button onClick={() => navigate(`/trainer/facility/${id}`)} className="p-2 hover:bg-slate-50 rounded-md">
             <ArrowLeft className="w-5 h-5" />
           </button>
           <div>
             <h2 className="text-lg font-bold tracking-tight uppercase leading-none mb-1">{cls?.name}</h2>
             <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{facility?.name}</p>
           </div>
        </div>
        <button 
          onClick={handleAcceptAll}
          className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-[10px] font-bold uppercase tracking-tight active:scale-95 transition-all shadow-sm"
        >
          Accept All
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 pb-24 space-y-4">
        {DAYS_OF_WEEK.map((day, dayIdx) => {
          const daySlots = mySlots.filter(s => s.dayOfWeek === dayIdx).sort((a,b) => a.startTime.localeCompare(b.startTime));
          if (daySlots.length === 0) return null;
          
          return (
            <div key={day} className="space-y-2">
               <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1 mb-2">{day}</h3>
               {daySlots.map(slot => (
                 <div 
                   key={slot.id}
                   onClick={() => navigate(`/trainer/slot/${slot.id}`)}
                   className={`p-4 rounded-md border transition-all cursor-pointer relative overflow-hidden ${
                     slot.trainerStatus === 'pending' ? 'bg-amber-50 border-amber-200' : 
                     slot.trainerStatus === 'accepted' ? 'bg-white border-slate-200' :
                     'bg-slate-50 border-slate-100 opacity-60'
                   }`}
                 >
                   <div className="flex justify-between items-start relative z-10">
                      <div className="flex items-center gap-3">
                         <Clock className={`w-4 h-4 ${slot.trainerStatus === 'pending' ? 'text-amber-600' : 'text-slate-300'}`} />
                         <div className="text-left">
                            <p className="font-bold text-slate-900 text-sm">{slot.startTime}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">{slot.duration}</p>
                         </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${
                        slot.trainerStatus === 'pending' ? 'bg-amber-100 border-amber-200 text-amber-700' : 
                        slot.trainerStatus === 'accepted' ? 'bg-green-50 border-green-100 text-green-700' :
                        'bg-red-50 border-red-100 text-red-700'
                      }`}>
                        {slot.trainerStatus}
                      </span>
                   </div>
                   {slot.trainerStatus === 'accepted' && (
                     <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-green-600" />
                        <span className="text-[9px] font-bold text-slate-400 uppercase">Visible to users</span>
                     </div>
                   )}
                 </div>
               ))}
            </div>
          );
        })}
        {mySlots.length === 0 && (
          <div className="py-20 text-center text-slate-300 font-bold uppercase tracking-widest text-[10px] italic">No slots scheduled for this class.</div>
        )}
      </div>
    </div>
  );
};

export default TrainerTimetableView;
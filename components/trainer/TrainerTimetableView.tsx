import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Check, X, Calendar as CalendarIcon, CheckCircle2, XCircle, ChevronRight } from 'lucide-react';
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

  const mySlots = classSlots.filter(s => {
    const matchFac = s.facilityId === id;
    const matchTrainer = s.trainerId === trainer.id;
    const matchClass = classId === 'all' || s.classId === classId;
    return matchFac && matchTrainer && matchClass;
  });

  const pendingCount = mySlots.filter(s => s.trainerStatus === 'pending').length;

  const handleAcceptAll = () => {
    const pending = mySlots.filter(s => s.trainerStatus === 'pending');
    if (pending.length === 0) return;
    
    pending.forEach(s => {
      onUpdateSlot(s.id, { trainerStatus: 'accepted' });
    });
    showToast(`${pending.length} slots accepted`, 'success');
  };

  const updateStatus = (slotId: string, status: ClassSlot['trainerStatus']) => {
    onUpdateSlot(slotId, { trainerStatus: status });
    const msg = status === 'accepted' ? 'Slot Accepted' : status === 'not-available' ? 'Slot Marked Unavailable' : 'Status Reset';
    showToast(msg, status === 'accepted' ? 'success' : 'info');
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden text-left">
      {/* Dynamic Header */}
      <div className="bg-white p-6 pt-12 border-b border-slate-100 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
           <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-50 rounded-xl">
             <ArrowLeft className="w-5 h-5 text-slate-900" />
           </button>
           <div>
             <h2 className="text-xl font-black text-slate-900 uppercase leading-none mb-1">Shift Ledger</h2>
             <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest truncate max-w-[150px]">
               {classId === 'all' ? 'All Facility Slots' : cls?.name}
             </p>
           </div>
        </div>
        
        {pendingCount > 0 && (
          <button 
            onClick={handleAcceptAll}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl font-black text-[9px] uppercase tracking-widest active:scale-95 transition-all shadow-lg shadow-blue-500/20"
          >
            Accept All ({pendingCount})
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-5 pb-32 space-y-8 scrollbar-hide">
        {DAYS_OF_WEEK.map((day, dayIdx) => {
          const daySlots = mySlots.filter(s => s.dayOfWeek === dayIdx).sort((a,b) => a.startTime.localeCompare(b.startTime));
          if (daySlots.length === 0) return null;
          
          return (
            <div key={day} className="space-y-4">
               <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] px-2 border-l-2 border-slate-200 ml-1">{day}</h3>
               
               <div className="space-y-3">
                 {daySlots.map(slot => {
                   const slotCls = classes.find(c => c.id === slot.classId);
                   const isPending = slot.trainerStatus === 'pending';
                   const isAccepted = slot.trainerStatus === 'accepted';
                   const isRejected = slot.trainerStatus === 'not-available';

                   return (
                     <div 
                       key={slot.id}
                       onClick={() => navigate(`/trainer/slot/${slot.id}`)}
                       className={`bg-white rounded-2xl border transition-all cursor-pointer overflow-hidden shadow-sm active:scale-[0.99] ${
                         isPending ? 'border-amber-200 bg-amber-50/5' : 
                         isAccepted ? 'border-slate-200 bg-white' :
                         'border-slate-100 opacity-60'
                       }`}
                     >
                       <div className="p-5 flex flex-col gap-5">
                          <div className="flex justify-between items-start">
                             <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
                                  isPending ? 'bg-amber-100 text-amber-600 border-amber-200' :
                                  isAccepted ? 'bg-green-50 text-green-600 border-green-100' :
                                  'bg-slate-50 text-slate-400 border-slate-100'
                                }`}>
                                  <Clock className="w-6 h-6" />
                                </div>
                                <div className="text-left overflow-hidden">
                                   <h4 className="font-bold text-slate-900 text-sm uppercase tracking-tight leading-none mb-1 truncate">{slotCls?.name}</h4>
                                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{slot.startTime} • {slot.duration}</p>
                                </div>
                             </div>
                             
                             <div className="text-right">
                                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase border ${
                                   isPending ? 'bg-amber-100 text-amber-700 border-amber-200' : 
                                   isAccepted ? 'bg-green-100 text-green-700 border-green-200' :
                                   'bg-slate-100 text-slate-500 border-slate-200'
                                }`}>
                                   {slot.trainerStatus}
                                </span>
                             </div>
                          </div>

                          <div className="pt-4 border-t border-slate-50 flex gap-2">
                             {isPending ? (
                               <>
                                 <button 
                                   onClick={(e) => { e.stopPropagation(); updateStatus(slot.id, 'accepted'); }}
                                   className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all shadow-md flex items-center justify-center gap-2"
                                 >
                                    <Check className="w-3.5 h-3.5" /> Accept Slot
                                 </button>
                                 <button 
                                   onClick={(e) => { e.stopPropagation(); updateStatus(slot.id, 'not-available'); }}
                                   className="w-12 h-12 bg-white border border-slate-200 text-slate-300 hover:text-red-500 hover:border-red-100 hover:bg-red-50 rounded-xl flex items-center justify-center transition-all active:scale-95"
                                 >
                                    <X className="w-5 h-5" />
                                 </button>
                               </>
                             ) : (
                               <div className="flex-1 flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                                  <div className="flex items-center gap-2 text-left">
                                     {isAccepted ? (
                                       <CheckCircle2 className="w-4 h-4 text-green-500" />
                                     ) : (
                                       <XCircle className="w-4 h-4 text-red-500" />
                                     )}
                                     <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest leading-none">
                                       {isAccepted ? 'Confirmed Session' : 'Unavailable for shift'}
                                     </span>
                                  </div>
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); updateStatus(slot.id, 'pending'); }}
                                    className="text-[9px] font-black text-blue-600 uppercase tracking-widest px-2"
                                  >
                                    Revert
                                  </button>
                               </div>
                             )}
                          </div>
                       </div>
                     </div>
                   );
                 })}
               </div>
            </div>
          );
        })}

        {mySlots.length === 0 && (
          <div className="py-24 text-center space-y-4">
             <div className="w-20 h-20 bg-white rounded-[40px] flex items-center justify-center mx-auto border border-slate-100 text-slate-100 shadow-inner">
                <CalendarIcon className="w-10 h-10" />
             </div>
             <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] italic">No Scheduled Assignments</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainerTimetableView;
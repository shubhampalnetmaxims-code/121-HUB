import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ChevronRight, Calendar as CalendarIcon, CheckCircle2, MoreHorizontal } from 'lucide-react';
import { Trainer, Booking, ClassSlot, Class } from '../../types';

interface TrainerBookingsTabProps {
  trainer: Trainer;
  bookings: Booking[];
  classSlots: ClassSlot[];
  classes: Class[];
}

const TrainerBookingsTab: React.FC<TrainerBookingsTabProps> = ({ trainer, bookings, classSlots, classes }) => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'upcoming' | 'past'>('upcoming');

  const myAcceptedSlots = classSlots.filter(s => s.trainerId === trainer.id && s.trainerStatus === 'accepted');
  
  const upcomingSlots = myAcceptedSlots.filter(s => !s.isDelivered).sort((a,b) => a.dayOfWeek - b.dayOfWeek || a.startTime.localeCompare(b.startTime));
  const pastSlots = myAcceptedSlots.filter(s => s.isDelivered).sort((a,b) => b.dayOfWeek - a.dayOfWeek);

  const displayedSlots = filter === 'upcoming' ? upcomingSlots : pastSlots;

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden text-left">
      <div className="bg-white p-6 pt-10 border-b border-slate-100 shrink-0">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 uppercase">My Schedule</h2>
        
        <div className="flex gap-8 mt-6">
          <button onClick={() => setFilter('upcoming')} className={`text-[11px] font-black uppercase tracking-widest pb-3 transition-all relative ${filter === 'upcoming' ? 'text-blue-600' : 'text-slate-400'}`}>Upcoming{filter === 'upcoming' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />}</button>
          <button onClick={() => setFilter('past')} className={`text-[11px] font-black uppercase tracking-widest pb-3 transition-all relative ${filter === 'past' ? 'text-blue-600' : 'text-slate-400'}`}>Delivered{filter === 'past' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />}</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 pb-24 space-y-3">
        {displayedSlots.map(slot => {
          const cls = classes.find(c => c.id === slot.classId);
          return (
            <div 
              key={slot.id}
              onClick={() => navigate(`/trainer/slot/${slot.id}`)}
              className="bg-white p-5 rounded-md border border-slate-200 shadow-sm flex items-center gap-4 active:scale-[0.98] transition-all cursor-pointer group"
            >
              <div className={`w-12 h-12 rounded-md flex items-center justify-center shrink-0 ${slot.isDelivered ? 'bg-slate-50 text-slate-400' : 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors'}`}>
                <Clock className="w-6 h-6" />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{cls?.name}</p>
                <h4 className="font-bold text-slate-900 text-sm leading-none truncate uppercase tracking-tight">{slot.startTime} • {slot.duration}</h4>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-900 uppercase mb-1">{slot.currentBookings} PAX</p>
                {slot.isDelivered && <CheckCircle2 className="w-4 h-4 text-green-600 ml-auto" />}
                {!slot.isDelivered && <ChevronRight className="w-4 h-4 text-slate-300 ml-auto" />}
              </div>
            </div>
          );
        })}
        {displayedSlots.length === 0 && (
          <div className="py-24 text-center space-y-4">
             <div className="w-16 h-16 bg-slate-50 rounded-md flex items-center justify-center mx-auto border border-slate-100 text-slate-200 shadow-inner"><CalendarIcon className="w-8 h-8" /></div>
             <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">Ledger Status: Empty</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainerBookingsTab;
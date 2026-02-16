import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Calendar, Clock, ChevronRight, CheckCircle2, RefreshCw, ClipboardList, Users, MapPin } from 'lucide-react';
import { Trainer, Booking, ClassSlot, Class, Facility } from '../../types';

interface TrainerBookingsTabProps {
  trainer: Trainer;
  bookings: Booking[];
  classSlots: ClassSlot[];
  classes: Class[];
}

const TrainerBookingsTab: React.FC<TrainerBookingsTabProps> = ({ trainer, bookings, classSlots, classes }) => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<'upcoming' | 'delivered'>('upcoming');

  // Filter slots where the current trainer is the primary coach
  const mySlots = classSlots.filter(s => s.trainerId === trainer.id);
  
  const upcomingSlots = mySlots.filter(s => !s.isDelivered).sort((a, b) => a.dayOfWeek - b.dayOfWeek || a.startTime.localeCompare(b.startTime));
  const deliveredSlots = mySlots.filter(s => s.isDelivered).sort((a, b) => b.dayOfWeek - a.dayOfWeek || b.startTime.localeCompare(a.startTime));

  const displayedSlots = activeSection === 'upcoming' ? upcomingSlots : deliveredSlots;

  const NavButton = ({ id, label }: { id: typeof activeSection, label: string }) => (
    <button 
      onClick={() => setActiveSection(id)}
      className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 ${
        activeSection === id ? 'text-blue-600 border-blue-600' : 'text-slate-400 border-transparent'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden text-left">
      <div className="bg-white p-6 pt-10 border-b border-slate-100 shrink-0">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 uppercase leading-none mb-1">Session Management</h2>
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Manage Participant Rosters</p>
        <div className="flex mt-6 bg-slate-50 p-1 rounded-xl">
          <NavButton id="upcoming" label="Active Cycles" />
          <NavButton id="delivered" label="Completed" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 pb-24 space-y-4 scrollbar-hide">
        {displayedSlots.length > 0 ? displayedSlots.map(slot => {
          const cls = classes.find(c => c.id === slot.classId);
          const slotBookings = bookings.filter(b => b.slotId === slot.id && b.status !== 'cancelled');
          const isToday = slot.dayOfWeek === new Date().getDay();
          
          return (
            <div 
              key={slot.id} 
              onClick={() => navigate(`/trainer/slot/${slot.id}`)}
              className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col gap-5 relative overflow-hidden group active:scale-[0.98] transition-all cursor-pointer"
            >
               <div className="flex justify-between items-start relative z-10">
                  <div className="flex items-center gap-4">
                     <div className={`w-12 h-12 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors ${isToday ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-900'}`}>
                        <Clock className="w-6 h-6" />
                     </div>
                     <div className="text-left overflow-hidden max-w-[180px]">
                        <h4 className="font-black text-slate-900 text-lg leading-tight tracking-tight uppercase truncate mb-1">{cls?.name}</h4>
                        <div className="flex items-center gap-2">
                           <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">{slot.startTime} • {slot.duration}</span>
                        </div>
                     </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:translate-x-1 transition-transform" />
                  </div>
               </div>

               <div className="relative z-10 flex justify-between items-center pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                       <Users className="w-3.5 h-3.5 text-slate-400" />
                       <span className="text-[10px] font-black text-slate-500 uppercase">{slotBookings.length} Booked</span>
                    </div>
                    {isToday && (
                      <span className="px-2 py-1 bg-green-50 text-green-600 text-[8px] font-black uppercase rounded-lg border border-green-100">Happening Today</span>
                    )}
                  </div>
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                     Click to mark attendance
                  </div>
               </div>
               
               <div className="absolute -right-6 -bottom-6 w-32 h-32 text-slate-50/50 rotate-12 group-hover:scale-110 transition-transform pointer-events-none">
                 <ClipboardList className="w-full h-full" />
               </div>
            </div>
          );
        }) : (
          <div className="py-24 text-center space-y-4">
             <div className="w-16 h-16 bg-slate-50 rounded-[40px] flex items-center justify-center mx-auto border border-slate-100 text-slate-200 shadow-inner">
                <ClipboardList className="w-8 h-8" />
             </div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No sessions found in this category</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainerBookingsTab;
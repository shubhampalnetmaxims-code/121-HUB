import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, ChevronRight, User, CheckCircle2, MoreHorizontal, ArrowLeft, RefreshCw, XCircle, Star, MessageSquare, Send, Check } from 'lucide-react';
import { Trainer, ClassSlot, Booking, Class, Facility } from '../../types';
import { useToast } from '../ToastContext';

interface TrainerBookingsViewProps {
  trainer: Trainer;
  classSlots: ClassSlot[];
  bookings: Booking[];
  classes: Class[];
  facilities: Facility[];
  onUpdateBooking: (id: string, updates: Partial<Booking>) => void;
  onUpdateSlot: (id: string, updates: Partial<ClassSlot>) => void;
}

const TrainerBookingsView: React.FC<TrainerBookingsViewProps> = ({ 
  trainer, classSlots, bookings, classes, facilities, onUpdateBooking, onUpdateSlot 
}) => {
  const { showToast } = useToast();
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [slotFeedback, setSlotFeedback] = useState('');

  // Accepted slots only
  const activeSlots = classSlots.filter(s => s.trainerId === trainer.id && s.trainerStatus === 'accepted')
    .sort((a, b) => b.dayOfWeek - a.dayOfWeek || a.startTime.localeCompare(b.startTime));

  const handleMarkAttendance = (bookingId: string, status: Booking['attendanceStatus']) => {
    onUpdateBooking(bookingId, { attendanceStatus: status });
    showToast(`Attendance marked as ${status}`, 'success');
  };

  const handleMarkDelivered = (slotId: string) => {
    onUpdateSlot(slotId, { isDelivered: true });
    showToast('Session delivered. Feedback loop enabled.', 'success');
  };

  const handleUserFeedback = (bookingId: string, feedback: string) => {
    onUpdateBooking(bookingId, { feedbackFromTrainer: feedback });
    showToast('Personal feedback saved', 'success');
  };

  const handleCommonFeedback = (slotId: string) => {
    onUpdateSlot(slotId, { commonFeedback: slotFeedback });
    showToast('Group feedback published', 'success');
  };

  if (selectedSlotId) {
    const slot = classSlots.find(s => s.id === selectedSlotId);
    const cls = slot ? classes.find(c => c.id === slot.classId) : null;
    const fac = slot ? facilities.find(f => f.id === slot.facilityId) : null;
    const slotBookings = bookings.filter(b => b.slotId === selectedSlotId && b.status === 'upcoming' || b.status === 'delivered');

    return (
      <div className="h-full bg-slate-50 flex flex-col animate-in slide-in-from-right duration-300 text-left">
        <div className="bg-white p-6 pt-12 border-b border-slate-100 flex items-center gap-4 shrink-0">
          <button onClick={() => setSelectedSlotId(null)} className="p-2 hover:bg-slate-50 rounded-xl"><ArrowLeft className="w-5 h-5" /></button>
          <div>
            <h3 className="text-xl font-bold tracking-tight uppercase leading-none mb-1">{cls?.name}</h3>
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{fac?.name} • {slot?.startTime}</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-10 pb-32 scrollbar-hide">
           {!slot?.isDelivered && (
             <section className="bg-blue-600 rounded-[32px] p-8 text-white text-center shadow-xl shadow-blue-500/20">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-2">Operational Command</p>
                <h4 className="text-xl font-black uppercase tracking-tight mb-6">Class in Progress</h4>
                <button 
                  onClick={() => handleMarkDelivered(slot!.id)}
                  className="w-full py-4 bg-white text-blue-600 rounded-2xl font-black uppercase text-xs tracking-[0.1em] active:scale-[0.98] transition-all shadow-lg"
                >
                   Complete & Close Session
                </button>
             </section>
           )}

           <section className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Subscriber Register</label>
              <div className="space-y-3">
                 {slotBookings.length > 0 ? slotBookings.map(b => (
                   <div key={b.id} className="bg-white p-5 rounded-[32px] border border-slate-100 shadow-sm space-y-5">
                      <div className="flex justify-between items-start">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 border border-slate-100"><User className="w-5 h-5" /></div>
                            <div className="text-left overflow-hidden">
                               <p className="font-bold text-slate-900 uppercase text-xs truncate leading-none mb-1">{b.userName}</p>
                               <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">{b.type} entry</p>
                            </div>
                         </div>
                         <div className="flex gap-1.5">
                            <button 
                              onClick={() => handleMarkAttendance(b.id, 'present')}
                              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${b.attendanceStatus === 'present' ? 'bg-green-600 text-white' : 'bg-slate-50 text-slate-300 border border-slate-100 hover:text-green-600'}`}
                            >
                               <CheckCircle2 className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={() => handleMarkAttendance(b.id, 'absent')}
                              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${b.attendanceStatus === 'absent' ? 'bg-red-600 text-white' : 'bg-slate-50 text-slate-300 border border-slate-100 hover:text-red-600'}`}
                            >
                               <XCircle className="w-5 h-5" />
                            </button>
                         </div>
                      </div>

                      {slot?.isDelivered && (
                        <div className="pt-4 border-t border-slate-50">
                           <div className="relative">
                              <MessageSquare className="absolute left-3 top-3 w-3.5 h-3.5 text-slate-300" />
                              <textarea 
                                placeholder="Member specific feedback..." 
                                defaultValue={b.feedbackFromTrainer || ''}
                                onBlur={(e) => handleUserFeedback(b.id, e.target.value)}
                                className="w-full pl-9 pr-4 py-3 bg-slate-50 rounded-2xl text-[11px] font-medium outline-none focus:bg-white border border-transparent focus:border-blue-100 transition-all min-h-[60px]"
                              />
                           </div>
                        </div>
                      )}
                   </div>
                 )) : (
                   <div className="py-20 text-center bg-white rounded-[32px] border-2 border-dashed border-slate-100">
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">Zero reservations found</p>
                   </div>
                 )}
              </div>
           </section>

           {slot?.isDelivered && (
             <section className="bg-slate-900 rounded-[40px] p-8 text-white space-y-6">
                <div className="flex items-center gap-3">
                   <div className="p-3 bg-white/10 rounded-2xl"><Star className="w-6 h-6 text-blue-400" /></div>
                   <div className="text-left">
                      <h4 className="text-lg font-black uppercase tracking-tight leading-none mb-1">Global Session Notes</h4>
                      <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Shared with all participants</p>
                   </div>
                </div>
                <textarea 
                  value={slotFeedback}
                  onChange={(e) => setSlotFeedback(e.target.value)}
                  placeholder="Great energy today everyone! Remember to focus on your recovery mechanics tonight."
                  className="w-full bg-white/5 border border-white/10 rounded-[28px] p-6 text-sm font-medium outline-none focus:bg-white/10 transition-all min-h-[120px]"
                />
                <button 
                  onClick={() => handleCommonFeedback(slot.id)}
                  className="w-full py-4 bg-blue-600 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 active:scale-95"
                >
                   <Send className="w-4 h-4" /> Publish Group Feedback
                </button>
             </section>
           )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden text-left relative">
      <div className="bg-white p-6 pt-12 border-b border-slate-100 shrink-0">
        <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase leading-none">Shift Schedule</h2>
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-2">Class Delivery Ledger</p>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4 pb-32 scrollbar-hide">
        {activeSlots.length > 0 ? activeSlots.map(slot => {
          const cls = classes.find(c => c.id === slot.classId);
          const fac = facilities.find(f => f.id === slot.facilityId);
          const isToday = slot.dayOfWeek === new Date().getDay();
          
          return (
            <button 
              key={slot.id} 
              onClick={() => setSelectedSlotId(slot.id)}
              className="w-full bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col gap-5 relative overflow-hidden group active:scale-[0.98] transition-all"
            >
               <div className="flex justify-between items-start relative z-10">
                  <div className="flex items-center gap-4">
                     <div className={`w-12 h-12 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors ${isToday ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-900'}`}>
                        <Clock className="w-6 h-6" />
                     </div>
                     <div className="text-left">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{fac?.name} • {slot.startTime}</p>
                        <h4 className="font-black text-slate-900 text-lg leading-tight tracking-tight uppercase line-clamp-1">{cls?.name}</h4>
                     </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:translate-x-1 transition-transform" />
               </div>

               <div className="relative z-10 flex justify-between items-center pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-slate-300" /><span className="text-[10px] font-black text-slate-500 uppercase">{slot.currentBookings} Enrolled</span></div>
                    {slot.isDelivered && <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-green-500" /><span className="text-[10px] font-black text-green-600 uppercase">Delivered</span></div>}
                  </div>
                  {isToday && (
                    <span className="px-2 py-0.5 bg-blue-600 text-white text-[8px] font-black uppercase rounded shadow-lg shadow-blue-500/20">Active Today</span>
                  )}
               </div>
            </button>
          );
        }) : (
          <div className="py-24 text-center space-y-4">
             <div className="w-16 h-16 bg-white rounded-[32px] flex items-center justify-center mx-auto border border-slate-100 text-slate-200 shadow-sm"><Calendar className="w-8 h-8" /></div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Zero scheduled shifts</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainerBookingsView;
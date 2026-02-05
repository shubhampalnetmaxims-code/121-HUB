import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// Added missing Info icon to imports
import { ArrowLeft, Clock, Check, X, Calendar as CalendarIcon, User, MessageSquare, Send, CheckCircle2, ShieldCheck, XCircle, MoreVertical, Trash2, RefreshCw, Star, Info } from 'lucide-react';
import { ClassSlot, Booking, Class, Facility, Trainer } from '../../types';
import { useToast } from '../ToastContext';
import { useNotifications } from '../NotificationContext';

interface TrainerSlotDetailViewProps {
  classSlots: ClassSlot[];
  classes: Class[];
  facilities: Facility[];
  bookings: Booking[];
  trainer: Trainer;
  onUpdateSlot: (id: string, updates: Partial<ClassSlot>) => void;
  onUpdateBooking: (id: string, updates: Partial<Booking>) => void;
}

const TrainerSlotDetailView: React.FC<TrainerSlotDetailViewProps> = ({ classSlots, classes, facilities, bookings, trainer, onUpdateSlot, onUpdateBooking }) => {
  const { slotId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { addNotification } = useNotifications();
  const [globalFeedback, setGlobalFeedback] = useState('');

  const slot = classSlots.find(s => s.id === slotId);
  if (!slot) return null;

  const cls = classes.find(c => c.id === slot.classId);
  const facility = facilities.find(f => f.id === slot.facilityId);
  const slotBookings = bookings.filter(b => b.slotId === slot.id && (b.status === 'upcoming' || b.status === 'delivered'));

  const handleStatusChange = (status: 'accepted' | 'not-available') => {
    onUpdateSlot(slot.id, { trainerStatus: status });
    showToast(`Slot status: ${status}`, 'success');
    addNotification('Trainer Action', `Slot for ${cls?.name} was marked as ${status} by coach.`, 'info', 'admin');
  };

  const toggleAttendance = (bookingId: string, current: string, target: 'present' | 'absent') => {
    const finalStatus = current === target ? 'pending' : target;
    onUpdateBooking(bookingId, { attendanceStatus: finalStatus as any });
    showToast(`Attendance: ${finalStatus}`, 'info');
  };

  const handleMarkDelivered = () => {
    onUpdateSlot(slot.id, { isDelivered: true });
    showToast('Class marked as delivered', 'success');
    addNotification('Class Delivered', `${cls?.name} was successfully completed by coach.`, 'success', 'admin');
    
    // Notify all users in the slot
    slotBookings.forEach(b => {
      addNotification('Session Completed', `Coach marked ${cls?.name} as completed. Don't forget to check your feedback!`, 'success', b.userId);
    });
  };

  const saveGlobalFeedback = () => {
    onUpdateSlot(slot.id, { commonFeedback: globalFeedback });
    showToast('Global feedback published', 'success');
  };

  const saveIndividualFeedback = (bookingId: string, userId: string, feedback: string) => {
    onUpdateBooking(bookingId, { feedbackFromTrainer: feedback });
    showToast('Feedback sent to member', 'success');
    addNotification('Personal Feedback', `Coach sent you private feedback for ${cls?.name}.`, 'info', userId);
  };

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden text-left">
      <div className="bg-white p-6 pt-12 border-b border-slate-100 flex items-center gap-4 shrink-0">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-xl font-black tracking-tight text-slate-900 uppercase leading-none mb-1">Slot Ledger</h2>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{cls?.name}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 pb-44 space-y-8 scrollbar-hide">
        <section className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl">
           <div className="relative z-10 space-y-6">
              <div className="flex justify-between items-start">
                 <div>
                    <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">Session Timeline</p>
                    <h4 className="text-2xl font-black uppercase tracking-tight">{slot.startTime}</h4>
                    <p className="text-xs font-bold text-blue-400 mt-1">{slot.duration}</p>
                 </div>
                 <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                    <ShieldCheck className="w-6 h-6 text-blue-400" />
                 </div>
              </div>
              <div className="pt-6 border-t border-white/10 flex justify-between items-center">
                 <div>
                    <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">Facility Node</p>
                    <p className="font-bold text-sm uppercase">{facility?.name}</p>
                 </div>
                 <div className="text-right">
                    <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">Acceptance</p>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase border ${
                       slot.trainerStatus === 'accepted' ? 'bg-green-50/20 text-green-400 border-green-500/50' : 
                       'bg-amber-50/20 text-amber-400 border-amber-500/50'
                    }`}>
                       {slot.trainerStatus}
                    </span>
                 </div>
              </div>
           </div>
        </section>

        {slot.trainerStatus === 'pending' && (
          <section className="grid grid-cols-2 gap-3">
             <button onClick={() => handleStatusChange('accepted')} className="py-4 bg-blue-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-lg shadow-blue-500/20 active:scale-95 transition-all">Accept Class</button>
             <button onClick={() => handleStatusChange('not-available')} className="py-4 bg-slate-50 text-slate-400 border border-slate-100 rounded-2xl font-black text-[11px] uppercase tracking-widest active:scale-95 transition-all">Reject Slot</button>
          </section>
        )}

        {slot.trainerStatus === 'accepted' && (
          <>
            <section className="space-y-4">
               <div className="flex justify-between items-center px-1">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Member Attendance</h3>
                  <div className="flex items-center gap-1.5">
                     <span className="px-2 py-1 bg-slate-900 text-white rounded-lg text-[8px] font-black uppercase">{slotBookings.length} PAX</span>
                  </div>
               </div>
               
               <div className="space-y-3">
                  {slotBookings.length > 0 ? slotBookings.map(b => (
                    <div key={b.id} className="bg-white p-5 rounded-[32px] border border-slate-100 shadow-sm space-y-5">
                       <div className="flex justify-between items-start">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 bg-slate-50 text-slate-300 rounded-xl flex items-center justify-center border border-slate-100">
                                <User className="w-5 h-5" />
                             </div>
                             <div className="text-left overflow-hidden">
                                <p className="font-extrabold text-slate-900 text-sm uppercase truncate leading-none mb-1">{b.userName}</p>
                                <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">{b.type} Entry</p>
                             </div>
                          </div>
                          <div className="flex gap-1.5">
                             <button 
                               onClick={() => toggleAttendance(b.id, b.attendanceStatus, 'present')} 
                               className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${b.attendanceStatus === 'present' ? 'bg-green-600 text-white' : 'bg-slate-50 text-slate-300 border border-slate-100'}`}
                             >
                                <Check className="w-4 h-4" />
                             </button>
                             <button 
                               onClick={() => toggleAttendance(b.id, b.attendanceStatus, 'absent')} 
                               className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${b.attendanceStatus === 'absent' ? 'bg-red-600 text-white' : 'bg-slate-50 text-slate-300 border border-slate-100'}`}
                             >
                                <X className="w-4 h-4" />
                             </button>
                          </div>
                       </div>

                       {slot.isDelivered && (
                          <div className="pt-4 border-t border-slate-50">
                             <div className="flex items-center gap-2 mb-3">
                                <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Private Feedback</span>
                             </div>
                             <input 
                                type="text"
                                placeholder="Personalized notes for subscriber..."
                                defaultValue={b.feedbackFromTrainer || ''}
                                onBlur={(e) => saveIndividualFeedback(b.id, b.userId, e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 rounded-2xl text-xs font-bold outline-none focus:bg-white border border-transparent focus:border-blue-100 transition-all"
                             />
                          </div>
                       )}
                    </div>
                  )) : (
                    <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[32px] bg-slate-50/50">
                       <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">Zero Bookings Logged</p>
                    </div>
                  )}
               </div>
            </section>

            <section className="space-y-4 pt-4 border-t border-slate-100">
               {!slot.isDelivered ? (
                  <button 
                    onClick={handleMarkDelivered} 
                    className="w-full py-5 bg-black text-white rounded-[28px] font-black text-lg shadow-2xl active:scale-95 transition-all shadow-black/20"
                  >
                     Complete Session
                  </button>
               ) : (
                  <div className="bg-slate-900 rounded-[40px] p-8 text-white space-y-6">
                     <div className="flex items-center gap-3">
                        <div className="p-3 bg-white/10 rounded-2xl"><Star className="w-6 h-6 text-blue-400" /></div>
                        <div className="text-left">
                           <h4 className="text-lg font-black uppercase tracking-tight leading-none mb-1">Global Session Notes</h4>
                           <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Broadcast to all participants</p>
                        </div>
                     </div>
                     <textarea 
                        value={globalFeedback}
                        onChange={(e) => setGlobalFeedback(e.target.value)}
                        placeholder="Group feedback or recovery instructions..."
                        className="w-full bg-white/5 border border-white/10 rounded-[28px] p-6 text-sm font-medium outline-none focus:bg-white/10 transition-all min-h-[120px]"
                     />
                     <button 
                        onClick={saveGlobalFeedback} 
                        className="w-full py-4 bg-blue-600 rounded-[24px] font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 active:scale-95 shadow-xl shadow-blue-600/20"
                     >
                        <Send className="w-4 h-4" /> Publish Group Ledger
                     </button>
                  </div>
               )}
            </section>

            {/* Operations Restricted Actions */}
            <section className="grid grid-cols-2 gap-3 pt-4">
               {trainer.permissions.canReschedule && (
                 <button className="flex items-center justify-center gap-2 py-4 bg-slate-50 text-slate-900 border border-slate-200 rounded-2xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all">
                    <RefreshCw className="w-3.5 h-3.5" /> Reschedule
                 </button>
               )}
               {trainer.permissions.canCancel && (
                 <button className="flex items-center justify-center gap-2 py-4 bg-red-50 text-red-600 border border-red-100 rounded-2xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all">
                    <XCircle className="w-3.5 h-3.5" /> Terminate
                 </button>
               )}
            </section>
            
            {(!trainer.permissions.canCancel || !trainer.permissions.canReschedule) && (
               <div className="flex items-center gap-2 justify-center opacity-40">
                  <Info className="w-3 h-3" />
                  <p className="text-[8px] font-black uppercase tracking-widest">Administrative restrictions apply</p>
               </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TrainerSlotDetailView;
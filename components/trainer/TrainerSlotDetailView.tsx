import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, Check, X, Calendar as CalendarIcon, User, MessageSquare, Send, CheckCircle2, ShieldCheck, XCircle } from 'lucide-react';
import { ClassSlot, Booking, Class, Facility, Trainer } from '../../types';
import { useToast } from '../ToastContext';

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
  const [feedbackText, setFeedbackText] = useState('');

  const slot = classSlots.find(s => s.id === slotId);
  if (!slot) return null;

  const cls = classes.find(c => c.id === slot.classId);
  const facility = facilities.find(f => f.id === slot.facilityId);
  const slotBookings = bookings.filter(b => b.slotId === slot.id && (b.status === 'upcoming' || b.status === 'delivered'));

  const handleAction = (status: 'accepted' | 'not-available') => {
    onUpdateSlot(slot.id, { trainerStatus: status });
    showToast(`Slot marked as ${status}`, 'success');
  };

  const markAttendance = (bookingId: string, status: Booking['attendanceStatus']) => {
    onUpdateBooking(bookingId, { attendanceStatus: status });
    showToast(`Attendance updated`, 'info');
  };

  const handleMarkDelivered = () => {
    onUpdateSlot(slot.id, { isDelivered: true });
    showToast('Session delivered', 'success');
  };

  const publishFeedback = () => {
    onUpdateSlot(slot.id, { commonFeedback: feedbackText });
    showToast('Global feedback published', 'success');
  };

  const handleUserFeedback = (bookingId: string, text: string) => {
    onUpdateBooking(bookingId, { feedbackFromTrainer: text });
    showToast('Member feedback saved', 'success');
  };

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden text-left">
      <div className="bg-white p-6 pt-10 border-b border-slate-100 flex items-center gap-4 shrink-0">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-50 rounded-md">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-lg font-bold tracking-tight uppercase leading-none mb-1">Slot Detail</h2>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{cls?.name}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 pb-32 space-y-6 scrollbar-hide">
        <section className="bg-slate-50 p-6 rounded-md border border-slate-200 space-y-4">
           <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Time</p>
                <p className="font-bold text-slate-900">{slot.startTime} • {slot.duration}</p>
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Location</p>
                <p className="font-bold text-slate-900 uppercase text-xs">{facility?.name}</p>
              </div>
           </div>
           
           {slot.trainerStatus === 'pending' ? (
             <div className="flex gap-2 pt-2">
                <button onClick={() => handleAction('accepted')} className="flex-1 py-3 bg-blue-600 text-white rounded-md font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 shadow-sm">
                   <Check className="w-3.5 h-3.5" /> Accept Slot
                </button>
                <button onClick={() => handleAction('not-available')} className="px-4 py-3 border border-slate-200 text-slate-400 rounded-md font-bold text-[10px] uppercase tracking-widest active:scale-95">
                   <X className="w-3.5 h-3.5" />
                </button>
             </div>
           ) : (
             <div className="flex items-center justify-between p-3 bg-white rounded-md border border-slate-100">
                <div className="flex items-center gap-2">
                  {slot.trainerStatus === 'accepted' ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <XCircle className="w-4 h-4 text-red-500" />}
                  <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{slot.trainerStatus}</span>
                </div>
                <button onClick={() => onUpdateSlot(slot.id, { trainerStatus: 'pending' })} className="text-[9px] font-bold text-blue-600 uppercase">Change</button>
             </div>
           )}
        </section>

        {slot.trainerStatus === 'accepted' && (
          <>
            <section className="space-y-4">
               <div className="flex justify-between items-center px-1">
                 <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Member Reservations</h3>
                 <span className="px-2 py-0.5 bg-slate-900 text-white rounded text-[8px] font-black uppercase">{slot.currentBookings} enrolled</span>
               </div>
               
               <div className="space-y-3">
                  {slotBookings.map(b => (
                    <div key={b.id} className="bg-white p-4 rounded-md border border-slate-200 shadow-sm space-y-4">
                       <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3 overflow-hidden">
                             <div className="w-10 h-10 bg-slate-50 text-slate-300 rounded-md flex items-center justify-center shrink-0">
                                <User className="w-5 h-5" />
                             </div>
                             <div className="text-left overflow-hidden">
                                <p className="font-bold text-slate-900 text-xs uppercase truncate leading-none mb-1">{b.userName}</p>
                                <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest truncate">{b.type} Entry</p>
                             </div>
                          </div>
                          <div className="flex gap-1">
                             <button onClick={() => markAttendance(b.id, 'present')} className={`p-2 rounded-md transition-all ${b.attendanceStatus === 'present' ? 'bg-green-600 text-white' : 'bg-slate-50 text-slate-300 border border-slate-100 hover:text-green-600'}`}>
                                <ShieldCheck className="w-4 h-4" />
                             </button>
                             <button onClick={() => markAttendance(b.id, 'absent')} className={`p-2 rounded-md transition-all ${b.attendanceStatus === 'absent' ? 'bg-red-600 text-white' : 'bg-slate-50 text-slate-300 border border-slate-100 hover:text-red-600'}`}>
                                <XCircle className="w-4 h-4" />
                             </button>
                          </div>
                       </div>
                       
                       {slot.isDelivered && (
                         <div className="pt-3 border-t border-slate-50">
                            <input 
                              type="text"
                              placeholder="Personal feedback for member..."
                              defaultValue={b.feedbackFromTrainer || ''}
                              onBlur={(e) => handleUserFeedback(b.id, e.target.value)}
                              className="w-full px-3 py-2 bg-slate-50 rounded-md text-[11px] font-medium outline-none border border-transparent focus:border-blue-100"
                            />
                         </div>
                       )}
                    </div>
                  ))}
                  {slotBookings.length === 0 && (
                    <div className="py-10 text-center text-slate-300 font-bold uppercase text-[9px] italic border-2 border-dashed border-slate-100 rounded-md">Zero bookings yet.</div>
                  )}
               </div>
            </section>

            <section className="space-y-4 pt-4 border-t border-slate-100">
               {!slot.isDelivered ? (
                  <button onClick={handleMarkDelivered} className="w-full py-4 bg-slate-900 text-white rounded-md font-black text-xs uppercase tracking-widest shadow-lg active:scale-[0.98] transition-all">Mark Session Delivered</button>
               ) : (
                  <div className="bg-slate-900 rounded-md p-6 text-white space-y-4">
                     <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <h4 className="text-xs font-black uppercase tracking-widest">Post-Session Ledger</h4>
                     </div>
                     <textarea 
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        placeholder="Global notes for all attendees..."
                        className="w-full bg-white/5 border border-white/10 rounded-md p-4 text-[11px] outline-none min-h-[80px]"
                     />
                     <button onClick={publishFeedback} className="w-full py-3 bg-blue-600 text-white rounded-md font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
                        <Send className="w-3 h-3" /> Publish Global Feedback
                     </button>
                  </div>
               )}
            </section>

            {trainer.permissions.canCancel && (
              <button className="w-full py-3 text-red-500 font-bold uppercase text-[10px] tracking-widest opacity-60 hover:opacity-100 transition-opacity">Cancel Entire Class</button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TrainerSlotDetailView;
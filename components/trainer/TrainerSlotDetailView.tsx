import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Check, X, Calendar as CalendarIcon, User, MessageSquare, Send, CheckCircle2, ShieldCheck, XCircle, MoreVertical, Trash2, RefreshCw, Star, Info, Users, MapPin, Repeat, Share2, AlertTriangle } from 'lucide-react';
import { ClassSlot, Booking, Class, Facility, Trainer } from '../../types';
import { useToast } from '../ToastContext';
import { useNotifications } from '../NotificationContext';

interface TrainerSlotDetailViewProps {
  classSlots: ClassSlot[];
  classes: Class[];
  facilities: Facility[];
  bookings: Booking[];
  trainer: Trainer;
  trainers: Trainer[];
  onUpdateSlot: (id: string, updates: Partial<ClassSlot>) => void;
  onUpdateBooking: (id: string, updates: Partial<Booking>) => void;
}

const TrainerSlotDetailView: React.FC<TrainerSlotDetailViewProps> = ({ classSlots, classes, facilities, bookings, trainer, trainers, onUpdateSlot, onUpdateBooking }) => {
  const { slotId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { addNotification } = useNotifications();
  
  const slot = classSlots.find(s => s.id === slotId);
  const [globalFeedback, setGlobalFeedback] = useState(slot?.commonFeedback || '');
  const [isTransferring, setIsTransferring] = useState(false);
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  
  // Reschedule Form
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  if (!slot) return null;

  const cls = classes.find(c => c.id === slot.classId);
  const facility = facilities.find(f => f.id === slot.facilityId);
  const slotBookings = bookings.filter(b => b.slotId === slot.id && (b.status === 'upcoming' || b.status === 'delivered'));
  
  const isMySlot = slot.trainerId === trainer.id;

  const toggleAttendance = (bookingId: string, current: string, target: 'present' | 'absent') => {
    if (!isMySlot) {
      showToast('Action restricted: Not your shift', 'warning');
      return;
    }
    const finalStatus = current === target ? 'pending' : target;
    onUpdateBooking(bookingId, { attendanceStatus: finalStatus as any });
    showToast(`Member marked as ${finalStatus}`, 'info');
  };

  const handleMarkDelivered = () => {
    if (!isMySlot) return;
    onUpdateSlot(slot.id, { isDelivered: true });
    showToast('Session delivered. Post your recap below!', 'success');
    addNotification('Class Delivered', `${cls?.name} was successfully completed by coach ${trainer.name}.`, 'success', 'admin');
    
    slotBookings.forEach(b => {
      addNotification('Session Completed', `Coach ${trainer.name} marked ${cls?.name} as completed. Check your feedback!`, 'success', b.userId);
    });
  };

  const handleTransfer = (targetTrainerId: string) => {
    const targetTrainer = trainers.find(t => t.id === targetTrainerId);
    if (!targetTrainer) return;

    onUpdateSlot(slot.id, { trainerId: targetTrainerId });
    showToast(`Shift transferred to ${targetTrainer.name}`, 'success');
    
    addNotification('Coach Changed', `Your ${cls?.name} session will now be led by coach ${targetTrainer.name}.`, 'info', 'admin');
    slotBookings.forEach(b => {
      addNotification('Coach Update', `Coach ${targetTrainer.name} will now be leading your ${cls?.name} session at ${slot.startTime}.`, 'info', b.userId);
    });

    setIsTransferring(false);
    navigate(-1);
  };

  const handleReschedule = () => {
    if (!newDate || !newTime) {
      showToast('Set date and time', 'warning');
      return;
    }

    const d = new Date(newDate);
    onUpdateSlot(slot.id, { 
      startTime: newTime,
      dayOfWeek: d.getDay(),
      startDate: d.getTime()
    });

    slotBookings.forEach(b => {
      onUpdateBooking(b.id, { 
        startTime: newTime,
        bookingDate: d.getTime(),
        status: 'rescheduled'
      });
      addNotification('Session Rescheduled', `Your ${cls?.name} session has been moved to ${newDate} at ${newTime}.`, 'alert', b.userId);
    });

    addNotification('Shift Rescheduled', `Coach ${trainer.name} moved a ${cls?.name} session.`, 'info', 'admin');
    showToast('Session rescheduled successfully', 'success');
    setIsRescheduling(false);
  };

  const handleCancelSession = () => {
    onUpdateSlot(slot.id, { status: 'waiting', currentBookings: 0 }); // Effectively closes slot
    
    slotBookings.forEach(b => {
      onUpdateBooking(b.id, { status: 'cancelled' });
      addNotification('Session Cancelled', `We're sorry! Your ${cls?.name} session was cancelled by the coach. A refund will be processed.`, 'alert', b.userId);
    });

    addNotification('Session Terminated', `Coach ${trainer.name} cancelled a ${cls?.name} session. Refunds required.`, 'alert', 'admin');
    showToast('Session cancelled. Users & Admin notified.', 'error');
    setIsCancelling(false);
    navigate(-1);
  };

  const saveIndividualFeedback = (bookingId: string, userId: string, feedback: string) => {
    if (!isMySlot) return;
    onUpdateBooking(bookingId, { feedbackFromTrainer: feedback });
    showToast('Personalized feedback saved', 'success');
    addNotification('Coach Feedback', `New private feedback for your ${cls?.name} session.`, 'info', userId);
  };

  const saveGlobalFeedback = () => {
    if (!isMySlot) return;
    onUpdateSlot(slot.id, { commonFeedback: globalFeedback });
    showToast('Review published to all members', 'success');
    
    slotBookings.forEach(b => {
      addNotification('Class Recap Published', `Coach shared a review and notes for today's ${cls?.name}.`, 'info', b.userId);
    });
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden text-left relative font-sans">
      {/* Header */}
      <div className="bg-white p-6 pt-12 border-b border-slate-100 flex items-center gap-4 shrink-0">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-900" />
        </button>
        <div className="overflow-hidden">
          <h2 className="text-xl font-black tracking-tight text-slate-900 uppercase leading-none mb-1 truncate">{cls?.name}</h2>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest truncate">{facility?.name}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 pb-44 space-y-8 scrollbar-hide">
        {/* Session Stats Card */}
        <section className={`rounded-[32px] p-7 text-white relative overflow-hidden shadow-2xl ${isMySlot ? 'bg-slate-900' : 'bg-slate-700'}`}>
           <div className="relative z-10 space-y-6">
              <div className="flex justify-between items-start">
                 <div>
                    <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">Time & Window</p>
                    <h4 className="text-3xl font-black uppercase tracking-tight">{slot.startTime}</h4>
                    <p className="text-xs font-extrabold text-blue-400 mt-1 uppercase tracking-tight">{slot.duration}</p>
                 </div>
                 <div className="w-14 h-14 rounded-2xl flex items-center justify-center backdrop-blur-md bg-white/10 border border-white/10 shadow-lg">
                    <Users className="w-7 h-7 text-blue-400" />
                 </div>
              </div>

              <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                 <div>
                    <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">Roster Capacity</p>
                    <div className="flex items-center gap-2">
                       <span className="font-black text-2xl tracking-tighter">{slotBookings.length}</span>
                       <span className="text-white/30 font-bold text-sm">/ {slot.maxBookings}</span>
                    </div>
                 </div>
                 <div className="text-right">
                    <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">System Node</p>
                    <span className="font-bold text-[10px] uppercase tracking-tight bg-white/5 px-3 py-1 rounded-lg border border-white/10">{facility?.name}</span>
                 </div>
              </div>
           </div>
           <MapPin className="absolute -right-8 -bottom-8 w-40 h-40 text-white/5 rotate-12" />
        </section>

        {/* Management Tools - Only if it's my slot and not delivered */}
        {isMySlot && !slot.isDelivered && (
          <section className="space-y-4">
             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Management Tools</h3>
             <div className="grid grid-cols-3 gap-3">
                <button 
                  onClick={() => setIsTransferring(true)}
                  disabled={!trainer.permissions.canTransfer}
                  className={`p-4 bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col items-center justify-center gap-2 active:scale-95 transition-all group ${!trainer.permissions.canTransfer ? 'opacity-40 grayscale' : ''}`}
                >
                   <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Repeat className="w-5 h-5" />
                   </div>
                   <span className="text-[8px] font-black uppercase tracking-widest text-slate-700 text-center">Transfer class</span>
                </button>
                <button 
                  onClick={() => setIsRescheduling(true)}
                  disabled={!trainer.permissions.canReschedule}
                  className={`p-4 bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col items-center justify-center gap-2 active:scale-95 transition-all group ${!trainer.permissions.canReschedule ? 'opacity-40 grayscale' : ''}`}
                >
                   <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl group-hover:bg-amber-600 group-hover:text-white transition-colors">
                      <RefreshCw className="w-5 h-5" />
                   </div>
                   <span className="text-[8px] font-black uppercase tracking-widest text-slate-700 text-center">Reschedule class</span>
                </button>
                <button 
                  onClick={() => setIsCancelling(true)}
                  disabled={!trainer.permissions.canCancel}
                  className={`p-4 bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col items-center justify-center gap-2 active:scale-95 transition-all group ${!trainer.permissions.canCancel ? 'opacity-40 grayscale' : ''}`}
                >
                   <div className="p-2.5 bg-red-50 text-red-600 rounded-xl group-hover:bg-red-600 group-hover:text-white transition-colors">
                      <XCircle className="w-5 h-5" />
                   </div>
                   <span className="text-[8px] font-black uppercase tracking-widest text-slate-700 text-center">Cancel class</span>
                </button>
             </div>
          </section>
        )}

        {/* Deliver Control (Only if not delivered) */}
        {!slot.isDelivered && isMySlot && (
           <section className="bg-blue-600 rounded-[32px] p-8 text-white text-center shadow-xl shadow-blue-500/20 animate-in zoom-in-95 duration-500">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-2">Shift Controller</p>
              <h4 className="text-xl font-black uppercase tracking-tight mb-6 leading-tight">Ready to wrap up?</h4>
              <button 
                onClick={handleMarkDelivered}
                className="w-full py-5 bg-white text-blue-600 rounded-[24px] font-black uppercase text-sm tracking-widest active:scale-95 transition-all shadow-xl"
              >
                 Mark Class as Delivered
              </button>
           </section>
        )}

        {/* Participant Roster */}
        <section className="space-y-4">
           <div className="flex justify-between items-center px-1">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Member Roster</h3>
              <div className="flex items-center gap-2">
                 <span className="px-2 py-1 bg-slate-900 text-white rounded-lg text-[8px] font-black uppercase">{slotBookings.length} Participants</span>
              </div>
           </div>
           
           <div className="space-y-3">
              {slotBookings.length > 0 ? slotBookings.map(b => (
                <div key={b.id} className="bg-white p-5 rounded-[32px] border border-slate-100 shadow-sm space-y-5 group transition-all hover:border-blue-200">
                   <div className="flex justify-between items-start">
                      <div className="flex items-center gap-4 overflow-hidden">
                         <div className="w-12 h-12 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center border border-slate-100 shrink-0 shadow-inner">
                            <User className="w-6 h-6" />
                         </div>
                         <div className="text-left overflow-hidden">
                            <p className="font-extrabold text-slate-900 text-base uppercase truncate leading-none mb-1.5">{b.userName}</p>
                            <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded inline-block">{b.type} ENTRY</p>
                         </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                         <button 
                           onClick={() => toggleAttendance(b.id, b.attendanceStatus, 'present')} 
                           disabled={!isMySlot}
                           className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${b.attendanceStatus === 'present' ? 'bg-green-600 text-white shadow-lg shadow-green-600/20' : 'bg-slate-50 text-slate-300 border border-slate-100'} ${!isMySlot ? 'opacity-50' : ''}`}
                           title="Mark Present"
                         >
                            <Check className="w-5 h-5" />
                         </button>
                         <button 
                           onClick={() => toggleAttendance(b.id, b.attendanceStatus, 'absent')} 
                           disabled={!isMySlot}
                           className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${b.attendanceStatus === 'absent' ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'bg-slate-50 text-slate-300 border border-slate-100'} ${!isMySlot ? 'opacity-50' : ''}`}
                           title="Mark Absent"
                         >
                            <X className="w-5 h-5" />
                         </button>
                      </div>
                   </div>

                   {slot.isDelivered && isMySlot && (
                      <div className="pt-4 border-t border-slate-100 animate-in slide-in-from-top-2 duration-300">
                         <div className="flex items-center gap-2 mb-3">
                            <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Private Member Notes</span>
                         </div>
                         <input 
                            type="text"
                            placeholder="Add specific progress notes..."
                            defaultValue={b.feedbackFromTrainer || ''}
                            onBlur={(e) => saveIndividualFeedback(b.id, b.userId, e.target.value)}
                            className="w-full px-5 py-4 bg-slate-50 rounded-[20px] text-xs font-bold outline-none focus:bg-white border border-transparent focus:border-blue-100 transition-all shadow-inner"
                         />
                      </div>
                   )}
                </div>
              )) : (
                <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-[32px] bg-slate-50/30">
                   <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic select-none">Zero Subscriber Ledger Entries</p>
                </div>
              )}
           </div>
        </section>

        {/* Review / Global Feedback Section (Only if delivered) */}
        {slot.isDelivered && isMySlot && (
           <section className="bg-slate-900 rounded-[48px] p-8 text-white space-y-6 shadow-2xl animate-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-4">
                 <div className="p-4 bg-white/10 rounded-[20px] shadow-lg"><Star className="w-7 h-7 text-blue-400" /></div>
                 <div className="text-left">
                    <h4 className="text-xl font-black uppercase tracking-tight leading-none mb-1">Post-Session Recap</h4>
                    <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Broadcast to all participants</p>
                 </div>
              </div>
              
              <div className="space-y-4">
                 <p className="text-[10px] text-white/50 uppercase font-black tracking-widest px-1">Global Review & Performance Notes</p>
                 <textarea 
                    value={globalFeedback}
                    onChange={(e) => setGlobalFeedback(e.target.value)}
                    placeholder="Enter today's summary, shout-outs, or cool-down homework..."
                    className="w-full bg-white/5 border border-white/10 rounded-[28px] p-6 text-base font-medium outline-none focus:bg-white/10 transition-all min-h-[160px] shadow-inner"
                 />
                 <button 
                    onClick={saveGlobalFeedback} 
                    className="w-full py-5 bg-blue-600 rounded-[24px] font-black uppercase text-sm tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl shadow-blue-600/20"
                 >
                    <Send className="w-5 h-5" /> Publish Class Recap
                 </button>
              </div>
           </section>
        )}

        {/* Global Feedback View (Read Only) */}
        {slot.isDelivered && !isMySlot && slot.commonFeedback && (
           <section className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                 <Star className="w-5 h-5 text-blue-600" />
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Coach Recap (Global)</h4>
              </div>
              <p className="text-slate-600 italic font-medium leading-relaxed">"{slot.commonFeedback}"</p>
           </section>
        )}
      </div>

      {/* Transfer Modal */}
      {isTransferring && (
        <div className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end animate-in fade-in duration-300">
           <div className="w-full bg-white rounded-t-[40px] p-8 space-y-6 max-h-[85%] overflow-y-auto animate-in slide-in-from-bottom duration-300 shadow-2xl scrollbar-hide">
              <div className="flex justify-between items-center px-1">
                 <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Transfer Shift</h3>
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Reassign Professional Control</p>
                 </div>
                 <button onClick={() => setIsTransferring(false)} className="p-2 bg-slate-50 rounded-xl"><X className="w-6 h-6" /></button>
              </div>
              <div className="space-y-2 pt-2">
                 {trainers.filter(t => t.facilityIds.includes(slot.facilityId) && t.id !== trainer.id).map(t => (
                    <button 
                      key={t.id} 
                      onClick={() => handleTransfer(t.id)}
                      className="w-full p-5 bg-slate-50 border border-slate-100 rounded-[28px] flex items-center gap-4 hover:bg-blue-50 transition-all active:scale-95"
                    >
                       <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 overflow-hidden shadow-sm shrink-0">
                          {t.profilePicture ? <img src={t.profilePicture} className="w-full h-full object-cover" /> : <User className="w-5 h-5 m-auto mt-2.5 text-slate-300" />}
                       </div>
                       <div className="flex-1 text-left">
                          <p className="font-extrabold text-slate-900 uppercase text-sm leading-none mb-1">{t.name}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Lead Coach Portfolio</p>
                       </div>
                       <Share2 className="w-5 h-5 text-slate-300" />
                    </button>
                 ))}
                 {trainers.filter(t => t.facilityIds.includes(slot.facilityId) && t.id !== trainer.id).length === 0 && (
                   <p className="text-center py-10 text-slate-400 font-bold text-xs uppercase tracking-widest italic">No other coaches available at this facility.</p>
                 )}
              </div>
           </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {isRescheduling && (
        <div className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
           <div className="bg-white rounded-[40px] p-8 w-full max-w-sm space-y-8 animate-in zoom-in-95 duration-300 shadow-2xl border border-slate-100">
              <div className="text-center space-y-2">
                 <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-[20px] flex items-center justify-center mx-auto mb-4 border border-amber-100 shadow-inner">
                    <RefreshCw className="w-7 h-7" />
                 </div>
                 <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Move Session</h3>
                 <p className="text-xs font-medium text-slate-500 leading-relaxed uppercase tracking-tight">Participants will be notified of the change instantly.</p>
              </div>
              <div className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-2">New Event Date</label>
                    <input 
                      type="date" 
                      value={newDate}
                      onChange={e => setNewDate(e.target.value)}
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-sm focus:bg-white focus:border-blue-100 transition-all" 
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-2">New Window Time</label>
                    <input 
                      type="time" 
                      value={newTime}
                      onChange={e => setNewTime(e.target.value)}
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-sm focus:bg-white focus:border-blue-100 transition-all" 
                    />
                 </div>
              </div>
              <div className="space-y-3 pt-2">
                 <button 
                  onClick={handleReschedule}
                  className="w-full py-5 bg-black text-white rounded-[24px] font-black uppercase text-sm tracking-widest active:scale-95 transition-all shadow-xl shadow-black/10"
                 >
                    Apply Reschedule
                 </button>
                 <button onClick={() => setIsRescheduling(false)} className="w-full py-2 text-slate-400 font-bold uppercase text-[10px] tracking-widest">Discard Changes</button>
              </div>
           </div>
        </div>
      )}

      {/* Cancel Modal */}
      {isCancelling && (
        <div className="absolute inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
           <div className="bg-white rounded-[40px] p-8 w-full max-w-sm space-y-8 animate-in zoom-in-95 duration-300 shadow-2xl text-center">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-[24px] flex items-center justify-center mx-auto shadow-inner">
                 <AlertTriangle className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                 <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Terminate Class?</h3>
                 <p className="text-xs font-medium text-slate-500 leading-relaxed px-2">This will cancel all {slotBookings.length} bookings and notify the administration for refund processing. This action is final.</p>
              </div>
              <div className="space-y-3 pt-2">
                 <button 
                  onClick={handleCancelSession}
                  className="w-full py-5 bg-red-600 text-white rounded-[24px] font-black uppercase text-sm tracking-widest active:scale-95 transition-all shadow-xl shadow-red-500/20"
                 >
                    Confirm Termination
                 </button>
                 <button onClick={() => setIsCancelling(false)} className="w-full py-2 text-slate-400 font-bold uppercase text-[10px] tracking-widest">Keep Session</button>
              </div>
           </div>
        </div>
      )}

      {/* Action Footer for non-delivered sessions */}
      {!slot.isDelivered && (
        <div className="p-6 pt-2 pb-12 border-t border-slate-50 bg-white/95 backdrop-blur-md absolute bottom-0 left-0 right-0 z-10 shrink-0">
           <button 
            onClick={() => navigate(-1)}
            className="w-full py-5 bg-slate-900 text-white rounded-[24px] font-black text-xl shadow-2xl active:scale-95 transition-all"
           >
            Back to Roster
           </button>
        </div>
      )}
    </div>
  );
};

export default TrainerSlotDetailView;
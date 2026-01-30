import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Calendar, Clock, MapPin, ChevronRight, XCircle, MoreVertical, ShieldCheck, AlertCircle, User as UserIcon, Layers, Ticket, DollarSign, CheckCircle2, TrendingUp, Info, X } from 'lucide-react';
import { Booking, User, Facility, Class, Trainer, Block, BlockBooking, BlockWeeklyPayment } from '../../types';
import { useToast } from '../ToastContext';
import ConfirmationModal from '../admin/ConfirmationModal';
import BlockPaymentModal from './BlockPaymentModal';

interface MyBookingsViewProps {
  currentUser: User | null;
  bookings: Booking[];
  blockBookings: BlockBooking[];
  blockPayments: BlockWeeklyPayment[];
  facilities: Facility[];
  classes: Class[];
  trainers: Trainer[];
  blocks: Block[];
  onUpdateBooking: (id: string, updates: Partial<Booking>) => void;
  onAuthTrigger: () => void;
  onPayWeeklyBlock: (paymentId: string) => void;
  onUpdateUser: (id: string, updates: Partial<User>) => void;
}

const MyBookingsView: React.FC<MyBookingsViewProps> = ({ 
  currentUser, bookings, blockBookings, blockPayments, facilities, classes, trainers, blocks, onUpdateBooking, onAuthTrigger, onPayWeeklyBlock, onUpdateUser 
}) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'classes' | 'blocks'>('classes');
  const [activeHistoryTab, setActiveHistoryTab] = useState<'upcoming' | 'past'>('upcoming');
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [selectedBlockPayment, setSelectedBlockPayment] = useState<BlockWeeklyPayment | null>(null);
  const [viewingBlockDetails, setViewingBlockDetails] = useState<BlockBooking | null>(null);

  if (!currentUser) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-10 text-center bg-white">
        <div className="w-20 h-20 bg-slate-100 rounded-[32px] flex items-center justify-center text-slate-300 mb-6">
          <Calendar className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2 uppercase">My Hub Portfolio</h2>
        <p className="text-slate-500 font-medium text-sm leading-relaxed mb-8">Sign in to manage your active schedules and Transformation Blocks.</p>
        <button 
          onClick={onAuthTrigger}
          className="w-full py-5 bg-black text-white rounded-[28px] font-black text-lg shadow-2xl active:scale-95 transition-all"
        >
          Authenticate Account
        </button>
      </div>
    );
  }

  const userBookings = bookings.filter(b => b.userId === currentUser.id);
  const upcomingBookings = userBookings.filter(b => b.status === 'upcoming' || b.status === 'rescheduled');
  const pastBookings = userBookings.filter(b => b.status === 'delivered' || b.status === 'cancelled');

  const userBlockBookings = blockBookings.filter(bb => bb.userId === currentUser.id);
  
  const handleCancel = () => {
    if (cancellingId) {
      onUpdateBooking(cancellingId, { status: 'cancelled' });
      showToast("Booking cancelled successfully", "info");
      setCancellingId(null);
    }
  };

  const getUpcomingPayment = (bbId: string) => {
    const next = blockPayments
      .filter(p => p.blockBookingId === bbId && p.status === 'pending')
      .sort((a, b) => a.dueDate - b.dueDate)[0];
    return next;
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden text-left relative">
      <div className="bg-white p-6 pt-12 border-b border-slate-100 shrink-0">
        <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase">Hub Activity</h2>
        
        <div className="flex bg-slate-100 p-1 rounded-2xl mt-6 mb-6">
          <button 
            onClick={() => setActiveTab('classes')}
            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'classes' ? 'bg-white text-black shadow-sm' : 'text-slate-400'}`}
          >
            Class Sessions
          </button>
          <button 
            onClick={() => setActiveTab('blocks')}
            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'blocks' ? 'bg-white text-black shadow-sm' : 'text-slate-400'}`}
          >
            Fixed Blocks
          </button>
        </div>

        {activeTab === 'classes' && (
          <div className="flex gap-8">
            <button 
              onClick={() => setActiveHistoryTab('upcoming')}
              className={`text-[11px] font-black uppercase tracking-widest pb-3 transition-all relative ${activeHistoryTab === 'upcoming' ? 'text-blue-600' : 'text-slate-400'}`}
            >
              Upcoming
              {activeHistoryTab === 'upcoming' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full" />}
            </button>
            <button 
              onClick={() => setActiveHistoryTab('past')}
              className={`text-[11px] font-black uppercase tracking-widest pb-3 transition-all relative ${activeHistoryTab === 'past' ? 'text-blue-600' : 'text-slate-400'}`}
            >
              History
              {activeHistoryTab === 'past' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full" />}
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4 pb-32 scrollbar-hide">
        {activeTab === 'classes' ? (
          (activeHistoryTab === 'upcoming' ? upcomingBookings : pastBookings).length > 0 ? (
            (activeHistoryTab === 'upcoming' ? upcomingBookings : pastBookings).map(booking => {
              const fac = facilities.find(f => f.id === booking.facilityId);
              const cls = classes.find(c => c.id === booking.classId);
              const trn = trainers.find(t => t.id === booking.trainerId);
              return (
                <div key={booking.id} className="bg-white rounded-[32px] border border-slate-100 p-6 shadow-sm flex flex-col gap-4 relative overflow-hidden group active:scale-[0.98] transition-all">
                  <div className="flex justify-between items-start">
                     <div className="flex items-center gap-3">
                       <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center"><ShieldCheck className="w-6 h-6" /></div>
                       <div><h4 className="font-bold text-slate-900 text-lg leading-tight tracking-tight uppercase">{cls?.name}</h4><p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{fac?.name}</p></div>
                     </div>
                     <div className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${booking.status === 'upcoming' ? 'bg-blue-50 text-blue-600' : booking.status === 'delivered' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{booking.status}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-50">
                     <div className="flex items-center gap-2.5"><Calendar className="w-4 h-4 text-slate-300" /><div className="text-left"><p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter leading-none mb-1">Scheduled</p><p className="text-xs font-bold text-slate-700">{new Date(booking.bookingDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p></div></div>
                     <div className="flex items-center gap-2.5"><Clock className="w-4 h-4 text-slate-300" /><div className="text-left"><p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter leading-none mb-1">Time</p><p className="text-xs font-bold text-slate-700">{booking.startTime}</p></div></div>
                  </div>
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: trn?.colorCode }} /><span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{trn?.name}</span></div>
                     <div className="text-[10px] font-black text-slate-900 bg-slate-100 px-2 py-1 rounded-lg uppercase">{booking.persons} {booking.persons > 1 ? 'Participants' : 'Participant'}</div>
                  </div>
                  {activeHistoryTab === 'upcoming' && booking.status !== 'cancelled' && (
                     <button onClick={() => setCancellingId(booking.id)} className="w-full py-3 bg-red-50 text-red-600 rounded-xl font-bold text-[10px] uppercase tracking-widest mt-2">Cancel Reservation</button>
                  )}
                </div>
              );
            })
          ) : (
            <div className="py-24 text-center space-y-4"><div className="w-16 h-16 bg-white rounded-[40px] flex items-center justify-center mx-auto border border-slate-100 text-slate-200"><Calendar className="w-8 h-8" /></div><p className="text-lg font-bold text-slate-400 uppercase text-xs tracking-widest">No history found</p></div>
          )
        ) : (
          userBlockBookings.length > 0 ? (
            userBlockBookings.map(bb => {
              const block = blocks.find(b => b.id === bb.blockId);
              const fac = facilities.find(f => f.id === bb.facilityId);
              const trn = trainers.find(t => t.id === bb.trainerId);
              const nextPayment = getUpcomingPayment(bb.id);
              const totalPaidWeeks = blockPayments.filter(p => p.blockBookingId === bb.id && p.status === 'paid').length;
              const progress = (totalPaidWeeks / (block?.numWeeks || 1)) * 100;

              return (
                <div key={bb.id} className="bg-white rounded-[32px] border border-slate-100 p-6 shadow-sm flex flex-col gap-6 relative overflow-hidden">
                   <div className="flex justify-between items-start">
                     <div className="flex items-center gap-3">
                       <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center"><Layers className="w-6 h-6" /></div>
                       <div><h4 className="font-bold text-slate-900 text-lg leading-tight tracking-tight uppercase">{block?.name}</h4><p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{fac?.name}</p></div>
                     </div>
                     <div className="px-2.5 py-1 bg-green-50 text-green-700 rounded-lg text-[9px] font-black uppercase">ENROLLED</div>
                   </div>

                   <div className="space-y-4">
                      <div className="flex justify-between items-end">
                        <div>
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">PROGRAM PROGRESS</p>
                           <h5 className="text-xl font-black text-slate-900 uppercase">Week {totalPaidWeeks} <span className="text-sm text-slate-300">/ {block?.numWeeks}</span></h5>
                        </div>
                        <CheckCircle2 className="w-6 h-6 text-green-500 opacity-20" />
                      </div>
                      <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden">
                         <div className="h-full bg-slate-900 transition-all duration-1000" style={{ width: `${progress}%` }} />
                      </div>
                   </div>

                   {nextPayment && (
                     <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-center justify-between">
                        <div>
                           <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-1">Upcoming Dues: Week {nextPayment.weekNumber}</p>
                           <p className="font-bold text-slate-900 text-sm">${nextPayment.amount.toFixed(2)} • {new Date(nextPayment.dueDate).toLocaleDateString()}</p>
                        </div>
                        <button 
                          onClick={() => setSelectedBlockPayment(nextPayment)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
                        >
                          Pay Now
                        </button>
                     </div>
                   )}

                   <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-50">
                     <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: trn?.colorCode }} />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{trn?.name}</span>
                     </div>
                     <button 
                      onClick={() => setViewingBlockDetails(bb)}
                      className="flex items-center gap-1 text-[10px] font-black text-blue-600 uppercase tracking-widest"
                     >
                       View Schedule <ChevronRight className="w-3.5 h-3.5" />
                     </button>
                   </div>
                </div>
              );
            })
          ) : (
            <div className="py-24 text-center space-y-4"><div className="w-16 h-16 bg-white rounded-[40px] flex items-center justify-center mx-auto border border-slate-100 text-slate-200"><Layers className="w-8 h-8" /></div><p className="text-lg font-bold text-slate-400 uppercase text-xs tracking-widest">No active blocks</p></div>
          )
        )}
      </div>

      {cancellingId && (
        <ConfirmationModal title="Cancel Booking?" message="Cancellations are final and processed per facility rules." variant="danger" confirmText="Cancel Session" onConfirm={handleCancel} onCancel={() => setCancellingId(null)} />
      )}

      {selectedBlockPayment && (
        <BlockPaymentModal 
          payment={selectedBlockPayment} 
          currentUser={currentUser} 
          onClose={() => setSelectedBlockPayment(null)} 
          onComplete={(id) => { onPayWeeklyBlock(id); setSelectedBlockPayment(null); }}
          onUpdateUser={onUpdateUser}
        />
      )}

      {viewingBlockDetails && (
        <div className="absolute inset-0 z-[120] bg-white flex flex-col animate-in slide-in-from-right duration-300 overflow-hidden text-left">
           <div className="bg-slate-50/50 p-6 pt-12 border-b border-slate-100 flex items-center justify-between shrink-0">
             <div className="text-left">
               <h3 className="text-xl font-bold tracking-tight uppercase">Program Analysis</h3>
               <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{blocks.find(b => b.id === viewingBlockDetails.blockId)?.name}</p>
             </div>
             <button onClick={() => setViewingBlockDetails(null)} className="p-3 bg-slate-50 text-slate-900 rounded-2xl transition-colors">
               <X className="w-5 h-5" />
             </button>
           </div>

           <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-32 scrollbar-hide">
              <section className="space-y-4">
                 <div className="flex items-center gap-2 px-1 text-slate-400">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <h4 className="text-[9px] font-black uppercase tracking-widest">Enrollment Progress</h4>
                 </div>
                 <div className="p-8 bg-slate-900 rounded-[40px] text-white space-y-6 relative overflow-hidden">
                    <div className="relative z-10">
                       <div className="flex justify-between items-end mb-4">
                          <div>
                             <p className="text-white/40 text-[9px] font-black uppercase tracking-widest mb-1">Cycle Completion</p>
                             <h5 className="text-4xl font-black tracking-tighter">
                                Week {blockPayments.filter(p => p.blockBookingId === viewingBlockDetails.id && p.status === 'paid').length}
                                <span className="text-lg text-white/20 font-bold ml-2">/ {blocks.find(b => b.id === viewingBlockDetails.blockId)?.numWeeks}</span>
                             </h5>
                          </div>
                          <CheckCircle2 className="w-10 h-10 text-blue-400 opacity-20" />
                       </div>
                       <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div 
                             className="h-full bg-blue-500 transition-all duration-1000" 
                             style={{ width: `${(blockPayments.filter(p => p.blockBookingId === viewingBlockDetails.id && p.status === 'paid').length / (blocks.find(b => b.id === viewingBlockDetails.blockId)?.numWeeks || 1)) * 100}%` }}
                          />
                       </div>
                    </div>
                 </div>
              </section>

              <section className="space-y-4">
                 <div className="flex items-center gap-2 px-1 text-slate-400">
                    <DollarSign className="w-3.5 h-3.5" />
                    <h4 className="text-[9px] font-black uppercase tracking-widest">Payment Ledger</h4>
                 </div>
                 
                 <div className="space-y-3">
                    {/* Deposit Record */}
                    <div className="p-5 bg-white border border-slate-100 rounded-[28px] flex justify-between items-center">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600"><CheckCircle2 className="w-5 h-5" /></div>
                          <div>
                             <p className="font-bold text-sm text-slate-900">JOINING DEPOSIT</p>
                             <p className="text-[10px] text-slate-400 font-bold uppercase">Success • {new Date(viewingBlockDetails.createdAt).toLocaleDateString()}</p>
                          </div>
                       </div>
                       <p className="font-black text-slate-900">${blocks.find(b => b.id === viewingBlockDetails.blockId)?.bookingAmount}</p>
                    </div>

                    {/* Installments */}
                    {blockPayments.filter(p => p.blockBookingId === viewingBlockDetails.id).sort((a, b) => a.weekNumber - b.weekNumber).map(payment => (
                       <div key={payment.id} className={`p-5 rounded-[28px] border flex justify-between items-center ${payment.status === 'paid' ? 'bg-white border-slate-100' : 'bg-slate-50 border-slate-100'}`}>
                          <div className="flex items-center gap-4">
                             <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${payment.status === 'paid' ? 'bg-green-50 text-green-600' : 'bg-white text-slate-300'}`}>
                                W{payment.weekNumber}
                             </div>
                             <div>
                                <p className="font-bold text-sm text-slate-900">WEEKLY INSTALLMENT</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase">
                                   {payment.status === 'paid' ? `Paid on ${new Date(payment.paidAt!).toLocaleDateString()}` : `Due on ${new Date(payment.dueDate).toLocaleDateString()}`}
                                </p>
                             </div>
                          </div>
                          <div className="text-right">
                             <p className="font-black text-slate-900">${payment.amount.toFixed(2)}</p>
                             {payment.status === 'pending' && (
                                <button 
                                   onClick={() => { setSelectedBlockPayment(payment); setViewingBlockDetails(null); }}
                                   className="text-[9px] font-black text-blue-600 uppercase tracking-widest mt-0.5 hover:underline"
                                >
                                   Pay Now
                                </button>
                             )}
                          </div>
                       </div>
                    ))}
                 </div>
              </section>
           </div>

           <div className="p-6 pt-4 pb-12 border-t border-slate-50 bg-white/95 backdrop-blur-md absolute bottom-0 left-0 right-0 z-10 shrink-0">
             <button 
               onClick={() => setViewingBlockDetails(null)}
               className="w-full py-5 bg-black text-white rounded-[28px] font-black text-xl shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3 shadow-black/20"
             >
               Return to Activity
             </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default MyBookingsView;

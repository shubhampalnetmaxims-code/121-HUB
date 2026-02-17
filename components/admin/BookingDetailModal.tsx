import React from 'react';
import { X, User, Mail, Calendar, Clock, BookOpen, MapPin, DollarSign, ShieldCheck, RefreshCcw, AlertTriangle, MessageSquare, Star, ArrowRight } from 'lucide-react';
import { Booking, Class, Trainer, Facility, Location } from '../../types';

interface BookingDetailModalProps {
  booking: Booking;
  cls: Class | undefined;
  trainer: Trainer | undefined;
  facility: Facility | undefined;
  location: Location | undefined;
  onClose: () => void;
  onUpdateStatus: (status: Booking['status']) => void;
  onReschedule: () => void;
}

const BookingDetailModal: React.FC<BookingDetailModalProps> = ({ 
  booking, cls, trainer, facility, location, onClose, onUpdateStatus, onReschedule 
}) => {
  const isCancelled = booking.status === 'cancelled';
  const isRescheduled = booking.status === 'rescheduled';
  const isDelivered = booking.status === 'delivered';

  // Refund Logic:
  // 1. Trainer cancelled the class OR
  // 2. Customer cancelled at least 48 hours before the class
  const isEligibleForRefund = React.useMemo(() => {
    if (!isCancelled || booking.paymentStatus === 'refunded') return false;
    if (booking.cancelledBy === 'trainer' || booking.cancelledBy === 'admin') return true;
    if (booking.cancelledBy === 'customer' && booking.cancelledAt) {
      const timeDiffInMs = booking.bookingDate - booking.cancelledAt;
      return timeDiffInMs >= (48 * 60 * 60 * 1000);
    }
    return false;
  }, [booking, isCancelled]);

  const Property = ({ label, value, icon: Icon, strike = false, highlight = false }: any) => (
    <div className="flex items-start gap-3 py-3 border-b border-slate-50 last:border-0">
      <div className="mt-0.5 text-slate-300 shrink-0"><Icon className="w-3.5 h-3.5" /></div>
      <div className="text-left overflow-hidden">
        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">{label}</p>
        <p className={`text-xs font-semibold text-slate-700 uppercase tracking-tight truncate ${strike ? 'line-through text-slate-300' : ''} ${highlight ? 'text-blue-600' : ''}`}>{value}</p>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl flex flex-col animate-in zoom-in-95 duration-300 overflow-hidden max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="text-left">
             <h3 className="text-base font-bold text-slate-900 uppercase tracking-tight">Booking Audit</h3>
             <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mt-0.5">Txn ID: <span className="text-blue-500 font-semibold">{booking.transactionId || 'N/A'}</span></p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-300 hover:text-slate-600"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide text-left">
          
          {/* Status Badge Block - Lightened weight */}
          <div className={`p-4 rounded-xl border text-center ${
            booking.status === 'upcoming' ? 'bg-blue-50/50 border-blue-100 text-blue-600' :
            booking.status === 'delivered' ? 'bg-green-50/50 border-green-100 text-green-600' :
            booking.status === 'cancelled' ? 'bg-red-50/50 border-red-100 text-red-600' :
            'bg-amber-50/50 border-amber-200 text-amber-600'
          }`}>
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] opacity-60 mb-0.5">Session Status</p>
            <p className="font-bold text-lg uppercase tracking-tight">{booking.status}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
            <Property label="Subscriber" value={booking.userName} icon={User} />
            <Property label="Primary Contact" value={booking.userEmail} icon={Mail} />
            <Property label="Venue" value={facility?.name} icon={MapPin} />
            <Property label="Assigned Area" value={location?.name} icon={MapPin} />
            <Property label="Category" value={cls?.name} icon={BookOpen} />
            <Property label="Lead Coach" value={trainer?.name} icon={User} />
            
            {isRescheduled && booking.originalBookingDate && (
               <Property label="Original Schedule" value={new Date(booking.originalBookingDate).toLocaleDateString()} icon={Calendar} strike />
            )}
            
            <Property 
              label={isRescheduled ? "Revised Schedule" : "Scheduled Date"} 
              value={new Date(booking.bookingDate).toLocaleDateString()} 
              icon={Calendar} 
              highlight={isRescheduled} 
            />
            
            <Property label="Window Time" value={booking.startTime} icon={Clock} />
            <Property label="Payment Source" value={`${booking.type} credit`} icon={DollarSign} />
            <Property label="Valuation" value={`$${booking.amount.toFixed(2)}`} icon={DollarSign} />
            <Property label="Ledger Status" value={booking.paymentStatus || 'Paid'} icon={ShieldCheck} />
          </div>

          {/* Cancellation Specific Info - Softened */}
          {isCancelled && (
            <div className="p-5 bg-slate-50/50 rounded-xl border border-slate-100 space-y-4 animate-in fade-in duration-300">
              <div className="flex justify-between items-center">
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Withdrawal Source</p>
                <span className="px-2 py-0.5 bg-slate-200 text-slate-600 rounded-sm text-[8px] font-bold uppercase tracking-widest">{booking.cancelledBy || 'System'}</span>
              </div>
              <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                <div>
                   <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Refund Eligibility</p>
                   <p className={`text-[10px] font-semibold ${isEligibleForRefund ? 'text-green-600' : 'text-slate-400'} uppercase mt-0.5`}>
                      {isEligibleForRefund ? 'Eligible for Refund' : 'Non-Refundable (Policy)'}
                   </p>
                </div>
                {isEligibleForRefund && (
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-[9px] font-bold uppercase tracking-widest shadow-sm hover:bg-blue-700 transition-all active:scale-95">
                    <RefreshCcw className="w-3.5 h-3.5" /> Initiate Refund
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Review Info for Delivered - Softened */}
          {isDelivered && (
             <div className="space-y-4 pt-4 border-t border-slate-50 animate-in fade-in duration-500">
                <h4 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Qualitative Logs</h4>
                <div className="grid grid-cols-1 gap-4">
                   <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[8px] font-bold text-slate-400 uppercase">Member Feedback</span>
                        {booking.userRating && (
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => <Star key={i} className={`w-2.5 h-2.5 ${i < booking.userRating! ? 'text-amber-400 fill-current' : 'text-slate-200'}`} />)}
                          </div>
                        )}
                      </div>
                      <p className="text-xs font-medium text-slate-600 italic leading-relaxed">"{booking.userFeedback || 'No review submitted.'}"</p>
                   </div>
                   <div className="p-4 bg-blue-50/30 rounded-xl border border-blue-50">
                      <p className="text-[8px] font-bold text-blue-400 uppercase mb-2">Coach Response</p>
                      <p className="text-xs font-medium text-blue-900/70 italic leading-relaxed">"{booking.feedbackFromTrainer || 'No response recorded.'}"</p>
                   </div>
                </div>
             </div>
          )}
        </div>

        {/* Footer Actions - Softened font-black to font-bold */}
        {(booking.status === 'upcoming' || isRescheduled) ? (
          <div className="p-6 border-t border-slate-50 flex gap-3 bg-white">
             <button onClick={() => onUpdateStatus('cancelled')} className="flex-1 py-3 border border-red-100 text-red-500 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-red-50 transition-colors">Cancel</button>
             <button onClick={onReschedule} className="flex-1 py-3 border border-blue-100 text-blue-600 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
                {/* Fix: changed RefreshCw to RefreshCcw which is imported from lucide-react */}
                <RefreshCcw className="w-3.5 h-3.5" /> Reschedule
             </button>
             <button onClick={() => onUpdateStatus('delivered')} className="flex-1 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-all">Delivered</button>
          </div>
        ) : (
          <div className="p-6 border-t border-slate-50 bg-white">
             <button onClick={onClose} className="w-full py-3 bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-all">Dismiss View</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingDetailModal;
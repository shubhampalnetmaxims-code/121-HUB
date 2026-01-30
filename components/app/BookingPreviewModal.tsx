import React, { useState } from 'react';
import { X, CreditCard, ChevronRight, Check, ShieldCheck, Trash2, Plus, Calendar, Clock, MapPin, DollarSign, Ticket } from 'lucide-react';
import { ClassSlot, Class, Trainer, Location, User, Booking, PaymentCard, UserPass, Pass } from '../../types';
import { useToast } from '../ToastContext';
import { useNotifications } from '../NotificationContext';
import CardFormModal from './CardFormModal';

interface BookingPreviewModalProps {
  slot: ClassSlot;
  cls: Class | undefined;
  trainer: Trainer | undefined;
  location: Location | undefined;
  currentUser: User;
  participantNames: string[];
  onClose: () => void;
  onComplete: () => void;
  onAddBooking: (b: Omit<Booking, 'id' | 'createdAt'>) => Booking;
  onUpdateUser: (id: string, updates: Partial<User>) => void;
  selectedUserPass?: UserPass;
  selectedNewPass?: Pass;
  onBuyPass: (p: Pass) => void;
  onUsePass: (userPassId: string, credits: number) => void;
}

const BookingPreviewModal: React.FC<BookingPreviewModalProps> = ({
  slot, cls, trainer, location, currentUser, participantNames: initialNames, onClose, onComplete, onAddBooking, onUpdateUser,
  selectedUserPass, selectedNewPass, onBuyPass, onUsePass
}) => {
  const { showToast } = useToast();
  const { addNotification } = useNotifications();
  const [participantNames, setParticipantNames] = useState<string[]>(initialNames);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string>(currentUser.paymentCards.find(c => c.isPrimary)?.id || currentUser.paymentCards[0]?.id || '');

  const isUsingExistingPass = !!selectedUserPass;
  const isBuyingNewPass = !!selectedNewPass;

  let total = 0;
  if (isBuyingNewPass) {
    total = selectedNewPass!.price;
  } else if (!isUsingExistingPass) {
    total = (cls?.pricePerSession || 0) * participantNames.length;
  }

  const handlePay = async () => {
    if (!acceptedTerms) return;
    if (!isUsingExistingPass && !selectedCardId) {
      showToast("Please select or add a payment card", "error");
      return;
    }

    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Logic: Handle pass purchase if buying new
    if (isBuyingNewPass) {
      onBuyPass(selectedNewPass!);
    }

    // Logic: Deduct credits if using pass
    if (isUsingExistingPass) {
      onUsePass(selectedUserPass!.id, participantNames.length);
    }

    const bookingData: Omit<Booking, 'id' | 'createdAt'> = {
      userId: currentUser.id,
      userName: currentUser.fullName,
      userEmail: currentUser.email,
      facilityId: slot.facilityId,
      classId: slot.classId,
      slotId: slot.id,
      trainerId: slot.trainerId,
      locationId: slot.locationId,
      bookingDate: Date.now() + 86400000,
      startTime: slot.startTime,
      persons: participantNames.length,
      participantNames: participantNames,
      status: 'upcoming',
      type: (isUsingExistingPass || isBuyingNewPass) ? 'pass' : 'class',
      amount: total,
      usedPassId: isUsingExistingPass ? selectedUserPass?.id : undefined
    };

    onAddBooking(bookingData);
    
    addNotification(
      'Booking Successful!',
      `You have secured ${participantNames.length} spots for ${cls?.name}.`,
      'success',
      currentUser.id
    );

    setIsProcessing(false);
    onComplete();
  };

  return (
    <div className="absolute inset-0 z-[120] bg-white flex flex-col animate-in slide-in-from-right duration-300 overflow-hidden text-left">
      <div className="bg-slate-50/50 p-6 pt-12 border-b border-slate-100 flex items-center justify-between shrink-0">
        <div className="text-left">
          <h3 className="text-xl font-bold tracking-tight">Booking Preview</h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Review & Secure</p>
        </div>
        <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-2xl transition-colors shrink-0">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-40 scrollbar-hide">
        {/* Pass Context Banner */}
        {(isUsingExistingPass || isBuyingNewPass) && (
          <div className={`p-5 rounded-[28px] border flex items-center gap-4 ${isUsingExistingPass ? 'bg-blue-50 border-blue-100 text-blue-600' : 'bg-green-50 border-green-100 text-green-600'}`}>
            <div className="p-3 bg-white rounded-2xl shadow-sm"><Ticket className="w-5 h-5" /></div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60">{isUsingExistingPass ? 'Using Credit Balance' : 'Purchasing New Pass'}</p>
              <p className="font-extrabold text-sm">{isUsingExistingPass ? selectedUserPass?.name : selectedNewPass?.name}</p>
            </div>
          </div>
        )}

        <section className="bg-slate-900 rounded-[32px] p-6 text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10 space-y-4">
             <div className="flex justify-between items-start">
               <div>
                 <h4 className="text-2xl font-black tracking-tighter leading-none mb-1">{cls?.name}</h4>
                 <p className="text-xs font-bold text-white/40 uppercase tracking-widest">Reservation Details</p>
               </div>
               <ShieldCheck className="w-8 h-8 text-blue-500" />
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-white/30" />
                  <span className="text-xs font-bold">Tomorrow</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-white/30" />
                  <span className="text-xs font-bold">{slot.startTime}</span>
                </div>
             </div>
          </div>
        </section>

        {/* Pricing Summary */}
        <section className="space-y-4">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Financial Summary</h4>
          <div className="bg-slate-50 rounded-[32px] border border-slate-100 p-6 space-y-4">
             {!isUsingExistingPass && !isBuyingNewPass && (
               <>
                <div className="flex justify-between text-sm font-bold text-slate-600">
                  <span>Price per session</span>
                  <span>${(cls?.pricePerSession || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-600">
                  <span>Participants</span>
                  <span>x {participantNames.length}</span>
                </div>
               </>
             )}
             {isUsingExistingPass && (
               <div className="flex justify-between text-sm font-bold text-blue-600">
                 <span>Credits to deduct</span>
                 <span>- {participantNames.length}</span>
               </div>
             )}
             {isBuyingNewPass && (
               <div className="flex justify-between text-sm font-bold text-green-600">
                 <span>Pass Purchase ({selectedNewPass?.credits} Credits)</span>
                 <span>${selectedNewPass?.price.toFixed(2)}</span>
               </div>
             )}
             <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                <span className="text-lg font-black text-slate-900 tracking-tight">{isUsingExistingPass ? 'Remaining Balance' : 'Total Payable'}</span>
                <span className="text-2xl font-black text-blue-600">
                  {isUsingExistingPass ? `${selectedUserPass!.remainingCredits - participantNames.length}` : `$${total.toFixed(2)}`}
                </span>
             </div>
          </div>
        </section>

        {/* Payment Method - Only if not using existing pass or if total > 0 */}
        {total > 0 && (
          <section className="space-y-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Payment Card</h4>
            <div className="space-y-3">
              {currentUser.paymentCards.map(card => (
                <button 
                  key={card.id}
                  onClick={() => setSelectedCardId(card.id)}
                  className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${
                    selectedCardId === card.id ? 'border-blue-600 bg-blue-50' : 'border-slate-100 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-slate-400" />
                    <span className="font-bold text-sm text-slate-900">{card.cardNumber}</span>
                  </div>
                  {selectedCardId === card.id && <Check className="w-4 h-4 text-blue-600" />}
                </button>
              ))}
            </div>
          </section>
        )}

        <section className="pt-4">
           <label className="flex gap-4 p-5 bg-slate-50 rounded-[28px] border border-slate-100 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={acceptedTerms} 
                onChange={e => setAcceptedTerms(e.target.checked)}
                className="w-6 h-6 rounded-lg accent-blue-600 mt-0.5 shrink-0" 
              />
              <span className="text-xs font-bold text-slate-500 leading-relaxed group-hover:text-slate-700 transition-colors">
                I accept the <span className="text-blue-600 underline">Terms & Conditions</span> for this {isUsingExistingPass || isBuyingNewPass ? 'Pass' : 'Session'}.
              </span>
           </label>
        </section>
      </div>

      <div className="p-6 pt-2 pb-10 border-t border-slate-50 bg-white/80 backdrop-blur-md absolute bottom-0 left-0 right-0 z-10 shrink-0">
        <button 
          onClick={handlePay}
          disabled={!acceptedTerms || (!isUsingExistingPass && !selectedCardId) || isProcessing}
          className="w-full py-5 bg-black text-white rounded-[28px] font-black text-xl shadow-2xl active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
        >
          {isProcessing ? 'Processing Securely...' : isUsingExistingPass ? 'Confirm with Credits' : `Secure Payment $${total.toFixed(2)}`}
        </button>
      </div>
    </div>
  );
};

export default BookingPreviewModal;

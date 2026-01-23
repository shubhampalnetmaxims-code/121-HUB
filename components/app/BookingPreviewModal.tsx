
import React, { useState } from 'react';
import { X, CreditCard, ChevronRight, Check, ShieldCheck, Trash2, Plus, Calendar, Clock, MapPin, DollarSign } from 'lucide-react';
import { ClassSlot, Class, Trainer, Location, User, Booking, PaymentCard } from '../../types';
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
}

const BookingPreviewModal: React.FC<BookingPreviewModalProps> = ({
  slot, cls, trainer, location, currentUser, participantNames: initialNames, onClose, onComplete, onAddBooking, onUpdateUser
}) => {
  const { showToast } = useToast();
  const { addNotification } = useNotifications();
  const [participantNames, setParticipantNames] = useState<string[]>(initialNames);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string>(currentUser.paymentCards.find(c => c.isPrimary)?.id || currentUser.paymentCards[0]?.id || '');

  const pricePerSession = cls?.pricePerSession || 0;
  const subtotal = pricePerSession * participantNames.length;
  const serviceCharge = 0; // Included as per requirement
  const total = subtotal + serviceCharge;

  const handleRemovePerson = (idx: number) => {
    if (participantNames.length <= 1) {
      showToast("At least one participant is required", "warning");
      return;
    }
    setParticipantNames(prev => prev.filter((_, i) => i !== idx));
  };

  const handleAddCard = (cardData: Omit<PaymentCard, 'id' | 'createdAt'>) => {
    const newCard: PaymentCard = {
      ...cardData,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: Date.now(),
      isPrimary: currentUser.paymentCards.length === 0 ? true : cardData.isPrimary
    };
    
    let updatedCards = [...currentUser.paymentCards];
    if (newCard.isPrimary) {
      updatedCards = updatedCards.map(c => ({ ...c, isPrimary: false }));
    }
    updatedCards.push(newCard);
    
    onUpdateUser(currentUser.id, { paymentCards: updatedCards, paymentMethod: 'added' });
    setSelectedCardId(newCard.id);
    setIsAddingCard(false);
    showToast("Card added successfully", "success");
  };

  const handlePay = async () => {
    if (!acceptedTerms) return;
    if (!selectedCardId) {
      showToast("Please select or add a payment card", "error");
      return;
    }

    setIsProcessing(true);
    
    // Simulate Payment Gateway (Stripe) delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const bookingData: Omit<Booking, 'id' | 'createdAt'> = {
      userId: currentUser.id,
      userName: currentUser.fullName,
      userEmail: currentUser.email,
      facilityId: slot.facilityId,
      classId: slot.classId,
      slotId: slot.id,
      trainerId: slot.trainerId,
      locationId: slot.locationId,
      bookingDate: Date.now() + 86400000, // Tomorrow
      startTime: slot.startTime,
      persons: participantNames.length,
      participantNames: participantNames,
      status: 'upcoming',
      type: 'class',
      amount: total
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
        {/* Slot Info Summary */}
        <section className="bg-slate-900 rounded-[32px] p-6 text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10 space-y-4">
             <div className="flex justify-between items-start">
               <div>
                 <h4 className="text-2xl font-black tracking-tighter leading-none mb-1">{cls?.name}</h4>
                 <p className="text-xs font-bold text-white/40 uppercase tracking-widest">Digital Reservation</p>
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
             <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                <MapPin className="w-3.5 h-3.5 text-white/30" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white/60">{location?.name || 'Main Area'}</span>
             </div>
          </div>
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
        </section>

        {/* Participant List */}
        <section className="space-y-4">
          <div className="flex justify-between items-center px-1">
             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Participants ({participantNames.length})</h4>
          </div>
          <div className="space-y-3">
             {participantNames.map((name, idx) => (
               <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-xs font-bold text-slate-400">
                     {idx + 1}
                   </div>
                   <p className="font-bold text-slate-900">{name}</p>
                 </div>
                 {participantNames.length > 1 && (
                   <button onClick={() => handleRemovePerson(idx)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                     <Trash2 className="w-4 h-4" />
                   </button>
                 )}
               </div>
             ))}
          </div>
        </section>

        {/* Pricing Summary */}
        <section className="space-y-4">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Pricing Details</h4>
          <div className="bg-slate-50 rounded-[32px] border border-slate-100 p-6 space-y-4">
             <div className="flex justify-between text-sm font-bold text-slate-600">
               <span>Price per session</span>
               <span>${pricePerSession.toFixed(2)}</span>
             </div>
             <div className="flex justify-between text-sm font-bold text-slate-600">
               <span>Persons</span>
               <span>x {participantNames.length}</span>
             </div>
             <div className="flex justify-between text-sm font-bold text-slate-600">
               <span>Service charges (Included)</span>
               <span className="text-green-600">Free</span>
             </div>
             <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                <span className="text-lg font-black text-slate-900 tracking-tight">Total Payable</span>
                <span className="text-2xl font-black text-blue-600">${total.toFixed(2)}</span>
             </div>
          </div>
        </section>

        {/* Payment Method Selection */}
        <section className="space-y-4">
          <div className="flex justify-between items-center px-1">
             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Payment Method</h4>
             <button onClick={() => setIsAddingCard(true)} className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1">
               <Plus className="w-3 h-3" /> Add New
             </button>
          </div>
          
          <div className="space-y-3">
             {currentUser.paymentCards.length > 0 ? currentUser.paymentCards.map(card => (
               <button 
                key={card.id}
                onClick={() => setSelectedCardId(card.id)}
                className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${
                  selectedCardId === card.id ? 'border-blue-600 bg-blue-50' : 'border-slate-100 bg-white hover:border-slate-200'
                }`}
               >
                 <div className="flex items-center gap-3">
                   <div className={`w-8 h-6 rounded flex items-center justify-center font-black text-[7px] italic text-white ${
                     card.brand === 'Visa' ? 'bg-blue-600' : 'bg-slate-900'
                   }`}>{card.brand}</div>
                   <span className="font-bold text-sm text-slate-900">{card.cardNumber}</span>
                 </div>
                 {selectedCardId === card.id && <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white"><Check className="w-3 h-3" /></div>}
               </button>
             )) : (
               <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-[28px] text-slate-400">
                 <p className="text-sm font-bold">No saved cards</p>
                 <p className="text-[10px] uppercase font-black tracking-widest mt-1">Add a card to proceed</p>
               </div>
             )}
          </div>
        </section>

        {/* Terms */}
        <section className="pt-4">
           <label className="flex gap-4 p-5 bg-slate-50 rounded-[28px] border border-slate-100 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={acceptedTerms} 
                onChange={e => setAcceptedTerms(e.target.checked)}
                className="w-6 h-6 rounded-lg accent-blue-600 mt-0.5 shrink-0" 
              />
              <span className="text-xs font-bold text-slate-500 leading-relaxed group-hover:text-slate-700 transition-colors">
                I accept the <span className="text-blue-600 underline">Terms & Conditions</span> and understand the 24-hour <span className="text-blue-600 underline">Cancellation & Rescheduling Policy</span>.
              </span>
           </label>
        </section>
      </div>

      <div className="p-6 pt-2 pb-10 border-t border-slate-50 bg-white/80 backdrop-blur-md absolute bottom-0 left-0 right-0 z-10 shrink-0">
        <button 
          onClick={handlePay}
          disabled={!acceptedTerms || !selectedCardId || isProcessing}
          className="w-full py-5 bg-black text-white rounded-[28px] font-black text-xl shadow-2xl active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3 overflow-hidden"
        >
          {isProcessing ? (
            <div className="flex items-center gap-3">
               <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
               <span>Securely Processing...</span>
            </div>
          ) : (
            <>
              <ShieldCheck className="w-6 h-6" />
              Pay ${total.toFixed(2)}
            </>
          )}
        </button>
      </div>

      {isAddingCard && (
        <CardFormModal 
          onClose={() => setIsAddingCard(false)} 
          onSave={handleAddCard} 
        />
      )}
    </div>
  );
};

export default BookingPreviewModal;

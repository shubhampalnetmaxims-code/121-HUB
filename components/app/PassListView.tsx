import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Ticket, Layers, Users, Info, ArrowRight, ShieldCheck, DollarSign, X, Check, CreditCard, Plus } from 'lucide-react';
import { Facility, Pass, User, PaymentCard } from '../../types';
import CardFormModal from './CardFormModal';

interface PassListViewProps {
  facilities: Facility[];
  passes: Pass[];
  onBuyPass: (p: Pass) => void;
  onAuthTrigger: () => void;
  currentUser: User | null;
  onUpdateUser: (id: string, updates: Partial<User>) => void;
}

const PassListView: React.FC<PassListViewProps> = ({ facilities, passes, onBuyPass, onAuthTrigger, currentUser, onUpdateUser }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const facility = facilities.find(f => f.id === id);
  
  const [selectedPass, setSelectedPass] = useState<Pass | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string>(currentUser?.paymentCards.find(c => c.isPrimary)?.id || currentUser?.paymentCards[0]?.id || '');

  if (!facility) return null;
  
  const facilityPasses = passes.filter(p => p.facilityId === id && p.status === 'active');

  const handleStartPurchase = (p: Pass) => {
    if (!currentUser) {
      onAuthTrigger();
      return;
    }
    setSelectedPass(p);
  };

  const handleGoToCheckout = () => {
    setIsCheckingOut(true);
  };

  const handleFinalPayment = async () => {
    if (!selectedPass || !currentUser) return;
    if (!selectedCardId) return;

    setIsProcessing(true);
    // Simulate payment gateway delay
    await new Promise(r => setTimeout(r, 2000));
    
    onBuyPass(selectedPass);
    
    setIsProcessing(false);
    setIsSuccess(true);
  };

  const handleAddCard = (cardData: Omit<PaymentCard, 'id' | 'createdAt'>) => {
    if (!currentUser) return;
    const newCard: PaymentCard = {
      ...cardData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now(),
      isPrimary: currentUser.paymentCards.length === 0 ? true : cardData.isPrimary
    };
    let updatedCards = [...currentUser.paymentCards];
    if (newCard.isPrimary) updatedCards = updatedCards.map(c => ({ ...c, isPrimary: false }));
    updatedCards.push(newCard);
    onUpdateUser(currentUser.id, { paymentCards: updatedCards, paymentMethod: 'added' });
    setSelectedCardId(newCard.id);
    setIsAddingCard(false);
  };

  if (isSuccess) {
    return (
      <div className="h-full bg-white flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
        <div className="w-24 h-24 bg-green-50 text-green-600 rounded-[32px] flex items-center justify-center mb-8 shadow-inner">
           <Check className="w-12 h-12" />
        </div>
        <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-4 leading-tight">Pass Secured!</h2>
        <p className="text-slate-500 font-medium text-lg leading-relaxed mb-10 px-4">
          Your <b>{selectedPass?.name}</b> is now active. You can view your remaining credits in your profile.
        </p>
        <div className="space-y-3 w-full">
          <button onClick={() => navigate('/app/profile/passes')} className="w-full py-5 bg-black text-white rounded-[28px] font-black text-xl shadow-2xl active:scale-95 transition-all">My Passes</button>
          <button onClick={() => navigate(`/app/facility/${id}/timetable`)} className="w-full py-4 text-slate-400 font-bold hover:text-slate-600 transition-colors">Book a Class</button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden text-left relative">
      <div className="bg-white p-6 pt-12 border-b border-slate-50 shrink-0">
        <div className="flex items-center gap-4 mb-2">
          <button onClick={() => navigate(`/app/facility/${id}`)} className="p-2 hover:bg-slate-100 rounded-xl">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">Hub Passes</h2>
        </div>
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest ml-12">Bulk Credits & Value</p>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6 pb-32 scrollbar-hide">
        {facilityPasses.length > 0 ? facilityPasses.map(pass => (
          <div key={pass.id} className="bg-white rounded-[32px] border border-slate-100 p-6 shadow-sm space-y-6 group">
             <div className="flex justify-between items-start">
               <div className="space-y-1">
                 <h4 className="text-2xl font-black text-slate-900 tracking-tighter leading-none uppercase">{pass.name}</h4>
                 <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{pass.isAllClasses ? 'Global Sessions' : 'Class Specific'}</span>
                 </div>
               </div>
               <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Best Value</p>
                  <p className="text-3xl font-black text-slate-900 tracking-tighter leading-none">${pass.price}</p>
               </div>
             </div>

             <div className="grid grid-cols-2 gap-3">
               <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2 mb-1 opacity-40"><Layers className="w-3 h-3" /><span className="text-[9px] font-black uppercase">Credits</span></div>
                  <p className="font-black text-slate-900 text-lg">{pass.credits} <span className="text-[10px] text-slate-400 font-bold">Sessions</span></p>
               </div>
               <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2 mb-1 opacity-40"><Users className="w-3 h-3" /><span className="text-[9px] font-black uppercase">Reach</span></div>
                  <p className="font-black text-slate-900 text-lg">{pass.personsPerBooking} <span className="text-[10px] text-slate-400 font-bold">Pers / Book</span></p>
               </div>
             </div>

             <div className="space-y-4 pt-2">
                <p className="text-sm text-slate-500 font-medium leading-relaxed">{pass.description}</p>
                <button 
                  onClick={() => setSelectedPass(pass)}
                  className="flex items-center gap-2 text-xs font-black text-blue-600 uppercase tracking-widest"
                >
                  Read terms & conditions <Info className="w-3.5 h-3.5" />
                </button>
             </div>

             <button 
              onClick={() => handleStartPurchase(pass)}
              className="w-full py-5 bg-black text-white rounded-[28px] font-black text-lg shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 group-hover:bg-slate-800"
             >
               Purchase Pass <ArrowRight className="w-5 h-5" />
             </button>
          </div>
        )) : (
          <div className="py-24 text-center text-slate-400 font-bold">No passes available currently.</div>
        )}
      </div>

      {/* Terms & Conditions Modal */}
      {selectedPass && !isCheckingOut && (
        <div className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end animate-in fade-in duration-300">
           <div className="w-full bg-white rounded-t-[40px] p-10 space-y-8 animate-in slide-in-from-bottom duration-500 overflow-hidden shadow-2xl">
              <div className="flex justify-between items-center">
                 <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Terms of Service</h3>
                 <button onClick={() => setSelectedPass(null)} className="p-3 bg-slate-50 rounded-2xl"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-6 text-left overflow-y-auto max-h-[50vh] pr-2 scrollbar-hide">
                 <div className="space-y-2">
                    <p className="font-black text-[10px] text-blue-600 uppercase tracking-widest">Valid Use</p>
                    <p className="text-sm font-medium text-slate-600 leading-relaxed">This pass allows for {selectedPass.credits} session credits. Each booking can include up to {selectedPass.personsPerBooking} participants.</p>
                 </div>
                 <div className="space-y-2">
                    <p className="font-black text-[10px] text-blue-600 uppercase tracking-widest">Coverage</p>
                    <p className="text-sm font-medium text-slate-600 leading-relaxed">{selectedPass.isAllClasses ? 'Valid for all standard sessions at this facility.' : 'Valid only for specific classes as configured by the hub administrator.'}</p>
                 </div>
              </div>
              <button 
                onClick={handleGoToCheckout}
                className="w-full py-5 bg-blue-600 text-white rounded-[28px] font-black text-xl shadow-2xl active:scale-95 transition-all"
              >
                Proceed to Payment
              </button>
           </div>
        </div>
      )}

      {/* Payment Checkout Modal */}
      {isCheckingOut && selectedPass && currentUser && (
        <div className="absolute inset-0 z-[110] bg-white flex flex-col animate-in slide-in-from-bottom duration-500 overflow-hidden text-left">
          <div className="bg-slate-50/50 p-6 pt-12 border-b border-slate-100 flex items-center justify-between shrink-0">
            <div className="text-left">
              <h3 className="text-xl font-bold tracking-tight">Complete Purchase</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Secure Checkout</p>
            </div>
            <button onClick={() => setIsCheckingOut(false)} className="p-3 hover:bg-slate-100 rounded-2xl transition-colors shrink-0">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-40 scrollbar-hide">
            <div className="p-5 rounded-[28px] border bg-blue-50 border-blue-100 text-blue-600 flex items-center gap-4">
              <div className="p-3 bg-white rounded-2xl shadow-sm"><Ticket className="w-5 h-5" /></div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Selected Plan</p>
                <p className="font-extrabold text-sm">{selectedPass.name}</p>
              </div>
            </div>

            <section className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Summary</h4>
              <div className="bg-slate-50 rounded-[32px] border border-slate-100 p-6 space-y-4">
                 <div className="flex justify-between text-sm font-bold text-slate-600">
                   <span>Bulk Credits</span>
                   <span>{selectedPass.credits} sessions</span>
                 </div>
                 <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                    <span className="text-lg font-black text-slate-900 tracking-tight">Total Price</span>
                    <span className="text-3xl font-black text-blue-600">${selectedPass.price.toFixed(2)}</span>
                 </div>
              </div>
            </section>

            <section className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Payment Method</h4>
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
                <button onClick={() => setIsAddingCard(true)} className="w-full py-4 border-2 border-dashed border-slate-100 rounded-2xl text-[10px] font-black uppercase text-slate-400 flex items-center justify-center gap-2">
                   <Plus className="w-4 h-4" /> Add New Card
                </button>
              </div>
            </section>

            <section className="pt-4">
               <label className="flex gap-4 p-5 bg-slate-50 rounded-[28px] border border-slate-100 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={acceptedTerms} 
                    onChange={e => setAcceptedTerms(e.target.checked)}
                    className="w-6 h-6 rounded-lg accent-blue-600 mt-0.5 shrink-0" 
                  />
                  <span className="text-xs font-bold text-slate-500 leading-relaxed group-hover:text-slate-700 transition-colors">
                    I accept the <span className="text-blue-600 underline">Terms & Conditions</span> and understand passes are non-refundable.
                  </span>
               </label>
            </section>
          </div>

          <div className="p-6 pt-2 pb-12 border-t border-slate-50 bg-white/95 backdrop-blur-md absolute bottom-0 left-0 right-0 z-10 shrink-0">
            <button 
              onClick={handleFinalPayment}
              disabled={!acceptedTerms || !selectedCardId || isProcessing}
              className="w-full py-5 bg-black text-white rounded-[28px] font-black text-xl shadow-2xl active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {isProcessing ? (
                <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <ShieldCheck className="w-6 h-6" />
                  Pay ${selectedPass.price.toFixed(2)}
                </>
              )}
            </button>
          </div>

          {isAddingCard && <CardFormModal onClose={() => setIsAddingCard(false)} onSave={handleAddCard} />}
        </div>
      )}
    </div>
  );
};

export default PassListView;
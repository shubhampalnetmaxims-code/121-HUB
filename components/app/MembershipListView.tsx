import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, CreditCard, Clock, Calendar, ShieldCheck, DollarSign, X, Check, Plus, ArrowRight } from 'lucide-react';
import { Facility, Membership, User, PaymentCard } from '../../types';
import CardFormModal from './CardFormModal';

interface MembershipListViewProps {
  facilities: Facility[];
  memberships: Membership[];
  onBuyMembership: (m: Membership) => void;
  onAuthTrigger: () => void;
  currentUser: User | null;
  onUpdateUser: (id: string, updates: Partial<User>) => void;
}

const MembershipListView: React.FC<MembershipListViewProps> = ({ facilities, memberships, onBuyMembership, onAuthTrigger, currentUser, onUpdateUser }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const facility = facilities.find(f => f.id === id);
  
  const [selectedPlan, setSelectedPlan] = useState<Membership | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string>(currentUser?.paymentCards.find(c => c.isPrimary)?.id || currentUser?.paymentCards[0]?.id || '');

  if (!facility) return null;
  
  const facilityPlans = memberships.filter(m => m.facilityId === id && m.status === 'active');

  const handleStartPurchase = (m: Membership) => {
    if (!currentUser) {
      onAuthTrigger();
      return;
    }
    setSelectedPlan(m);
  };

  const handleGoToCheckout = () => {
    setIsCheckingOut(true);
  };

  const handleFinalPayment = async () => {
    if (!selectedPlan || !currentUser || !selectedCardId) return;

    setIsProcessing(true);
    await new Promise(r => setTimeout(r, 2000));
    
    onBuyMembership(selectedPlan);
    
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
        <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-4 leading-tight">Plan Active!</h2>
        <p className="text-slate-500 font-medium text-lg leading-relaxed mb-10 px-4">
          Your <b>{selectedPlan?.title}</b> is now active. View your access details in your profile.
        </p>
        <div className="space-y-3 w-full">
          <button onClick={() => navigate('/app/profile/memberships')} className="w-full py-5 bg-black text-white rounded-[28px] font-black text-xl shadow-2xl active:scale-95 transition-all uppercase">My Memberships</button>
          <button onClick={() => navigate(`/app/facility/${id}`)} className="w-full py-4 text-slate-400 font-bold hover:text-slate-600 transition-colors uppercase text-sm">Back to Hub</button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden text-left relative">
      <div className="bg-white p-6 pt-12 border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-4 mb-2">
          <button onClick={() => navigate(`/app/facility/${id}`)} className="p-2 hover:bg-slate-100 rounded-xl">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase">Memberships</h2>
        </div>
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest ml-12">Commit to Results</p>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6 pb-32 scrollbar-hide">
        {facilityPlans.length > 0 ? facilityPlans.map(plan => (
          <div key={plan.id} className="bg-white rounded-[32px] border border-slate-100 p-6 shadow-sm space-y-6">
             <div className="flex justify-between items-start">
               <div className="space-y-1">
                 <h4 className="text-2xl font-black text-slate-900 tracking-tighter leading-none uppercase">{plan.title}</h4>
                 <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{plan.durationDays} Day Duration</span>
                 </div>
               </div>
               <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                  <CreditCard className="w-6 h-6" />
               </div>
             </div>

             <div className="p-5 bg-slate-50 rounded-[28px] border border-slate-100">
                <p className="text-sm font-medium text-slate-600 leading-relaxed uppercase tracking-tight opacity-80" dangerouslySetInnerHTML={{ __html: plan.description }} />
             </div>

             <div className="grid grid-cols-2 gap-3">
               <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2 mb-1 opacity-40"><Clock className="w-3 h-3" /><span className="text-[9px] font-black uppercase">Access</span></div>
                  <p className="font-black text-slate-900 text-xs">{plan.allow24Hour ? '24/7 Hours' : `${plan.startTime}-${plan.endTime}`}</p>
               </div>
               <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2 mb-1 opacity-40"><Calendar className="w-3 h-3" /><span className="text-[9px] font-black uppercase">Schedule</span></div>
                  {/* Fix: check daysOfWeek length instead of non-existent daysAccess property */}
                  <p className="font-black text-slate-900 text-xs">{plan.daysOfWeek.length === 7 ? 'All Days' : 'Limited Days'}</p>
               </div>
             </div>

             <div className="flex justify-between items-end px-1">
               <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Economic Fee</p>
                  <p className="text-3xl font-black text-slate-900 tracking-tighter leading-none">${plan.price.toFixed(2)}</p>
               </div>
               <button 
                onClick={() => handleStartPurchase(plan)}
                className="px-8 py-4 bg-black text-white rounded-[24px] font-black text-sm shadow-xl active:scale-95 transition-all flex items-center gap-2 uppercase"
               >
                 Buy Now <ArrowRight className="w-4 h-4" />
               </button>
             </div>
          </div>
        )) : (
          <div className="py-24 text-center text-slate-400 font-bold uppercase text-xs tracking-widest italic">No active memberships currently.</div>
        )}
      </div>

      {/* Payment Modal */}
      {selectedPlan && currentUser && (
        <div className="absolute inset-0 z-[110] bg-white flex flex-col animate-in slide-in-from-bottom duration-500 overflow-hidden text-left">
          <div className="bg-slate-50/50 p-6 pt-12 border-b border-slate-100 flex items-center justify-between shrink-0">
            <div className="text-left">
              <h3 className="text-xl font-bold tracking-tight uppercase">Confirm Enrollment</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Secure Checkout</p>
            </div>
            <button onClick={() => setSelectedPlan(null)} className="p-3 hover:bg-slate-100 rounded-2xl transition-colors shrink-0"><X className="w-6 h-6" /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-40 scrollbar-hide">
            <div className="p-5 rounded-[28px] border bg-blue-50 border-blue-100 text-blue-600 flex items-center gap-4">
              <div className="p-3 bg-white rounded-2xl shadow-sm"><CreditCard className="w-5 h-5" /></div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Membership Type</p>
                <p className="font-extrabold text-sm uppercase">{selectedPlan.title}</p>
              </div>
            </div>

            <section className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Plan Summary</h4>
              <div className="bg-slate-50 rounded-[32px] border border-slate-100 p-6 space-y-4">
                 <div className="flex justify-between text-sm font-bold text-slate-600"><span>Duration</span><span>{selectedPlan.durationDays} days</span></div>
                 <div className="flex justify-between text-sm font-bold text-slate-600"><span>Access</span><span>{selectedPlan.allow24Hour ? '24/7' : 'Timed'}</span></div>
                 <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                    <span className="text-lg font-black text-slate-900 tracking-tight uppercase">Final Charge</span>
                    <span className="text-3xl font-black text-blue-600">${selectedPlan.price.toFixed(2)}</span>
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
                    I accept the <span className="text-blue-600 underline">Terms & Conditions</span> and agree to the hub rules.
                  </span>
               </label>
            </section>
          </div>

          <div className="p-6 pt-2 pb-12 border-t border-slate-50 bg-white/95 backdrop-blur-md absolute bottom-0 left-0 right-0 z-10 shrink-0">
            <button 
              onClick={handleFinalPayment}
              disabled={!acceptedTerms || !selectedCardId || isProcessing}
              className="w-full py-5 bg-black text-white rounded-[28px] font-black text-xl shadow-2xl active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-black/20"
            >
              {isProcessing ? (
                <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <ShieldCheck className="w-6 h-6" />
                  Finalize Payment
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

export default MembershipListView;
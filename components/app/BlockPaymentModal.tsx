
import React, { useState } from 'react';
import { X, CreditCard, ShieldCheck, DollarSign, Check, Layers, Plus } from 'lucide-react';
import { BlockWeeklyPayment, User, PaymentCard } from '../../types';
import CardFormModal from './CardFormModal';

interface BlockPaymentModalProps {
  payment: BlockWeeklyPayment;
  currentUser: User;
  onClose: () => void;
  onComplete: (paymentId: string) => void;
  onUpdateUser: (id: string, updates: Partial<User>) => void;
}

const BlockPaymentModal: React.FC<BlockPaymentModalProps> = ({ payment, currentUser, onClose, onComplete, onUpdateUser }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string>(currentUser.paymentCards.find(c => c.isPrimary)?.id || currentUser.paymentCards[0]?.id || '');

  const handlePayment = async () => {
    if (!selectedCardId) return;
    setIsProcessing(true);
    await new Promise(r => setTimeout(r, 2000));
    onComplete(payment.id);
    setIsProcessing(false);
  };

  const handleAddCard = (cardData: Omit<PaymentCard, 'id' | 'createdAt'>) => {
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

  return (
    <div className="absolute inset-0 z-[150] bg-black/60 backdrop-blur-md flex items-end animate-in fade-in duration-300 text-left">
      <div className="w-full bg-white rounded-t-[40px] flex flex-col max-h-[90%] animate-in slide-in-from-bottom duration-500 overflow-hidden shadow-2xl">
        <div className="p-6 pt-10 border-b border-slate-50 flex items-center justify-between">
          <div className="text-left">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Program Installment</h3>
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Week {payment.weekNumber} Payment</p>
          </div>
          <button onClick={onClose} className="p-3 bg-slate-50 text-slate-900 rounded-2xl transition-colors shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-32 scrollbar-hide">
          <section className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 flex items-center justify-between">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-blue-600 shadow-sm border border-slate-100"><Layers className="w-6 h-6" /></div>
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase">Amount Due</p>
                   <p className="text-2xl font-black text-slate-900">${payment.amount.toFixed(2)}</p>
                </div>
             </div>
             <div className="text-right">
                <p className="text-[9px] font-black text-slate-400 uppercase">Deadline</p>
                <p className="text-xs font-bold text-slate-900">{new Date(payment.dueDate).toLocaleDateString()}</p>
             </div>
          </section>

          <section className="space-y-4">
             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Select Payment Source</h4>
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

          <div className="p-6 bg-slate-900 rounded-[32px] text-white space-y-4">
             <div className="flex items-center gap-3">
               <ShieldCheck className="w-5 h-5 text-blue-400" />
               <p className="text-xs font-bold">Secure Hub Transaction</p>
             </div>
             <p className="text-[10px] text-white/40 font-medium leading-relaxed">
               This payment will be applied immediately to your enrollment status for the transformation block.
             </p>
          </div>
        </div>

        <div className="p-6 pt-2 pb-12 border-t border-slate-50 bg-white/95 backdrop-blur-md absolute bottom-0 left-0 right-0 z-10 shrink-0">
          <button 
            onClick={handlePayment}
            disabled={!selectedCardId || isProcessing}
            className="w-full py-5 bg-black text-white rounded-[28px] font-black text-xl shadow-2xl active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {isProcessing ? 'Verifying...' : `Pay $${payment.amount.toFixed(2)}`}
          </button>
        </div>

        {isAddingCard && <CardFormModal onClose={() => setIsAddingCard(false)} onSave={handleAddCard} />}
      </div>
    </div>
  );
};

export default BlockPaymentModal;

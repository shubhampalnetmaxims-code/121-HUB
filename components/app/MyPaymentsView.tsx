
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, CreditCard, Trash2, Edit3, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { User, PaymentCard } from '../../types';
import CardFormModal from './CardFormModal';
import { useToast } from '../ToastContext';

interface MyPaymentsViewProps {
  currentUser: User | null;
  onUpdateUser: (id: string, updates: Partial<User>) => void;
}

const MyPaymentsView: React.FC<MyPaymentsViewProps> = ({ currentUser, onUpdateUser }) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<PaymentCard | null>(null);

  if (!currentUser) return null;

  const cards = currentUser.paymentCards || [];

  const handleSaveCard = (cardData: Omit<PaymentCard, 'id' | 'createdAt'>) => {
    let updatedCards = [...cards];

    if (editingCard) {
      updatedCards = updatedCards.map(c => {
        if (c.id === editingCard.id) {
          return { ...c, ...cardData };
        }
        // Ensure only one primary
        if (cardData.isPrimary) return { ...c, isPrimary: false };
        return c;
      });
      showToast('Card details updated', 'success');
    } else {
      const newCard: PaymentCard = {
        ...cardData,
        id: Math.random().toString(36).substring(2, 9),
        createdAt: Date.now(),
        // If this is the first card or set as primary, ensure exclusivity
        isPrimary: updatedCards.length === 0 ? true : cardData.isPrimary
      };
      
      if (newCard.isPrimary) {
        updatedCards = updatedCards.map(c => ({ ...c, isPrimary: false }));
      }
      updatedCards.push(newCard);
      showToast('Card added to wallet', 'success');
    }

    onUpdateUser(currentUser.id, { 
      paymentCards: updatedCards,
      paymentMethod: updatedCards.length > 0 ? 'added' : 'skipped'
    });
    setIsFormOpen(false);
    setEditingCard(null);
  };

  const handleDeleteCard = (id: string) => {
    const cardToDelete = cards.find(c => c.id === id);
    const updatedCards = cards.filter(c => c.id !== id);
    
    // Logic: if primary deleted, and there are other cards, alert user to set a new primary
    if (cardToDelete?.isPrimary && updatedCards.length > 0) {
      showToast('Primary card removed. Please select a new primary.', 'warning');
    } else {
      showToast('Card removed from wallet', 'info');
    }

    onUpdateUser(currentUser.id, { 
      paymentCards: updatedCards,
      paymentMethod: updatedCards.length > 0 ? 'added' : 'skipped'
    });
  };

  const setPrimary = (id: string) => {
    const updatedCards = cards.map(c => ({
      ...c,
      isPrimary: c.id === id
    }));
    onUpdateUser(currentUser.id, { paymentCards: updatedCards });
    showToast('Default payment method updated', 'success');
  };

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden text-left">
      <div className="p-6 pt-12 flex items-center gap-4 border-b border-slate-50 shrink-0">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-xl">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="text-left">
          <h2 className="text-2xl font-black tracking-tight">My Payments</h2>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Wallet Management</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-32 scrollbar-hide">
        <section className="space-y-4">
          <div className="flex justify-between items-center px-1">
             <h3 className="font-bold text-slate-900">Saved Cards</h3>
             <button 
              onClick={() => { setEditingCard(null); setIsFormOpen(true); }}
              className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-lg"
             >
               <Plus className="w-3.5 h-3.5" /> Add New
             </button>
          </div>

          <div className="space-y-4">
            {cards.length > 0 ? cards.map(card => (
              <div 
                key={card.id}
                className={`p-6 rounded-[32px] border-2 transition-all relative overflow-hidden ${
                  card.isPrimary ? 'border-blue-600 bg-blue-50/10' : 'border-slate-100 bg-white'
                }`}
              >
                <div className="flex justify-between items-start relative z-10">
                   <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-8 rounded-lg flex items-center justify-center font-black text-[10px] italic ${
                          card.brand === 'Visa' ? 'bg-blue-600 text-white' :
                          card.brand === 'Mastercard' ? 'bg-orange-500 text-white' :
                          'bg-slate-900 text-white'
                        }`}>
                          {card.brand}
                        </div>
                        {card.isPrimary && (
                          <span className="px-2 py-0.5 bg-blue-600 text-white text-[8px] font-black uppercase rounded-full tracking-widest">Primary</span>
                        )}
                      </div>
                      <div>
                        <p className="text-xl font-mono tracking-widest text-slate-900">{card.cardNumber}</p>
                        <div className="flex gap-4 mt-2">
                           <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                             Exp: <span className="text-slate-900">{card.expiryDate}</span>
                           </div>
                           <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                             Holder: <span className="text-slate-900 truncate max-w-[100px] inline-block align-bottom">{card.holderName}</span>
                           </div>
                        </div>
                      </div>
                   </div>
                   
                   <div className="flex flex-col gap-2">
                      <button 
                        onClick={() => { setEditingCard(card); setIsFormOpen(true); }}
                        className="p-3 bg-slate-50 text-slate-400 hover:text-blue-600 rounded-2xl transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteCard(card.id)}
                        className="p-3 bg-slate-50 text-slate-400 hover:text-red-500 rounded-2xl transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                   </div>
                </div>

                {!card.isPrimary && (
                  <button 
                    onClick={() => setPrimary(card.id)}
                    className="mt-6 w-full py-3 border-2 border-dashed border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:border-blue-600 hover:text-blue-600 transition-all"
                  >
                    Set as Primary Method
                  </button>
                )}
                
                {card.isPrimary && <ShieldCheck className="absolute -right-4 -bottom-4 w-24 h-24 text-blue-600/5 rotate-12" />}
              </div>
            )) : (
              <div className="py-16 text-center space-y-4 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-100">
                <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center mx-auto shadow-sm">
                  <CreditCard className="w-8 h-8 text-slate-200" />
                </div>
                <p className="font-bold text-slate-400 text-sm">No cards saved yet.</p>
                <button 
                  onClick={() => setIsFormOpen(true)}
                  className="bg-black text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-lg active:scale-95 transition-all"
                >
                  Add Your First Card
                </button>
              </div>
            )}
          </div>
        </section>

        <section className="p-6 bg-slate-900 rounded-[32px] text-white space-y-4">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
               <ShieldCheck className="w-5 h-5 text-blue-400" />
             </div>
             <div>
               <h4 className="font-bold tracking-tight">Security & Compliance</h4>
               <p className="text-[10px] text-white/40 font-medium">PCI DSS Compliant Infrastructure</p>
             </div>
           </div>
           <p className="text-xs text-white/50 leading-relaxed">
             Your sensitive payment data is encrypted at rest and in transit. 121 Platform never stores full card numbers on our servers.
           </p>
        </section>
      </div>

      {isFormOpen && (
        <CardFormModal 
          initialCard={editingCard} 
          onClose={() => { setIsFormOpen(false); setEditingCard(null); }} 
          onSave={handleSaveCard} 
        />
      )}
    </div>
  );
};

export default MyPaymentsView;

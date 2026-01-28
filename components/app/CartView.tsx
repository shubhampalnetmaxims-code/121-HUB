import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, ShieldCheck, CreditCard, Check, Tag } from 'lucide-react';
import { CartItem, Order, User, PaymentCard } from '../../types';
import { useToast } from '../ToastContext';
import { useNotifications } from '../NotificationContext';
import CardFormModal from './CardFormModal';

interface CartViewProps {
  cart: CartItem[];
  updateQuantity: (id: string, delta: number) => void;
  remove: (id: string) => void;
  currentUser: User | null;
  onAddOrder: (order: Omit<Order, 'id' | 'createdAt'>) => Order;
  onAuthTrigger: () => void;
  onUpdateUser: (id: string, updates: Partial<User>) => void;
}

const CartView: React.FC<CartViewProps> = ({ 
  cart, updateQuantity, remove, currentUser, onAddOrder, onAuthTrigger, onUpdateUser 
}) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { addNotification } = useNotifications();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [selectedCardId, setSelectedCardId] = useState<string>(currentUser?.paymentCards.find(c => c.isPrimary)?.id || currentUser?.paymentCards[0]?.id || '');

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const vat = subtotal * 0.05; // 5% VAT
  const serviceCharge = subtotal > 0 ? 2.50 : 0;
  const total = subtotal + vat + serviceCharge;

  const handleCheckout = async () => {
    if (!currentUser) {
      onAuthTrigger();
      return;
    }

    if (!selectedCardId) {
      setIsAddingCard(true);
      return;
    }

    setIsProcessing(true);
    // Simulate payment gateway
    await new Promise(r => setTimeout(r, 2000));

    const ordNum = `ORD-${Math.random().toString(36).substr(2, 4).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    setOrderNumber(ordNum);

    onAddOrder({
      orderNumber: ordNum,
      userId: currentUser.id,
      userName: currentUser.fullName,
      userEmail: currentUser.email,
      facilityId: cart[0]?.facilityId || '1',
      items: cart,
      subtotal,
      vat,
      serviceCharge,
      total,
      status: 'placed'
    });

    addNotification('Order Placed', `Order ${ordNum} has been placed successfully.`, 'success', currentUser.id);
    addNotification('New Order Received', `A new marketplace order (${ordNum}) has been received.`, 'info', 'admin');

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
        <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-4 leading-tight">Order Placed!</h2>
        <div className="bg-slate-50 px-4 py-2 rounded-xl mb-8 border border-slate-100">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Receipt ID</p>
           <p className="font-mono font-bold text-slate-900">{orderNumber}</p>
        </div>
        <p className="text-slate-500 font-medium text-lg leading-relaxed mb-10 px-4">
          Your order has been placed successfully. You can pick up your product from the facility front desk when you visit.
        </p>
        <button onClick={() => navigate('/app/home')} className="w-full py-5 bg-black text-white rounded-[28px] font-black text-xl shadow-2xl active:scale-95 transition-all">Back to Home</button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden text-left relative">
      <div className="p-6 pt-12 flex items-center gap-4 border-b border-slate-50 shrink-0">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-xl">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-left">
          <h2 className="text-2xl font-black tracking-tight">Your Cart</h2>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{cart.length} items</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-48 scrollbar-hide">
        {cart.length > 0 ? (
          <>
            <div className="space-y-4">
              {cart.map(item => (
                <div key={item.id} className="flex gap-4 p-4 bg-slate-50 border border-slate-100 rounded-[28px] relative group animate-in slide-in-from-bottom duration-300">
                  <div className="w-20 h-20 bg-white rounded-2xl overflow-hidden shrink-0 border border-slate-100">
                    <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                  </div>
                  <div className="flex-1 py-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-slate-900 leading-tight">{item.name}</h4>
                      <button onClick={() => remove(item.id)} className="p-2 -mt-2 text-slate-300 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-4">Size: {item.size}</p>
                    <div className="flex justify-between items-center">
                      <p className="font-black text-slate-900 text-lg">${item.price.toFixed(2)}</p>
                      <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-xl border border-slate-100">
                        <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-slate-50 rounded-lg text-slate-400"><Minus className="w-3.5 h-3.5" /></button>
                        <span className="font-black text-sm w-4 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-slate-50 rounded-lg text-slate-400"><Plus className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <section className="space-y-4">
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Payment Method</h4>
               {currentUser ? (
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
               ) : (
                 <button onClick={onAuthTrigger} className="w-full py-5 bg-blue-50 text-blue-600 rounded-[28px] font-black uppercase text-xs border-2 border-blue-100">Sign in to add payment method</button>
               )}
            </section>

            <section className="bg-slate-50 rounded-[32px] p-6 space-y-4">
              <div className="flex justify-between text-sm font-bold text-slate-500">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-500">
                <span>VAT (5%)</span>
                <span>${vat.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-500">
                <span>Service Fee</span>
                <span>${serviceCharge.toFixed(2)}</span>
              </div>
              <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                <span className="text-xl font-black text-slate-900 tracking-tight">Total</span>
                <span className="text-3xl font-black text-blue-600">${total.toFixed(2)}</span>
              </div>
              <p className="text-[8px] font-black text-slate-400 uppercase text-center tracking-widest mt-2">VAT and service charges will be applied.</p>
            </section>
          </>
        ) : (
          <div className="py-24 text-center space-y-6">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
              <ShoppingCart className="w-12 h-12" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-400">Cart is empty</p>
              <p className="text-xs text-slate-300 mt-1">Visit our market to find performance gear.</p>
            </div>
            <button onClick={() => navigate('/app/market')} className="px-8 py-3 bg-black text-white rounded-xl font-bold text-sm">Explore Market</button>
          </div>
        )}
      </div>

      {cart.length > 0 && (
        <div className="p-6 pt-4 pb-12 border-t border-slate-50 bg-white/95 backdrop-blur-md absolute bottom-0 left-0 right-0 z-[60] shrink-0">
          <button 
            onClick={handleCheckout}
            disabled={isProcessing}
            className="w-full py-5 bg-black text-white rounded-[28px] font-black text-xl shadow-2xl active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {isProcessing ? (
              <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <ShieldCheck className="w-6 h-6" />
                Proceed to Pay
              </>
            )}
          </button>
        </div>
      )}

      {isAddingCard && <CardFormModal onClose={() => setIsAddingCard(false)} onSave={handleAddCard} />}
    </div>
  );
};

export default CartView;
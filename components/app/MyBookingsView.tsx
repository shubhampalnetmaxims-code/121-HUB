import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Calendar, Clock, MapPin, ChevronRight, XCircle, MoreVertical, ShieldCheck, AlertCircle, User as UserIcon, Layers, Ticket, DollarSign, CheckCircle2, TrendingUp, Info, X, FileText, ShoppingBag, Eye, RefreshCcw } from 'lucide-react';
import { Booking, User, Facility, Class, Trainer, Block, BlockBooking, BlockWeeklyPayment, UserMembership, Order, ClassSlot } from '../../types';
import { useToast } from '../ToastContext';
import ConfirmationModal from '../admin/ConfirmationModal';
import BlockPaymentModal from './BlockPaymentModal';
import ItemDetailModal from './ItemDetailModal';

interface MyBookingsViewProps {
  currentUser: User | null;
  bookings: Booking[];
  classSlots: ClassSlot[]; // Added slots to props
  blockBookings: BlockBooking[];
  blockPayments: BlockWeeklyPayment[];
  facilities: Facility[];
  classes: Class[];
  trainers: Trainer[];
  blocks: Block[];
  userMemberships: UserMembership[];
  orders: Order[];
  onUpdateBooking: (id: string, updates: Partial<Booking>) => void;
  onUpdateBlockBooking: (id: string, updates: Partial<BlockBooking>) => void;
  onUpdateUserMembership: (id: string, updates: Partial<UserMembership>) => void;
  onUpdateOrder: (id: string, updates: Partial<Order>) => void;
  onAuthTrigger: () => void;
  onPayWeeklyBlock: (paymentId: string) => void;
  onUpdateUser: (id: string, updates: Partial<User>) => void;
}

const MyBookingsView: React.FC<MyBookingsViewProps> = ({ 
  currentUser, 
  bookings = [], 
  classSlots = [],
  blockBookings = [], 
  blockPayments = [], 
  facilities = [], 
  classes = [], 
  trainers = [], 
  blocks = [], 
  userMemberships = [], 
  orders = [],
  onUpdateBooking, onUpdateBlockBooking, onUpdateUserMembership, onUpdateOrder, onAuthTrigger, onPayWeeklyBlock, onUpdateUser 
}) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'classes' | 'blocks' | 'memberships' | 'orders'>('classes');
  const [activeHistoryTab, setActiveHistoryTab] = useState<'upcoming' | 'past'>('upcoming');
  
  // Detail States
  const [viewingDetail, setViewingDetail] = useState<{ type: 'booking' | 'order' | 'pass' | 'membership', item: any } | null>(null);
  const [cancellingItem, setCancellingItem] = useState<{ id: string, type: 'class' | 'block' | 'membership' | 'order', facilityId: string } | null>(null);

  if (!currentUser) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-10 text-center bg-white">
        <div className="w-20 h-20 bg-slate-100 rounded-[32px] flex items-center justify-center text-slate-300 mb-6">
          <Calendar className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2 uppercase">My Portfolio</h2>
        <p className="text-slate-500 font-medium text-sm leading-relaxed mb-8">Sign in to manage your active schedules, memberships, and programs.</p>
        <button onClick={onAuthTrigger} className="w-full py-5 bg-black text-white rounded-[28px] font-black text-lg shadow-2xl active:scale-95 transition-all uppercase">Sign In</button>
      </div>
    );
  }

  const userBookings = bookings.filter(b => b.userId === currentUser.id);
  const upcomingBookings = userBookings.filter(b => b.status === 'upcoming' || b.status === 'rescheduled');
  const pastBookings = userBookings.filter(b => b.status === 'delivered' || b.status === 'cancelled');

  const userBlockBookings = blockBookings.filter(bb => bb.userId === currentUser.id);
  const userPurchasedMemberships = userMemberships.filter(um => um.userId === currentUser.id);
  const userOrders = orders.filter(o => o.userId === currentUser.id);

  const handleConfirmCancel = () => {
    if (!cancellingItem) return;
    
    const { id, type } = cancellingItem;
    if (type === 'class') onUpdateBooking(id, { status: 'cancelled' });
    else if (type === 'block') onUpdateBlockBooking(id, { status: 'cancelled' });
    else if (type === 'membership') onUpdateUserMembership(id, { status: 'cancelled' });
    else if (type === 'order') onUpdateOrder(id, { status: 'cancelled' });
    
    showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} cancelled`, "info");
    setCancellingItem(null);
    setViewingDetail(null);
  };

  const getRefundPolicy = () => {
    const currentFacility = cancellingItem ? facilities.find(f => f.id === cancellingItem.facilityId) : null;
    if (!currentFacility?.settings) return "";
    const s = currentFacility.settings;
    if (cancellingItem?.type === 'class') return s.refundPolicyClasses;
    if (cancellingItem?.type === 'order') return s.refundPolicyOrders;
    if (cancellingItem?.type === 'membership') return s.refundPolicyMemberships;
    if (cancellingItem?.type === 'block') return s.refundPolicyBlocks;
    return "";
  };

  const handleAttemptAction = (id: string, type: 'class' | 'block' | 'membership' | 'order', facilityId: string, isAllowed: boolean) => {
    if (!isAllowed) {
      const msgMap: Record<string, string> = {
        class: 'Cancel booking',
        block: 'Cancel program',
        membership: 'Cancel membership',
        order: 'Cancel order'
      };
      showToast(`${msgMap[type] || 'Action'} is not allowed for this facility`, 'warning');
      return;
    }
    setCancellingItem({ id, type, facilityId });
  };

  const SummaryCard = ({ title, sub, icon: Icon, status, item, type, facilityId }: any) => {
    const fac = facilities.find(f => f.id === facilityId);
    const paymentStatus = item.paymentStatus;
    
    return (
      <div className="bg-white rounded-[32px] border border-slate-100 p-6 shadow-sm flex flex-col gap-4 group active:scale-[0.98] transition-all cursor-pointer" onClick={() => setViewingDetail({ type, item })}>
         <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
               <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-900 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Icon className="w-6 h-6" />
               </div>
               <div className="text-left overflow-hidden max-w-[150px]">
                  <h4 className="font-black text-slate-900 text-lg leading-none mb-1 uppercase tracking-tight truncate">{title}</h4>
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest truncate">{fac?.name}</p>
               </div>
            </div>
            <div className="flex flex-col items-end gap-1.5">
               <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase border ${
                  status === 'upcoming' || status === 'active' || status === 'placed' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                  status === 'delivered' || status === 'picked-up' ? 'bg-green-50 text-green-700 border-green-100' :
                  'bg-red-50 text-red-700 border-red-200'
               }`}>{status}</span>
               {paymentStatus === 'refunded' && (
                 <span className="flex items-center gap-1 text-[8px] font-black text-red-600 uppercase tracking-widest bg-red-50 px-1.5 py-0.5 rounded border border-red-100">
                   <RefreshCcw className="w-2.5 h-2.5" /> Refunded
                 </span>
               )}
            </div>
         </div>
         <div className="flex items-center justify-between pt-2 border-t border-slate-50">
            <div className="flex items-center gap-1.5">
               <Eye className="w-3.5 h-3.5 text-slate-300" />
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Audit Full Record</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
         </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden text-left relative">
      <div className="bg-white p-6 pt-12 border-b border-slate-100 shrink-0">
        <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase leading-none">Hub Portfolio</h2>
        
        <div className="flex bg-slate-100 p-1 rounded-2xl mt-6 overflow-x-auto scrollbar-hide">
          {(['classes', 'blocks', 'memberships', 'orders'] as const).map(t => (
            <button key={t} onClick={() => setActiveTab(t)} className={`flex-1 min-w-[90px] py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === t ? 'bg-white text-black shadow-sm' : 'text-slate-400'}`}>
              {t}
            </button>
          ))}
        </div>

        {activeTab === 'classes' && (
          <div className="flex gap-8 mt-6">
            {(['upcoming', 'past'] as const).map(t => (
              <button key={t} onClick={() => setActiveHistoryTab(t)} className={`text-[11px] font-black uppercase tracking-widest pb-3 transition-all relative ${activeHistoryTab === t ? 'text-blue-600' : 'text-slate-400'}`}>
                {t}
                {activeHistoryTab === t && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full" />}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4 pb-32 scrollbar-hide">
        {activeTab === 'classes' && (
          (activeHistoryTab === 'upcoming' ? upcomingBookings : pastBookings).length > 0 ? (
            (activeHistoryTab === 'upcoming' ? upcomingBookings : pastBookings).map(b => (
              <SummaryCard key={b.id} title={classes.find(c => c.id === b.classId)?.name} status={b.status} icon={Calendar} item={b} type="booking" facilityId={b.facilityId} />
            ))
          ) : <EmptyState icon={Calendar} label="No records" />
        )}

        {activeTab === 'blocks' && (
           userBlockBookings.length > 0 ? userBlockBookings.map(bb => (
              <SummaryCard key={bb.id} title={blocks.find(b => b.id === bb.blockId)?.name} status={bb.status === 'upcoming' ? 'enrolled' : bb.status} icon={Layers} item={bb} type="booking" facilityId={bb.facilityId} />
           )) : <EmptyState icon={Layers} label="No programs" />
        )}

        {activeTab === 'memberships' && (
           userPurchasedMemberships.length > 0 ? userPurchasedMemberships.map(um => (
              <SummaryCard key={um.id} title={um.title} status={Date.now() > um.endDate ? 'expired' : um.status} icon={ShieldCheck} item={um} type="membership" facilityId={um.facilityId} />
           )) : <EmptyState icon={ShieldCheck} label="No memberships" />
        )}

        {activeTab === 'orders' && (
           userOrders.length > 0 ? userOrders.map(o => (
              <SummaryCard key={o.id} title={o.orderNumber} status={o.status} icon={ShoppingBag} item={o} type="order" facilityId={o.facilityId} />
           )) : <EmptyState icon={ShoppingBag} label="No orders" />
        )}
      </div>

      {viewingDetail && (
        <ItemDetailModal 
          type={viewingDetail.type}
          item={viewingDetail.item}
          facility={facilities.find(f => f.id === viewingDetail.item.facilityId)}
          cls={viewingDetail.type === 'booking' ? classes.find(c => c.id === viewingDetail.item.classId) : undefined}
          trainer={viewingDetail.type === 'booking' ? trainers.find(t => t.id === viewingDetail.item.trainerId) : undefined}
          slot={viewingDetail.type === 'booking' ? classSlots.find(s => s.id === viewingDetail.item.slotId) : undefined}
          onClose={() => setViewingDetail(null)}
          actions={
            <>
              {viewingDetail.type === 'booking' && viewingDetail.item.status === 'upcoming' && (
                 <button onClick={() => handleAttemptAction(viewingDetail.item.id, 'class', viewingDetail.item.facilityId, !!facilities.find(f => f.id === viewingDetail.item.facilityId)?.settings?.canCancelBooking)} className="w-full py-4 bg-red-50 text-red-600 rounded-2xl font-black uppercase text-xs tracking-widest border border-red-100 shadow-sm active:scale-95 transition-all">Withdraw Reservation</button>
              )}
              {viewingDetail.type === 'order' && viewingDetail.item.status === 'placed' && (
                 <button onClick={() => handleAttemptAction(viewingDetail.item.id, 'order', viewingDetail.item.facilityId, !!facilities.find(f => f.id === viewingDetail.item.facilityId)?.settings?.canCancelOrder)} className="w-full py-4 bg-red-50 text-red-600 rounded-2xl font-black uppercase text-xs tracking-widest border border-red-100 shadow-sm active:scale-95 transition-all">Cancel Market Order</button>
              )}
            </>
          }
        />
      )}

      {cancellingItem && (
        <div className="absolute inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
           <div className="bg-white rounded-[40px] p-8 text-center space-y-6 max-w-xs shadow-2xl">
             <div className="w-16 h-16 bg-red-100 text-red-600 rounded-[24px] flex items-center justify-center mx-auto shadow-inner"><AlertCircle className="w-8 h-8" /></div>
             <div>
               <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase leading-none mb-3">Confirm Withdrawal?</h3>
               <p className="text-slate-500 text-xs font-medium leading-relaxed mb-4">This action will update the hub ledger. Are you sure?</p>
               {getRefundPolicy() && (
                 <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 text-left">
                    <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest mb-1">Refund Policy Notice</p>
                    <p className="text-[11px] font-bold text-amber-700 leading-tight">{getRefundPolicy()}</p>
                 </div>
               )}
             </div>
             <div className="space-y-3 pt-2">
                <button onClick={handleConfirmCancel} className="w-full py-4 bg-red-600 text-white rounded-2xl font-black shadow-xl uppercase text-sm shadow-red-500/20">Yes, Cancel</button>
                <button onClick={() => setCancellingItem(null)} className="w-full py-4 text-slate-400 font-bold uppercase text-sm">Close</button>
             </div>
           </div>
        </div>
      )}
    </div>
  );
};

const EmptyState = ({ icon: Icon, label }: { icon: any, label: string }) => (
  <div className="py-24 text-center space-y-4">
    <div className="w-16 h-16 bg-white rounded-[40px] flex items-center justify-center mx-auto border border-slate-100 text-slate-200"><Icon className="w-8 h-8" /></div>
    <p className="text-lg font-bold text-slate-400 uppercase text-xs tracking-widest">{label}</p>
  </div>
);

export default MyBookingsView;
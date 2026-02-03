import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, FileText, ChevronRight, Package, MapPin, CheckCircle, Download, Tag, Eye } from 'lucide-react';
import { Order, Facility, User } from '../../types';
import ItemDetailModal from './ItemDetailModal';

interface MyOrdersViewProps {
  currentUser: User | null;
  orders: Order[];
  facilities: Facility[];
}

const MyOrdersView: React.FC<MyOrdersViewProps> = ({ currentUser, orders, facilities }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialView = (location.state as any)?.view || 'orders';
  const [view, setView] = useState<'orders' | 'invoices'>(initialView);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

  if (!currentUser) return null;

  const userOrders = orders.filter(o => o.userId === currentUser.id).sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden text-left relative">
      <div className="bg-white p-6 pt-12 border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate('/app/profile')} className="p-2 hover:bg-slate-100 rounded-xl"><ArrowLeft className="w-5 h-5" /></button>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase">Purchase Portfolio</h2>
        </div>
        <div className="flex gap-8">
          <button onClick={() => setView('orders')} className={`text-[11px] font-black uppercase tracking-widest pb-3 transition-all relative ${view === 'orders' ? 'text-blue-600' : 'text-slate-400'}`}>Orders{view === 'orders' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full" />}</button>
          <button onClick={() => setView('invoices')} className={`text-[11px] font-black uppercase tracking-widest pb-3 transition-all relative ${view === 'invoices' ? 'text-blue-600' : 'text-slate-400'}`}>Invoices{view === 'invoices' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full" />}</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4 pb-32 scrollbar-hide">
        {userOrders.length > 0 ? userOrders.map(order => (
          <button 
            key={order.id} 
            onClick={() => setViewingOrder(order)}
            className="w-full bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-4 group active:scale-[0.98] transition-all"
          >
             <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${view === 'invoices' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-900'}`}>
                {view === 'invoices' ? <FileText className="w-6 h-6" /> : <ShoppingBag className="w-6 h-6" />}
             </div>
             <div className="flex-1 text-left">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{order.orderNumber}</p>
                <h4 className="font-bold text-slate-900 leading-none uppercase text-sm tracking-tight">{new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</h4>
             </div>
             <div className="text-right flex items-center gap-3">
                <div className="hidden sm:block">
                   <p className="font-black text-slate-900 text-sm">${order.total.toFixed(2)}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
             </div>
          </button>
        )) : (
          <div className="py-24 text-center space-y-6">
            <div className="w-20 h-20 bg-white rounded-[40px] flex items-center justify-center mx-auto border border-slate-100 text-slate-200">
               {view === 'invoices' ? <FileText className="w-8 h-8" /> : <ShoppingBag className="w-8 h-8" />}
            </div>
            <p className="text-lg font-bold text-slate-400 uppercase tracking-widest text-xs">No records found.</p>
          </div>
        )}
      </div>

      {viewingOrder && (
        <ItemDetailModal 
          type="order"
          item={viewingOrder}
          facility={facilities.find(f => f.id === viewingOrder.facilityId)}
          onClose={() => setViewingOrder(null)}
          actions={
             view === 'invoices' ? (
                <button className="w-full py-4 border-2 border-slate-200 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors">
                   <Download className="w-4 h-4" /> Export Tax Receipt (PDF)
                </button>
             ) : undefined
          }
        />
      )}
    </div>
  );
};

export default MyOrdersView;
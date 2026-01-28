import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, FileText, ChevronRight, Package, MapPin, CheckCircle, Download, Tag } from 'lucide-react';
import { Order, Facility, User } from '../../types';

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

  if (viewingOrder) {
    return (
      <div className="h-full bg-white flex flex-col animate-in slide-in-from-right duration-300 text-left relative">
        <div className="p-6 pt-12 flex items-center gap-4 border-b border-slate-50">
          <button onClick={() => setViewingOrder(null)} className="p-2 hover:bg-slate-100 rounded-xl"><ArrowLeft className="w-5 h-5" /></button>
          <div className="text-left">
            <h2 className="text-xl font-black tracking-tight">{view === 'invoices' ? 'Tax Invoice' : 'Order Details'}</h2>
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{viewingOrder.orderNumber}</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-10 pb-20 scrollbar-hide">
          <section className={`p-6 rounded-[32px] border ${viewingOrder.status === 'picked-up' ? 'bg-green-50 border-green-100 text-green-600' : 'bg-blue-50 border-blue-100 text-blue-600'}`}>
            <div className="flex items-center gap-4">
              {viewingOrder.status === 'picked-up' ? <CheckCircle className="w-6 h-6" /> : <Package className="w-6 h-6" />}
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Status</p>
                <p className="font-extrabold text-lg uppercase">{viewingOrder.status === 'picked-up' ? 'Picked Up' : 'Order Placed'}</p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Purchased Items</h4>
            <div className="space-y-3">
              {viewingOrder.items.map((item, idx) => (
                <div key={idx} className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="w-12 h-12 bg-white rounded-xl overflow-hidden shrink-0 border border-slate-100">
                    <img src={item.image} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-sm">{item.name}</p>
                    <p className="text-[10px] font-bold text-slate-400">Size: {item.size} • Qty: {item.quantity}</p>
                  </div>
                  <p className="font-black text-slate-900">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-slate-50 rounded-[32px] p-8 border border-slate-100 space-y-4">
             <div className="flex justify-between text-sm font-bold text-slate-500"><span>Subtotal</span><span>${viewingOrder.subtotal.toFixed(2)}</span></div>
             <div className="flex justify-between text-sm font-bold text-slate-500"><span>VAT (5%)</span><span>${viewingOrder.vat.toFixed(2)}</span></div>
             <div className="flex justify-between text-sm font-bold text-slate-500"><span>Service Charge</span><span>${viewingOrder.serviceCharge.toFixed(2)}</span></div>
             <div className="pt-4 border-t border-slate-200 flex justify-between items-center"><span className="text-xl font-black text-slate-900">Paid Total</span><span className="text-2xl font-black text-blue-600">${viewingOrder.total.toFixed(2)}</span></div>
          </section>

          <div className="p-6 bg-slate-900 rounded-[32px] text-white relative overflow-hidden">
             <div className="relative z-10">
               <h5 className="font-black text-lg mb-1">Facility Collection</h5>
               <p className="text-xs text-slate-400 leading-relaxed">Present order ID <b>{viewingOrder.orderNumber}</b> at {facilities.find(f => f.id === viewingOrder.facilityId)?.name || 'the facility'} front desk for collection.</p>
             </div>
             <Tag className="absolute -right-4 -bottom-4 w-20 h-20 text-white/5 rotate-12" />
          </div>

          {view === 'invoices' && (
            <button className="w-full py-4 border-2 border-slate-200 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50">
               <Download className="w-4 h-4" /> Download PDF Invoice
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden text-left relative">
      <div className="bg-white p-6 pt-12 border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate('/app/profile')} className="p-2 hover:bg-slate-100 rounded-xl"><ArrowLeft className="w-5 h-5" /></button>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">Purchase History</h2>
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
                <h4 className="font-bold text-slate-900 leading-none">{new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</h4>
             </div>
             <div className="text-right">
                <p className="font-black text-slate-900">${order.total.toFixed(2)}</p>
                {view === 'orders' && <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded-full ${order.status === 'picked-up' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>{order.status}</span>}
             </div>
             <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
          </button>
        )) : (
          <div className="py-24 text-center space-y-6">
            <div className="w-20 h-20 bg-white rounded-[40px] flex items-center justify-center mx-auto border border-slate-100 text-slate-200">
               {view === 'invoices' ? <FileText className="w-8 h-8" /> : <ShoppingBag className="w-8 h-8" />}
            </div>
            <p className="text-lg font-bold text-slate-400">No {view} found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersView;
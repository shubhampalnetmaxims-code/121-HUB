import React, { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, ClipboardList, Package, Search, Eye, XCircle, Calendar, CheckCircle, Filter, DollarSign, MapPin, ChevronRight, X, Construction, User as UserIcon, Layers } from 'lucide-react';
import { Booking, Facility, Class, Trainer, Location, Order } from '../../types';
import BookingDetailModal from './BookingDetailModal';
import ConfirmationModal from './ConfirmationModal';

interface BookingsOrdersViewProps {
  facilities: Facility[];
  classes: Class[];
  trainers: Trainer[];
  locations: Location[];
  bookings: Booking[];
  orders: Order[];
  onUpdateBooking: (id: string, updates: Partial<Booking>) => void;
  onUpdateOrder: (id: string, updates: Partial<Order>) => void;
  onOpenSidebar: () => void;
}

const BookingsOrdersView: React.FC<BookingsOrdersViewProps> = ({ 
  facilities, classes, trainers, locations, bookings, orders, onUpdateBooking, onUpdateOrder, onOpenSidebar 
}) => {
  const locationState = useLocation();
  const deepLinkState = locationState.state as { 
    filterType?: 'class' | 'block';
    facilityId?: string;
    classId?: string;
    trainerId?: string;
    status?: Booking['status'];
    searchId?: string;
  } | null;

  const [activeMainTab, setActiveMainTab] = useState<'bookings' | 'block-bookings' | 'orders'>(
    deepLinkState?.filterType === 'block' ? 'block-bookings' : 'bookings'
  );
  const [activeStatusTab, setActiveStatusTab] = useState<string>(deepLinkState?.status || 'upcoming');
  const [search, setSearch] = useState(deepLinkState?.searchId || '');
  
  // Filter States
  const [facilityFilter, setFacilityFilter] = useState<string>(deepLinkState?.facilityId || 'all');

  const [viewingBooking, setViewingBooking] = useState<Booking | null>(null);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [confirmingAction, setConfirmingAction] = useState<{ id: string, type: 'booking'|'order', status: string, title: string, message: string } | null>(null);

  const handleFacilityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFacilityFilter(e.target.value);
  };

  const filteredBookings = bookings.filter(b => {
    if (activeMainTab === 'bookings') {
      if (b.type !== 'class') return false;
    } else if (activeMainTab === 'block-bookings') {
      if (b.type !== 'block') return false;
    } else {
      return false;
    }

    if (b.status !== activeStatusTab) return false;
    if (facilityFilter !== 'all' && b.facilityId !== facilityFilter) return false;
    if (search && !b.userName.toLowerCase().includes(search.toLowerCase()) && !b.id.includes(search)) return false;
    return true;
  });

  const filteredOrders = orders.filter(o => {
    if (activeMainTab !== 'orders') return false;
    if (o.status !== activeStatusTab) return false;
    if (facilityFilter !== 'all' && o.facilityId !== facilityFilter) return false;
    if (search && !o.userName.toLowerCase().includes(search.toLowerCase()) && !o.orderNumber.includes(search)) return false;
    return true;
  });

  const handleApplyAction = () => {
    if (!confirmingAction) return;
    if (confirmingAction.type === 'booking') {
      onUpdateBooking(confirmingAction.id, { status: confirmingAction.status as any });
    } else {
      onUpdateOrder(confirmingAction.id, { status: confirmingAction.status as any });
    }
    setConfirmingAction(null);
  };

  return (
    <div className="flex flex-col min-h-screen text-left">
      <header className="bg-white border-b border-slate-200 px-6 py-6 sticky top-0 z-10 lg:mt-14 mt-12 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <button onClick={onOpenSidebar} className="lg:hidden p-2 -ml-2 hover:bg-slate-100 rounded-lg"><Menu className="w-6 h-6" /></button>
            <div className="text-left">
              <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                {activeMainTab === 'bookings' ? 'Standard Reservations' : activeMainTab === 'block-bookings' ? 'Block Bookings' : 'Marketplace Orders'}
              </h2>
              <p className="text-slate-500 text-xs md:text-sm">Global operations and fulfillment.</p>
            </div>
          </div>
          
          <div className="flex bg-slate-100 p-1 rounded-2xl">
            <button 
              onClick={() => { setActiveMainTab('bookings'); setActiveStatusTab('upcoming'); }} 
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeMainTab === 'bookings' ? 'bg-white text-black shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <ClipboardList className="w-4 h-4" /> Bookings
            </button>
            <button 
              onClick={() => { setActiveMainTab('block-bookings'); setActiveStatusTab('upcoming'); }} 
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeMainTab === 'block-bookings' ? 'bg-white text-black shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Layers className="w-4 h-4" /> Blocks
            </button>
            <button 
              onClick={() => { setActiveMainTab('orders'); setActiveStatusTab('placed'); }} 
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeMainTab === 'orders' ? 'bg-white text-black shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Package className="w-4 h-4" /> Orders
            </button>
          </div>
        </div>
      </header>

      <div className="p-4 md:p-8 space-y-6 pb-32">
        <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm space-y-4">
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
             <select value={facilityFilter} onChange={handleFacilityChange} className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none"><option value="all">All Facilities</option>{facilities.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}</select>
             <div className="relative col-span-2"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input type="text" placeholder="Search by name, email or number..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none text-sm font-medium" /></div>
           </div>
        </div>

        <div className="flex border-b border-slate-200 gap-8 overflow-x-auto scrollbar-hide">
          {(activeMainTab === 'bookings' || activeMainTab === 'block-bookings') ? (
            (['upcoming', 'rescheduled', 'cancelled', 'delivered'] as const).map(status => (
              <button key={status} onClick={() => setActiveStatusTab(status)} className={`pb-4 px-2 text-xs font-black uppercase tracking-widest relative ${activeStatusTab === status ? 'text-blue-600' : 'text-slate-400'}`}>{status}{activeStatusTab === status && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full" />}</button>
            ))
          ) : (
            (['placed', 'picked-up'] as const).map(status => (
              <button key={status} onClick={() => setActiveStatusTab(status)} className={`pb-4 px-2 text-xs font-black uppercase tracking-widest relative ${activeStatusTab === status ? 'text-blue-600' : 'text-slate-400'}`}>{status === 'placed' ? 'New Orders' : 'Fulfilled'}{activeStatusTab === status && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full" />}</button>
            ))
          )}
        </div>

        <div className="bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                  <th className="px-8 py-5">{(activeMainTab === 'bookings' || activeMainTab === 'block-bookings') ? 'Participant' : 'Customer'}</th>
                  <th className="px-8 py-5">Identifier</th>
                  <th className="px-8 py-5">Details</th>
                  <th className="px-8 py-5">Revenue</th>
                  <th className="px-8 py-5 text-right">Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {(activeMainTab === 'bookings' || activeMainTab === 'block-bookings') ? (
                  filteredBookings.map(b => (
                    <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-8 py-6"><p className="font-bold text-slate-900">{b.userName}</p><p className="text-[10px] text-slate-400">{b.userEmail}</p></td>
                      <td className="px-8 py-6"><code className="text-[10px] font-mono bg-slate-100 px-2 py-1 rounded">BK-{b.id.substr(0,8).toUpperCase()}</code></td>
                      <td className="px-8 py-6"><p className="font-bold text-xs">{classes.find(c => c.id === b.classId)?.name || 'Bulk Credit'}</p><p className="text-[10px] text-slate-400">{b.startTime} • {new Date(b.bookingDate).toLocaleDateString()}</p></td>
                      <td className="px-8 py-6"><p className="font-black text-slate-900">${b.amount.toFixed(2)}</p></td>
                      <td className="px-8 py-6 text-right"><button onClick={() => setViewingBooking(b)} className="p-2 bg-slate-50 text-slate-400 hover:text-blue-600 rounded-xl transition-all"><Eye className="w-4 h-4" /></button></td>
                    </tr>
                  ))
                ) : (
                  filteredOrders.map(o => (
                    <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-8 py-6"><p className="font-bold text-slate-900">{o.userName}</p><p className="text-[10px] text-slate-400">{o.userEmail}</p></td>
                      <td className="px-8 py-6"><code className="text-[10px] font-mono bg-blue-50 text-blue-600 px-2 py-1 rounded font-black">{o.orderNumber}</code></td>
                      <td className="px-8 py-6"><p className="font-bold text-xs">{o.items.length} Product(s)</p><p className="text-[10px] text-slate-400">{facilities.find(f => f.id === o.facilityId)?.name}</p></td>
                      <td className="px-8 py-6"><p className="font-black text-slate-900">${o.total.toFixed(2)}</p></td>
                      <td className="px-8 py-6 text-right flex justify-end gap-2">
                        {o.status === 'placed' && (
                          <button onClick={() => setConfirmingAction({ id: o.id, type: 'order', status: 'picked-up', title: 'Mark as Picked Up?', message: `This will notify ${o.userName} that their items have been collected.` })} className="p-2 bg-slate-50 text-slate-400 hover:text-green-600 rounded-xl transition-all"><CheckCircle className="w-4 h-4" /></button>
                        )}
                        <button onClick={() => setViewingOrder(o)} className="p-2 bg-slate-50 text-slate-400 hover:text-blue-600 rounded-xl transition-all"><Eye className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))
                )}
                {filteredBookings.length === 0 && activeMainTab !== 'orders' && (
                  <tr><td colSpan={5} className="py-20 text-center font-bold text-slate-300">No records found.</td></tr>
                )}
                {filteredOrders.length === 0 && activeMainTab === 'orders' && (
                  <tr><td colSpan={5} className="py-20 text-center font-bold text-slate-300">No orders found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {viewingOrder && (
        <div className="fixed inset-0 z-[160] overflow-hidden flex items-center justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setViewingOrder(null)}></div>
          <div className="relative h-full w-full max-w-xl bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 text-left">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
               <div><h3 className="text-2xl font-black text-slate-900">Order Detail</h3><p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{viewingOrder.orderNumber}</p></div>
               <button onClick={() => setViewingOrder(null)} className="p-3 bg-white rounded-2xl hover:bg-slate-100 transition-colors shadow-sm"><X className="w-6 h-6" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-10 pb-32 scrollbar-hide">
               <section className="space-y-4">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Customer Info</label>
                 <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 flex items-center gap-5">
                   <div className="w-16 h-16 rounded-[24px] bg-white flex items-center justify-center text-slate-200 border border-slate-100 shrink-0"><UserIcon className="w-8 h-8" /></div>
                   <div><h4 className="text-2xl font-black text-slate-900 tracking-tighter leading-none mb-1">{viewingOrder.userName}</h4><p className="text-slate-500 font-medium text-sm">{viewingOrder.userEmail}</p></div>
                 </div>
               </section>
               <section className="space-y-4">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Inventory Movement</label>
                 <div className="space-y-3">
                   {viewingOrder.items.map((it, idx) => (
                     <div key={idx} className="p-5 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between">
                       <div className="flex items-center gap-4">
                         <img src={it.image} className="w-12 h-12 rounded-xl object-cover border border-slate-200" />
                         <div><p className="font-bold text-slate-900 text-sm">{it.name}</p><p className="text-[10px] font-bold text-slate-400 uppercase">Size: {it.size} • Qty: {it.quantity}</p></div>
                       </div>
                       <p className="font-black text-slate-900">${(it.price * it.quantity).toFixed(2)}</p>
                     </div>
                   ))}
                 </div>
               </section>
               <section className="bg-slate-900 rounded-[32px] p-8 text-white space-y-4">
                  <div className="flex justify-between text-white/60 font-bold"><span>Total Items Cost</span><span>${viewingOrder.subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between text-white/60 font-bold"><span>VAT & Fees</span><span>${(viewingOrder.vat + viewingOrder.serviceCharge).toFixed(2)}</span></div>
                  <div className="pt-4 border-t border-white/10 flex justify-between items-center"><span className="text-xl font-black">Net Total</span><span className="text-2xl font-black text-blue-400">${viewingOrder.total.toFixed(2)}</span></div>
               </section>
               {viewingOrder.status === 'placed' && (
                 <button onClick={() => setConfirmingAction({ id: viewingOrder.id, type: 'order', status: 'picked-up', title: 'Verify Pickup?', message: 'Mark this order as collected by the member.' })} className="w-full py-5 bg-green-600 text-white rounded-[28px] font-black text-lg shadow-2xl shadow-green-600/20 active:scale-95 transition-all">Mark as Picked Up</button>
               )}
            </div>
          </div>
        </div>
      )}

      {viewingBooking && (
        <BookingDetailModal 
          booking={viewingBooking}
          cls={classes.find(c => c.id === viewingBooking.classId)}
          trainer={trainers.find(t => t.id === viewingBooking.trainerId)}
          onClose={() => setViewingBooking(null)}
          onUpdateStatus={(status) => {
            onUpdateBooking(viewingBooking.id, { status });
            setViewingBooking(null);
          }}
        />
      )}

      {confirmingAction && (
        <ConfirmationModal 
          title={confirmingAction.title}
          message={confirmingAction.message}
          confirmText="Apply Update"
          onConfirm={handleApplyAction}
          onCancel={() => setConfirmingAction(null)}
        />
      )}
    </div>
  );
};

export default BookingsOrdersView;
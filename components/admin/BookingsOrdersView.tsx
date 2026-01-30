import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, ClipboardList, Package, Search, Eye, XCircle, Calendar, CheckCircle, Filter, DollarSign, MapPin, ChevronRight, X, Construction, User as UserIcon, Layers, Clock, Ticket, CheckCircle2, TrendingUp } from 'lucide-react';
import { Booking, Facility, Class, Trainer, Location, Order, BlockBooking, BlockWeeklyPayment, Block } from '../../types';
import BookingDetailModal from './BookingDetailModal';
import ConfirmationModal from './ConfirmationModal';

interface BookingsOrdersViewProps {
  facilities: Facility[];
  classes: Class[];
  trainers: Trainer[];
  locations: Location[];
  bookings: Booking[];
  orders: Order[];
  blockBookings: BlockBooking[];
  blockPayments: BlockWeeklyPayment[];
  blocks: Block[];
  onUpdateBooking: (id: string, updates: Partial<Booking>) => void;
  onUpdateOrder: (id: string, updates: Partial<Order>) => void;
  onOpenSidebar: () => void;
}

const BookingsOrdersView: React.FC<BookingsOrdersViewProps> = ({ 
  facilities, classes, trainers, locations, bookings, orders, blockBookings, blockPayments, blocks, onUpdateBooking, onUpdateOrder, onOpenSidebar 
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
  const [activeStatusTab, setActiveStatusTab] = useState<string>(deepLinkState?.status || (deepLinkState?.filterType === 'block' ? 'ongoing' : 'upcoming'));
  const [search, setSearch] = useState(deepLinkState?.searchId || '');
  
  const [facilityFilter, setFacilityFilter] = useState<string>(deepLinkState?.facilityId || 'all');
  const [viewingBooking, setViewingBooking] = useState<Booking | null>(null);
  const [viewingBlockBooking, setViewingBlockBooking] = useState<BlockBooking | null>(null);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [confirmingAction, setConfirmingAction] = useState<{ id: string, type: 'booking'|'order', status: string, title: string, message: string } | null>(null);

  const filteredBookings = bookings.filter(b => {
    if (activeMainTab !== 'bookings') return false;
    if (b.status !== activeStatusTab) return false;
    if (facilityFilter !== 'all' && b.facilityId !== facilityFilter) return false;
    if (search && !b.userName.toLowerCase().includes(search.toLowerCase()) && !b.id.includes(search)) return false;
    return true;
  });

  const filteredBlockBookings = blockBookings.filter(bb => {
    if (activeMainTab !== 'block-bookings') return false;
    if (bb.status !== activeStatusTab) return false;
    if (facilityFilter !== 'all' && bb.facilityId !== facilityFilter) return false;
    if (search && !bb.userName.toLowerCase().includes(search.toLowerCase()) && !bb.id.includes(search)) return false;
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
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 uppercase">Operations Ledger</h2>
              <p className="text-slate-500 text-xs md:text-sm">Transaction and reservation monitoring.</p>
            </div>
          </div>
          
          <div className="flex bg-slate-100 p-1 rounded-2xl">
            <button onClick={() => { setActiveMainTab('bookings'); setActiveStatusTab('upcoming'); }} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeMainTab === 'bookings' ? 'bg-white text-black shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
              <ClipboardList className="w-4 h-4" /> Bookings
            </button>
            <button onClick={() => { setActiveMainTab('block-bookings'); setActiveStatusTab('ongoing'); }} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeMainTab === 'block-bookings' ? 'bg-white text-black shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
              <Layers className="w-4 h-4" /> Blocks
            </button>
            <button onClick={() => { setActiveMainTab('orders'); setActiveStatusTab('placed'); }} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeMainTab === 'orders' ? 'bg-white text-black shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
              <Package className="w-4 h-4" /> Orders
            </button>
          </div>
        </div>
      </header>

      <div className="p-4 md:p-8 space-y-6 pb-32">
        <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm space-y-4">
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
             <select value={facilityFilter} onChange={e => setFacilityFilter(e.target.value)} className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none"><option value="all">All Facilities</option>{facilities.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}</select>
             <div className="relative col-span-2"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input type="text" placeholder="Search by name, email or ID..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none text-sm font-medium" /></div>
           </div>
        </div>

        <div className="flex border-b border-slate-200 gap-8 overflow-x-auto scrollbar-hide">
          {activeMainTab === 'bookings' && (['upcoming', 'rescheduled', 'cancelled', 'delivered'] as const).map(status => (
            <button key={status} onClick={() => setActiveStatusTab(status)} className={`pb-4 px-2 text-xs font-black uppercase tracking-widest relative ${activeStatusTab === status ? 'text-blue-600' : 'text-slate-400'}`}>{status}{activeStatusTab === status && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full" />}</button>
          ))}
          {activeMainTab === 'block-bookings' && (['upcoming', 'ongoing', 'completed', 'cancelled'] as const).map(status => (
            <button key={status} onClick={() => setActiveStatusTab(status)} className={`pb-4 px-2 text-xs font-black uppercase tracking-widest relative ${activeStatusTab === status ? 'text-blue-600' : 'text-slate-400'}`}>{status}{activeStatusTab === status && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full" />}</button>
          ))}
          {activeMainTab === 'orders' && (['placed', 'picked-up'] as const).map(status => (
            <button key={status} onClick={() => setActiveStatusTab(status)} className={`pb-4 px-2 text-xs font-black uppercase tracking-widest relative ${activeStatusTab === status ? 'text-blue-600' : 'text-slate-400'}`}>{status === 'placed' ? 'New Orders' : 'Fulfilled'}{activeStatusTab === status && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full" />}</button>
          ))}
        </div>

        <div className="bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            {activeMainTab === 'block-bookings' ? (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                    <th className="px-8 py-5">Block & User</th>
                    <th className="px-8 py-5">Start Date / Weeks</th>
                    <th className="px-8 py-5">Payment Status</th>
                    <th className="px-8 py-5">Economic Value</th>
                    <th className="px-8 py-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-medium">
                  {filteredBlockBookings.map(bb => {
                    const block = blocks.find(b => b.id === bb.blockId);
                    const fac = facilities.find(f => f.id === bb.facilityId);
                    const trn = trainers.find(t => t.id === bb.trainerId);
                    const payments = blockPayments.filter(p => p.blockBookingId === bb.id);
                    const paidAmount = payments.filter(p => p.status === 'paid').reduce((acc, c) => acc + c.amount, 0) + (block?.bookingAmount || 0);
                    const totalVal = block?.totalAmount || 0;
                    const paidWeeks = payments.filter(p => p.status === 'paid').length;
                    const totalWeeks = block?.numWeeks || 0;

                    return (
                      <tr key={bb.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-8 py-6">
                           <p className="font-bold text-slate-900 uppercase text-xs">{block?.name}</p>
                           <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest mt-1">{bb.userName}</p>
                           <p className="text-[10px] text-slate-400 mt-0.5">{bb.userEmail}</p>
                        </td>
                        <td className="px-8 py-6">
                           <p className="font-bold text-xs">{new Date(bb.startDate).toLocaleDateString()}</p>
                           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Cycle: {totalWeeks} Weeks</p>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-2">
                              <span className="text-[10px] font-black text-slate-900 uppercase">W{paidWeeks}/{totalWeeks} Paid</span>
                              <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden">
                                 <div className="h-full bg-blue-600" style={{ width: `${(paidWeeks/totalWeeks)*100}%` }}></div>
                              </div>
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <p className="font-black text-slate-900 text-sm">${paidAmount.toFixed(2)} <span className="text-[10px] text-slate-300 font-bold">/ ${totalVal.toFixed(2)}</span></p>
                           <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest mt-0.5">{(totalVal - paidAmount).toFixed(2)} Pending</p>
                        </td>
                        <td className="px-8 py-6 text-right">
                           <button onClick={() => setViewingBlockBooking(bb)} className="p-2 bg-slate-50 text-slate-400 hover:text-blue-600 rounded-xl transition-all">
                              <Eye className="w-4 h-4" />
                           </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                    <th className="px-8 py-5">Entity</th>
                    <th className="px-8 py-5">Identity</th>
                    <th className="px-8 py-5">Descriptor</th>
                    <th className="px-8 py-5">Economic Value</th>
                    <th className="px-8 py-5 text-right">Ops</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-medium">
                  {activeMainTab === 'bookings' && filteredBookings.map(b => (
                    <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-8 py-6"><p className="font-bold text-slate-900">{b.userName}</p><p className="text-[10px] text-slate-400">{b.userEmail}</p></td>
                      <td className="px-8 py-6"><code className="text-[10px] font-mono bg-slate-100 px-2 py-1 rounded">BK-{b.id.substr(0,8).toUpperCase()}</code></td>
                      <td className="px-8 py-6"><p className="font-bold text-xs">{classes.find(c => c.id === b.classId)?.name || 'Class'}</p><p className="text-[10px] text-slate-400">{b.startTime} • {new Date(b.bookingDate).toLocaleDateString()}</p></td>
                      <td className="px-8 py-6 font-black text-slate-900">${b.amount.toFixed(2)}</td>
                      <td className="px-8 py-6 text-right"><button onClick={() => setViewingBooking(b)} className="p-2 bg-slate-50 text-slate-400 hover:text-blue-600 rounded-xl transition-all"><Eye className="w-4 h-4" /></button></td>
                    </tr>
                  ))}
                  {activeMainTab === 'orders' && filteredOrders.map(o => (
                    <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-8 py-6"><p className="font-bold text-slate-900">{o.userName}</p><p className="text-[10px] text-slate-400">{o.userEmail}</p></td>
                      <td className="px-8 py-6"><code className="text-[10px] font-mono bg-slate-100 px-2 py-1 rounded">{o.orderNumber}</code></td>
                      <td className="px-8 py-6"><p className="font-bold text-xs">{o.items.length} Products</p><p className="text-[10px] text-slate-400">{facilities.find(f => f.id === o.facilityId)?.name}</p></td>
                      <td className="px-8 py-6 font-black text-slate-900">${o.total.toFixed(2)}</td>
                      <td className="px-8 py-6 text-right"><button onClick={() => setViewingOrder(o)} className="p-2 bg-slate-50 text-slate-400 hover:text-blue-600 rounded-xl transition-all"><Eye className="w-4 h-4" /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {(activeMainTab === 'bookings' ? filteredBookings : activeMainTab === 'block-bookings' ? filteredBlockBookings : filteredOrders).length === 0 && (
              <div className="py-24 text-center text-slate-300 font-bold italic uppercase text-sm tracking-widest">
                No records found matching criteria
              </div>
            )}
          </div>
        </div>
      </div>

      {viewingBlockBooking && (
        <div className="fixed inset-0 z-[160] overflow-hidden flex items-center justify-end">
           <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setViewingBlockBooking(null)}></div>
           <div className="relative h-full w-full max-w-xl bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 text-left">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                 <div>
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Block Specification</h3>
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Enrollment Ref: {viewingBlockBooking.id}</p>
                 </div>
                 <button onClick={() => setViewingBlockBooking(null)} className="p-3 bg-white rounded-2xl hover:bg-slate-100 shadow-sm transition-colors"><X className="w-6 h-6" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-8 space-y-10 pb-32 scrollbar-hide">
                 {/* Program Header */}
                 <section className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl">
                    <div className="relative z-10">
                       <div className="flex justify-between items-start mb-6">
                          <div className="p-3 bg-white/10 rounded-2xl"><Layers className="w-8 h-8 text-blue-400" /></div>
                          <div className="text-right">
                             <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Status</p>
                             <span className="px-3 py-1 bg-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest">{viewingBlockBooking.status}</span>
                          </div>
                       </div>
                       <h4 className="text-3xl font-black tracking-tighter leading-none mb-2 uppercase">{blocks.find(b => b.id === viewingBlockBooking.blockId)?.name}</h4>
                       <div className="flex flex-wrap gap-4 pt-4 border-t border-white/10">
                          <div className="flex items-center gap-2 text-xs font-bold text-white/60">
                             <MapPin className="w-3.5 h-3.5" /> {facilities.find(f => f.id === viewingBlockBooking.facilityId)?.name}
                          </div>
                          <div className="flex items-center gap-2 text-xs font-bold text-white/60">
                             <UserIcon className="w-3.5 h-3.5" /> {trainers.find(t => t.id === viewingBlockBooking.trainerId)?.name}
                          </div>
                       </div>
                    </div>
                    <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"></div>
                 </section>

                 {/* User Info Card */}
                 <section className="space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Participant Account</label>
                    <div className="flex items-center gap-5 p-6 bg-slate-50 rounded-[32px] border border-slate-100">
                       <div className="w-16 h-16 rounded-[24px] bg-white flex items-center justify-center text-slate-200 border border-slate-100 shadow-sm shrink-0">
                         <UserIcon className="w-8 h-8" />
                       </div>
                       <div className="text-left overflow-hidden">
                          <h4 className="text-2xl font-black text-slate-900 tracking-tighter truncate leading-none mb-1">{viewingBlockBooking.userName}</h4>
                          <p className="text-slate-500 text-sm font-medium">{viewingBlockBooking.userEmail}</p>
                       </div>
                    </div>
                 </section>

                 {/* Progressive Payment Ledger */}
                 <section className="space-y-4">
                    <div className="flex justify-between items-center px-1">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Financial Ledger</label>
                       <div className="flex items-center gap-1.5 text-[10px] font-black text-blue-600 uppercase tracking-widest">
                          <TrendingUp className="w-3 h-3" /> Progressive Billing
                       </div>
                    </div>
                    
                    <div className="space-y-3">
                       {/* Initial Deposit Entry */}
                       <div className="p-5 bg-white border-2 border-slate-100 rounded-[28px] flex justify-between items-center relative overflow-hidden">
                          <div className="flex items-center gap-4 relative z-10">
                             <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600"><DollarSign className="w-5 h-5" /></div>
                             <div>
                                <p className="font-black text-slate-900 text-sm">INITIAL BOOKING DEPOSIT</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase">Processed: {new Date(viewingBlockBooking.createdAt).toLocaleDateString()}</p>
                             </div>
                          </div>
                          <div className="text-right relative z-10">
                             <p className="font-black text-slate-900">${blocks.find(b => b.id === viewingBlockBooking.blockId)?.bookingAmount.toFixed(2)}</p>
                             <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-200">CONFIRMED</span>
                          </div>
                          <CheckCircle2 className="absolute -right-2 -bottom-2 w-16 h-16 text-green-500 opacity-5" />
                       </div>

                       {/* Weekly Installments */}
                       {blockPayments.filter(p => p.blockBookingId === viewingBlockBooking.id).map(p => (
                         <div key={p.id} className="p-5 bg-slate-50 rounded-[28px] border border-slate-100 flex justify-between items-center group hover:bg-white hover:border-blue-100 transition-all">
                            <div className="flex items-center gap-4">
                               <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs border ${p.status === 'paid' ? 'bg-green-50 border-green-100 text-green-600' : 'bg-white border-slate-100 text-slate-400'}`}>
                                  W{p.weekNumber}
                               </div>
                               <div>
                                  <p className="font-bold text-sm text-slate-900 uppercase tracking-tight">Weekly Installment</p>
                                  <p className="text-[10px] text-slate-400 font-bold uppercase">
                                     {p.status === 'paid' ? `Paid on ${new Date(p.paidAt!).toLocaleDateString()}` : `Due on ${new Date(p.dueDate).toLocaleDateString()}`}
                                  </p>
                               </div>
                            </div>
                            <div className="text-right">
                               <p className="font-black text-slate-900">${p.amount.toFixed(2)}</p>
                               <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${p.status === 'paid' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-amber-100 text-amber-700 border border-amber-200'}`}>{p.status}</span>
                            </div>
                         </div>
                       ))}
                    </div>
                 </section>
                 
                 <div className="p-8 bg-blue-950 rounded-[40px] text-white flex justify-between items-center">
                    <div>
                       <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-2">Cycle Valuation</p>
                       <p className="text-3xl font-black text-blue-400">
                          ${(blockPayments.filter(p => p.blockBookingId === viewingBlockBooking.id && p.status === 'paid').reduce((acc, c) => acc + c.amount, 0) + (blocks.find(b => b.id === viewingBlockBooking.blockId)?.bookingAmount || 0)).toFixed(2)}
                          <span className="text-sm font-bold text-white/20 ml-2">Total Paid</span>
                       </p>
                    </div>
                    <CheckCircle2 className="w-10 h-10 text-blue-400 opacity-20" />
                 </div>
              </div>
              
              <div className="p-8 pt-0 border-t border-slate-50 bg-white/80 backdrop-blur-md sticky bottom-0 z-10 flex flex-col gap-3">
                 <button onClick={() => setViewingBlockBooking(null)} className="w-full py-5 bg-black text-white rounded-[28px] font-black text-lg shadow-2xl active:scale-95 transition-all">Close Perspective</button>
              </div>
           </div>
        </div>
      )}

      {viewingBooking && (
        <BookingDetailModal booking={viewingBooking} cls={classes.find(c => c.id === viewingBooking.classId)} trainer={trainers.find(t => t.id === viewingBooking.trainerId)} onClose={() => setViewingBooking(null)} onUpdateStatus={(s) => { onUpdateBooking(viewingBooking.id, { status: s }); setViewingBooking(null); }} />
      )}

      {viewingOrder && (
        <div className="fixed inset-0 z-[160] overflow-hidden flex items-center justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setViewingOrder(null)}></div>
          <div className="relative h-full w-full max-w-xl bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 text-left">
             <div className="p-8 border-b border-slate-100 flex justify-between items-center"><h3 className="text-2xl font-black text-slate-900 uppercase">Order Profile</h3><button onClick={() => setViewingOrder(null)} className="p-3 bg-slate-50 rounded-2xl transition-colors"><X className="w-6 h-6" /></button></div>
             <div className="flex-1 overflow-y-auto p-8 space-y-6">
                <p className="text-sm font-bold text-slate-500">Order Ref: {viewingOrder.orderNumber}</p>
                {viewingOrder.items.map((it, idx) => (
                  <div key={idx} className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <img src={it.image} className="w-12 h-12 rounded-xl object-cover" />
                    <div><p className="font-bold text-slate-900">{it.name}</p><p className="text-[10px] text-slate-400 font-bold uppercase">QTY: {it.quantity}</p></div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      )}

      {confirmingAction && (
        <ConfirmationModal title={confirmingAction.title} message={confirmingAction.message} confirmText="Execute" onConfirm={handleApplyAction} onCancel={() => setConfirmingAction(null)} />
      )}
    </div>
  );
};

export default BookingsOrdersView;

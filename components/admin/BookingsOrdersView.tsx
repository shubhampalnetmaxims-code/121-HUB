
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
            <button onClick={onOpenSidebar} className="lg:hidden p-2 -ml-2 hover:bg-slate-100 rounded-md"><Menu className="w-6 h-6" /></button>
            <div className="text-left">
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 uppercase tracking-tight">Operations Ledger</h2>
              <p className="text-slate-500 text-xs font-medium">Transaction and reservation monitoring dashboard.</p>
            </div>
          </div>
          
          <div className="flex bg-slate-100 p-1 rounded-md">
            <button onClick={() => { setActiveMainTab('bookings'); setActiveStatusTab('upcoming'); }} className={`px-5 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeMainTab === 'bookings' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
              <ClipboardList className="w-3.5 h-3.5" /> Bookings
            </button>
            <button onClick={() => { setActiveMainTab('block-bookings'); setActiveStatusTab('ongoing'); }} className={`px-5 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeMainTab === 'block-bookings' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
              <Layers className="w-3.5 h-3.5" /> Blocks
            </button>
            <button onClick={() => { setActiveMainTab('orders'); setActiveStatusTab('placed'); }} className={`px-5 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeMainTab === 'orders' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
              <Package className="w-3.5 h-3.5" /> Orders
            </button>
          </div>
        </div>
      </header>

      <div className="p-4 md:p-8 space-y-6 pb-32">
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-4">
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
             <select value={facilityFilter} onChange={e => setFacilityFilter(e.target.value)} className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-[10px] font-black uppercase tracking-widest outline-none focus:bg-white transition-all"><option value="all">All Facilities</option>{facilities.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}</select>
             <div className="relative col-span-2"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input type="text" placeholder="Search by name, email or Transaction ID..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md outline-none text-xs font-bold focus:bg-white transition-all" /></div>
           </div>
        </div>

        <div className="flex border-b border-slate-200 gap-8 overflow-x-auto scrollbar-hide px-2">
          {activeMainTab === 'bookings' && (['upcoming', 'rescheduled', 'cancelled', 'delivered'] as const).map(status => (
            <button key={status} onClick={() => setActiveStatusTab(status)} className={`pb-4 px-1 text-[10px] font-black uppercase tracking-widest relative transition-all ${activeStatusTab === status ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>{status}{activeStatusTab === status && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />}</button>
          ))}
          {activeMainTab === 'block-bookings' && (['upcoming', 'ongoing', 'completed', 'cancelled'] as const).map(status => (
            <button key={status} onClick={() => setActiveStatusTab(status)} className={`pb-4 px-1 text-[10px] font-black uppercase tracking-widest relative transition-all ${activeStatusTab === status ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>{status}{activeStatusTab === status && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />}</button>
          ))}
          {activeMainTab === 'orders' && (['placed', 'picked-up'] as const).map(status => (
            <button key={status} onClick={() => setActiveStatusTab(status)} className={`pb-4 px-1 text-[10px] font-black uppercase tracking-widest relative transition-all ${activeStatusTab === status ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>{status === 'placed' ? 'New Orders' : 'Fulfilled'}{activeStatusTab === status && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />}</button>
          ))}
        </div>

        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            {activeMainTab === 'block-bookings' ? (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] border-b border-slate-200">
                    <th className="px-8 py-5">Block Identity</th>
                    <th className="px-8 py-5">Lifecycle Phase</th>
                    <th className="px-8 py-5">Enrollment Status</th>
                    <th className="px-8 py-5">Valuation</th>
                    <th className="px-8 py-5 text-right">Ops</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredBlockBookings.map(bb => {
                    const block = blocks.find(b => b.id === bb.blockId);
                    const payments = blockPayments.filter(p => p.blockBookingId === bb.id);
                    const paidAmount = payments.filter(p => p.status === 'paid').reduce((acc, c) => acc + c.amount, 0) + (block?.bookingAmount || 0);
                    const totalVal = block?.totalAmount || 0;
                    const paidWeeks = payments.filter(p => p.status === 'paid').length;
                    const totalWeeks = block?.numWeeks || 0;

                    return (
                      <tr key={bb.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-8 py-6">
                           <p className="font-bold text-slate-900 uppercase text-xs tracking-tight">{block?.name}</p>
                           <p className="text-[9px] text-blue-600 font-black uppercase tracking-widest mt-1">{bb.userName}</p>
                        </td>
                        <td className="px-8 py-6">
                           <p className="font-bold text-xs uppercase tracking-tight text-slate-700">{new Date(bb.startDate).toLocaleDateString('en-GB', {day:'numeric', month:'short'})}</p>
                           <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{totalWeeks} Week Cycle</p>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex flex-col gap-1.5">
                              <span className="text-[9px] font-black text-slate-900 uppercase tracking-widest">W{paidWeeks} OF {totalWeeks} PAID</span>
                              <div className="w-24 h-1 bg-slate-100 rounded-full overflow-hidden">
                                 <div className="h-full bg-blue-600" style={{ width: `${(paidWeeks/totalWeeks)*100}%` }}></div>
                              </div>
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <p className="font-black text-slate-900 text-sm tracking-tighter">${paidAmount.toFixed(2)} <span className="text-[10px] text-slate-300 font-bold">/ ${totalVal.toFixed(2)}</span></p>
                           <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest mt-0.5">PEEKING ${(totalVal - paidAmount).toFixed(2)}</p>
                        </td>
                        <td className="px-8 py-6 text-right">
                           <button onClick={() => setViewingBlockBooking(bb)} className="p-2 bg-slate-50 text-slate-400 hover:text-slate-900 border border-slate-200 rounded-md transition-all shadow-xs">
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
                  <tr className="bg-slate-50 text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] border-b border-slate-200">
                    <th className="px-8 py-5">Subscriber</th>
                    <th className="px-8 py-5">Ref ID</th>
                    <th className="px-8 py-5">Context</th>
                    <th className="px-8 py-5">Economic Value</th>
                    <th className="px-8 py-5 text-right">Ops</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {activeMainTab === 'bookings' && filteredBookings.map(b => (
                    <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-6"><p className="font-bold text-slate-900 uppercase text-xs tracking-tight">{b.userName}</p><p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{b.userEmail}</p></td>
                      <td className="px-8 py-6"><code className="text-[9px] font-mono bg-slate-100 px-2 py-0.5 border border-slate-200 rounded-sm text-slate-500">BK-{b.id.substr(0,8).toUpperCase()}</code></td>
                      <td className="px-8 py-6"><p className="font-bold text-[10px] uppercase tracking-tight text-slate-700">{classes.find(c => c.id === b.classId)?.name || 'Session'}</p><p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{b.startTime} • {new Date(b.bookingDate).toLocaleDateString()}</p></td>
                      <td className="px-8 py-6 font-black text-slate-900 text-sm tracking-tighter">${b.amount.toFixed(2)}</td>
                      <td className="px-8 py-6 text-right"><button onClick={() => setViewingBooking(b)} className="p-2 bg-slate-50 text-slate-400 hover:text-slate-900 border border-slate-200 rounded-md transition-all shadow-xs"><Eye className="w-4 h-4" /></button></td>
                    </tr>
                  ))}
                  {activeMainTab === 'orders' && filteredOrders.map(o => (
                    <tr key={o.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-6"><p className="font-bold text-slate-900 uppercase text-xs tracking-tight">{o.userName}</p><p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{o.userEmail}</p></td>
                      <td className="px-8 py-6"><code className="text-[9px] font-mono bg-slate-100 px-2 py-0.5 border border-slate-200 rounded-sm text-slate-500">{o.orderNumber}</code></td>
                      <td className="px-8 py-6"><p className="font-bold text-[10px] uppercase tracking-tight text-slate-700">{o.items.length} Units</p><p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{facilities.find(f => f.id === o.facilityId)?.name}</p></td>
                      <td className="px-8 py-6 font-black text-slate-900 text-sm tracking-tighter">${o.total.toFixed(2)}</td>
                      <td className="px-8 py-6 text-right"><button onClick={() => setViewingOrder(o)} className="p-2 bg-slate-50 text-slate-400 hover:text-slate-900 border border-slate-200 rounded-md transition-all shadow-xs"><Eye className="w-4 h-4" /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {(activeMainTab === 'bookings' ? filteredBookings : activeMainTab === 'block-bookings' ? filteredBlockBookings : filteredOrders).length === 0 && (
              <div className="py-24 text-center text-slate-300 font-black uppercase text-[10px] tracking-[0.4em] italic bg-slate-50/20">
                Zero Ledger Records
              </div>
            )}
          </div>
        </div>
      </div>

      {viewingBlockBooking && (
        <div className="fixed inset-0 z-[160] overflow-hidden flex items-center justify-end">
           <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setViewingBlockBooking(null)}></div>
           <div className="relative h-full w-full max-w-xl bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 text-left border-l border-slate-200">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                 <div>
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Block Specification</h3>
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Ref: {viewingBlockBooking.id}</p>
                 </div>
                 <button onClick={() => setViewingBlockBooking(null)} className="p-2 bg-white rounded-md hover:bg-slate-200 shadow-sm transition-colors border border-slate-200"><X className="w-5 h-5" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-8 space-y-10 pb-32 scrollbar-hide">
                 <section className="bg-slate-900 rounded-lg p-8 text-white relative overflow-hidden shadow-md">
                    <div className="relative z-10">
                       <div className="flex justify-between items-start mb-6">
                          <div className="p-3 bg-white/10 rounded-md border border-white/10"><Layers className="w-6 h-6 text-blue-400" /></div>
                          <div className="text-right">
                             <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Status</p>
                             <span className="px-3 py-1 bg-blue-600 rounded-sm text-[9px] font-black uppercase tracking-widest border border-blue-700">{viewingBlockBooking.status}</span>
                          </div>
                       </div>
                       <h4 className="text-2xl font-black tracking-tight leading-none mb-2 uppercase">{blocks.find(b => b.id === viewingBlockBooking.blockId)?.name}</h4>
                       <div className="flex flex-wrap gap-4 pt-4 border-t border-white/10 mt-2">
                          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/50">
                             <MapPin className="w-3 h-3" /> {facilities.find(f => f.id === viewingBlockBooking.facilityId)?.name}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/50">
                             <UserIcon className="w-3 h-3" /> {trainers.find(t => t.id === viewingBlockBooking.trainerId)?.name}
                          </div>
                       </div>
                    </div>
                    <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"></div>
                 </section>

                 <section className="space-y-4">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Subscriber Account</label>
                    <div className="flex items-center gap-5 p-6 bg-slate-50 rounded-lg border border-slate-200 shadow-xs">
                       <div className="w-14 h-14 rounded-lg bg-white flex items-center justify-center text-slate-200 border border-slate-200 shadow-sm shrink-0">
                         <UserIcon className="w-7 h-7" />
                       </div>
                       <div className="text-left overflow-hidden">
                          <h4 className="text-xl font-black text-slate-900 tracking-tight truncate uppercase leading-none mb-1">{viewingBlockBooking.userName}</h4>
                          <p className="text-slate-500 text-xs font-bold uppercase tracking-tight opacity-70">{viewingBlockBooking.userEmail}</p>
                       </div>
                    </div>
                 </section>

                 <section className="space-y-4">
                    <div className="flex justify-between items-center px-1">
                       <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Financial Leger</label>
                    </div>
                    
                    <div className="space-y-2">
                       <div className="p-5 bg-white border border-slate-200 rounded-md flex justify-between items-center relative overflow-hidden">
                          <div className="flex items-center gap-4 relative z-10">
                             <div className="w-9 h-9 rounded-md bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100"><DollarSign className="w-4 h-4" /></div>
                             <div>
                                <p className="font-black text-slate-900 text-[10px] uppercase tracking-widest">INITIAL BOOKING DEPOSIT</p>
                                <p className="text-[8px] text-slate-400 font-bold uppercase">PROCESSED: {new Date(viewingBlockBooking.createdAt).toLocaleDateString()}</p>
                             </div>
                          </div>
                          <div className="text-right relative z-10">
                             <p className="font-black text-slate-900 text-sm tracking-tighter">${blocks.find(b => b.id === viewingBlockBooking.blockId)?.bookingAmount.toFixed(2)}</p>
                             <span className="text-[7px] font-black uppercase px-2 py-0.5 rounded-sm bg-green-100 text-green-700 border border-green-200">CONFIRMED</span>
                          </div>
                       </div>

                       {blockPayments.filter(p => p.blockBookingId === viewingBlockBooking.id).map(p => (
                         <div key={p.id} className="p-4 bg-slate-50 rounded-md border border-slate-200 flex justify-between items-center group hover:bg-white transition-all">
                            <div className="flex items-center gap-4">
                               <div className={`w-8 h-8 rounded-sm flex items-center justify-center font-black text-[9px] border ${p.status === 'paid' ? 'bg-green-50 border-green-200 text-green-600' : 'bg-white border-slate-200 text-slate-300'}`}>
                                  W{p.weekNumber}
                               </div>
                               <div>
                                  <p className="font-black text-[10px] text-slate-900 uppercase tracking-tight">Weekly Installment</p>
                                  <p className="text-[8px] text-slate-400 font-bold uppercase">
                                     {p.status === 'paid' ? `Paid: ${new Date(p.paidAt!).toLocaleDateString()}` : `Due: ${new Date(p.dueDate).toLocaleDateString()}`}
                                  </p>
                               </div>
                            </div>
                            <div className="text-right">
                               <p className="font-black text-slate-900 text-xs">${p.amount.toFixed(2)}</p>
                               <span className={`text-[7px] font-black uppercase px-1.5 py-0.5 rounded-sm ${p.status === 'paid' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-amber-100 text-amber-700 border border-amber-200'}`}>{p.status}</span>
                            </div>
                         </div>
                       ))}
                    </div>
                 </section>
                 
                 <div className="p-8 bg-slate-900 rounded-lg text-white flex justify-between items-center shadow-md">
                    <div>
                       <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40 mb-2">Cycle Valuation</p>
                       <p className="text-2xl font-black text-blue-400 tracking-tighter">
                          ${(blockPayments.filter(p => p.blockBookingId === viewingBlockBooking.id && p.status === 'paid').reduce((acc, c) => acc + c.amount, 0) + (blocks.find(b => b.id === viewingBlockBooking.blockId)?.bookingAmount || 0)).toFixed(2)}
                          <span className="text-xs font-bold text-white/20 ml-2 uppercase">Processed Total</span>
                       </p>
                    </div>
                    <CheckCircle2 className="w-8 h-8 text-blue-400 opacity-20" />
                 </div>
              </div>
              
              <div className="p-8 pt-0 border-t border-slate-50 bg-white/90 backdrop-blur-sm sticky bottom-0 z-10">
                 <button onClick={() => setViewingBlockBooking(null)} className="w-full py-4 bg-slate-900 text-white rounded-md font-black text-xs uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all">Dismiss Detail View</button>
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
          <div className="relative h-full w-full max-w-xl bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 text-left border-l border-slate-200">
             <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50"><h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Order Profile</h3><button onClick={() => setViewingOrder(null)} className="p-2 bg-white rounded-md hover:bg-slate-200 border border-slate-200 shadow-sm transition-colors"><X className="w-5 h-5" /></button></div>
             <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Transaction Ref: {viewingOrder.orderNumber}</p>
                <div className="space-y-3">
                  {viewingOrder.items.map((it, idx) => (
                    <div key={idx} className="flex gap-4 p-4 bg-slate-50 rounded-md border border-slate-200 shadow-xs">
                      <img src={it.image} className="w-12 h-12 rounded-sm object-cover border border-slate-200 shadow-xs" />
                      <div className="flex-1">
                        <p className="font-bold text-slate-900 text-sm uppercase tracking-tight leading-none mb-1">{it.name}</p>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Qty: {it.quantity} • Size: {it.size}</p>
                      </div>
                      <p className="font-black text-slate-900 text-sm">${(it.price * it.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                
                <div className="p-6 bg-slate-50 border border-slate-200 rounded-md space-y-2">
                   <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest"><span>Valuation</span><span>${viewingOrder.subtotal.toFixed(2)}</span></div>
                   <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest"><span>Surcharge</span><span>${(viewingOrder.vat + viewingOrder.serviceCharge).toFixed(2)}</span></div>
                   <div className="pt-4 border-t border-slate-200 flex justify-between items-end">
                      <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Economic Total</span>
                      <span className="text-xl font-black text-blue-600 tracking-tighter">${viewingOrder.total.toFixed(2)}</span>
                   </div>
                </div>
             </div>
             <div className="p-8 pt-0 sticky bottom-0 bg-white/90 backdrop-blur-sm">
                <button onClick={() => setViewingOrder(null)} className="w-full py-4 bg-slate-900 text-white rounded-md font-black text-xs uppercase tracking-[0.2em] shadow-md">Dismiss Review</button>
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
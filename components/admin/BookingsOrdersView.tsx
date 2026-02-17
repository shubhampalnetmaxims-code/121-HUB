import React, { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, Search, Eye, Filter, MapPin, ChevronRight, User as UserIcon, Calendar, Users, BookOpen, Clock, ShieldCheck, RefreshCcw, Layers, ShoppingBag, Package, X, Check, Info, Ban, AlertCircle } from 'lucide-react';
import { Booking, Facility, Class, Trainer, Location, Order, UserMembership, ClassSlot, BlockBooking, Block, BlockWeeklyPayment } from '../../types';
import BookingDetailModal from './BookingDetailModal';
import OrderDetailModal from './OrderDetailModal';
import RescheduleBookingModal from './RescheduleBookingModal';
import { useToast } from '../ToastContext';
import { useNotifications } from '../NotificationContext';

interface BookingsOrdersViewProps {
  facilities: Facility[];
  classes: Class[];
  trainers: Trainer[];
  locations: Location[];
  bookings: Booking[];
  orders: Order[];
  classSlots: ClassSlot[];
  blockBookings: BlockBooking[];
  blockPayments: BlockWeeklyPayment[];
  blocks: Block[];
  userMemberships: UserMembership[];
  onUpdateBooking: (id: string, updates: Partial<Booking>) => void;
  onUpdateOrder: (id: string, updates: Partial<Order>) => void;
  onUpdateUserMembership: (id: string, updates: Partial<UserMembership>) => void;
  onOpenSidebar: () => void;
  onUpdateBlockBooking: (id: string, updates: Partial<BlockBooking>) => void;
}

const BookingsOrdersView: React.FC<BookingsOrdersViewProps> = ({ 
  facilities = [], 
  classes = [], 
  trainers = [], 
  locations = [], 
  bookings = [], 
  orders = [],
  classSlots = [], 
  blockBookings = [],
  blockPayments = [],
  blocks = [],
  userMemberships = [], 
  onUpdateBooking, onUpdateOrder, onUpdateUserMembership, onOpenSidebar, onUpdateBlockBooking
}) => {
  const { showToast } = useToast();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();
  const locationState = useLocation();
  const deepLinkState = locationState.state as any;

  const [activeMainTab, setActiveMainTab] = useState<'bookings' | 'orders'>(
    (deepLinkState?.filterType === 'order' ? 'orders' : 'bookings')
  );

  const getDefaultStatus = (tab: string) => {
    if (tab === 'orders') return 'placed';
    return 'upcoming';
  };

  const [activeStatusTab, setActiveStatusTab] = useState<string>(deepLinkState?.status || getDefaultStatus(activeMainTab));
  
  // Filters
  const [search, setSearch] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>('all');
  const [facilityFilter, setFacilityFilter] = useState<string>('all');
  
  // Nested Filters (Only if facility is selected)
  const [classFilter, setClassFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [trainerFilter, setTrainerFilter] = useState<string>('all');

  const [viewingBooking, setViewingBooking] = useState<Booking | null>(null);
  const [reschedulingBooking, setReschedulingBooking] = useState<Booking | null>(null);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [pickupOrder, setPickupOrder] = useState<Order | null>(null);
  const [pickupNote, setPickupNote] = useState('');
  const [showPickupNoteModal, setShowPickupNoteModal] = useState<string | null>(null);

  // Derived available nested options based on selected facility
  const availableClasses = useMemo(() => 
    facilityFilter === 'all' ? [] : (classes || []).filter(c => c.facilityId === facilityFilter),
  [classes, facilityFilter]);

  const availableLocations = useMemo(() => 
    facilityFilter === 'all' ? [] : (locations || []).filter(l => l.facilityIds.includes(facilityFilter)),
  [locations, facilityFilter]);

  const availableTrainers = useMemo(() => 
    facilityFilter === 'all' ? [] : (trainers || []).filter(t => t.facilityIds.includes(facilityFilter)),
  [trainers, facilityFilter]);

  const filteredBookings = useMemo(() => {
    return (bookings || []).filter(b => {
      if (activeMainTab !== 'bookings') return false;
      if (b.status !== activeStatusTab) return false;
      
      if (facilityFilter !== 'all' && b.facilityId !== facilityFilter) return false;
      if (paymentStatusFilter !== 'all' && (b.paymentStatus || 'paid') !== paymentStatusFilter) return false;
      
      if (facilityFilter !== 'all') {
        if (classFilter !== 'all' && b.classId !== classFilter) return false;
        if (locationFilter !== 'all' && b.locationId !== locationFilter) return false;
        if (trainerFilter !== 'all' && b.trainerId !== trainerFilter) return false;
      }

      if (search) {
        const query = search.toLowerCase();
        const matches = b.userName.toLowerCase().includes(query) || 
                        b.userEmail.toLowerCase().includes(query) || 
                        (b.transactionId && b.transactionId.toLowerCase().includes(query));
        if (!matches) return false;
      }
      return true;
    });
  }, [bookings, activeMainTab, activeStatusTab, facilityFilter, paymentStatusFilter, classFilter, locationFilter, trainerFilter, search]);

  const filteredOrders = (orders || []).filter(o => {
    if (activeMainTab !== 'orders') return false;
    if (o.status !== activeStatusTab) return false;
    if (facilityFilter !== 'all' && o.facilityId !== facilityFilter) return false;
    if (paymentStatusFilter !== 'all' && (o.paymentStatus || 'paid') !== paymentStatusFilter) return false;
    if (search && !o.userName.toLowerCase().includes(search.toLowerCase()) && !o.userEmail.toLowerCase().includes(search.toLowerCase()) && !o.orderNumber.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const getPaymentBadgeColor = (status?: string) => {
    switch (status) {
      case 'paid': return 'bg-green-50 text-green-700 border-green-100';
      case 'processing': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'refunded': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'pending': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'failed': return 'bg-red-50 text-red-700 border-red-100';
      case 'completed': return 'bg-green-50 text-green-600 border-green-100';
      default: return 'bg-slate-50 text-slate-400 border-slate-100';
    }
  };

  const handleFacilityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFacilityFilter(e.target.value);
    setClassFilter('all');
    setLocationFilter('all');
    setTrainerFilter('all');
  };

  const handleConfirmPickup = () => {
    if (pickupOrder) {
      onUpdateOrder(pickupOrder.id, { status: 'picked-up', pickupNote });
      setPickupOrder(null);
      setPickupNote('');
      showToast('Order marked as picked up', 'success');
    }
  };

  const handleCancelOrder = (order: Order) => {
    // Logic: 48 hours since createdAt for refund eligibility
    const timeSinceOrder = Date.now() - order.createdAt;
    const isEligible = timeSinceOrder <= (48 * 60 * 60 * 1000);
    
    const updates: Partial<Order> = { status: 'cancelled', cancelledAt: Date.now() };
    if (isEligible && order.paymentStatus === 'paid') {
      updates.paymentStatus = 'refunded';
    }
    
    onUpdateOrder(order.id, updates);
    showToast(`Order cancelled. ${isEligible ? 'Refund processed.' : 'Non-refundable.'}`, 'info');
  };

  const handleConfirmReschedule = (slot: ClassSlot, newTimestamp: number) => {
    if (!reschedulingBooking) return;
    
    const originalDate = reschedulingBooking.originalBookingDate || reschedulingBooking.bookingDate;
    
    onUpdateBooking(reschedulingBooking.id, {
      slotId: slot.id,
      trainerId: slot.trainerId,
      locationId: slot.locationId,
      bookingDate: newTimestamp,
      startTime: slot.startTime,
      status: 'rescheduled',
      originalBookingDate: originalDate
    });

    const cls = classes.find(c => c.id === slot.classId);
    addNotification(
      'Session Rescheduled',
      `Your ${cls?.name} session has been moved to ${new Date(newTimestamp).toLocaleDateString()} at ${slot.startTime}.`,
      'info',
      reschedulingBooking.userId
    );

    showToast('Booking successfully moved', 'success');
    setReschedulingBooking(null);
    setViewingBooking(null);
  };

  return (
    <div className="flex flex-col min-h-screen text-left font-sans">
      <header className="bg-white border-b border-slate-200 px-6 py-6 sticky top-0 z-10 lg:mt-14 mt-12 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <button onClick={onOpenSidebar} className="lg:hidden p-2 -ml-2 hover:bg-slate-100 rounded-md"><Menu className="w-6 h-6" /></button>
            <div>
              <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Booking Hub</h2>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-0.5">Administrative Unified Ledger</p>
            </div>
          </div>
          
          <div className="flex bg-slate-100 p-1 rounded-lg">
            {(['bookings', 'orders'] as const).map(tab => (
              <button key={tab} onClick={() => { setActiveMainTab(tab); setActiveStatusTab(getDefaultStatus(tab)); }} className={`px-5 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${activeMainTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                {tab === 'bookings' ? 'Classes' : tab}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="p-4 md:p-8 space-y-6 pb-32">
        {/* Advanced Filters */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
               <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
               <input type="text" placeholder="Search Subscriber..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-lg text-xs font-bold outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 transition-all" />
            </div>
            <select value={facilityFilter} onChange={handleFacilityChange} className="px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-lg text-xs font-bold outline-none focus:bg-white transition-all cursor-pointer">
              <option value="all">View All Facilities</option>
              {facilities.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
            <select value={paymentStatusFilter} onChange={e => setPaymentStatusFilter(e.target.value)} className="px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-lg text-xs font-bold outline-none focus:bg-white transition-all cursor-pointer">
              <option value="all">Any Payment Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          {facilityFilter !== 'all' && activeMainTab === 'bookings' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-slate-100 animate-in fade-in slide-in-from-top-2 duration-300">
               <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] px-1 flex items-center gap-1.5"><Filter className="w-3 h-3" /> Class Type</label>
                  <select value={classFilter} onChange={e => setClassFilter(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-lg text-xs font-bold outline-none focus:bg-white transition-colors">
                     <option value="all">All Classes</option>
                     {availableClasses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
               </div>
               <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] px-1 flex items-center gap-1.5"><MapPin className="w-3 h-3" /> Site Location</label>
                  <select value={locationFilter} onChange={e => setLocationFilter(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-lg text-xs font-bold outline-none focus:bg-white transition-colors">
                     <option value="all">All Areas</option>
                     {availableLocations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                  </select>
               </div>
               <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] px-1 flex items-center gap-1.5"><UserIcon className="w-3 h-3" /> Instructor</label>
                  <select value={trainerFilter} onChange={e => setTrainerFilter(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-lg text-xs font-bold outline-none focus:bg-white transition-colors">
                     <option value="all">All Trainers</option>
                     {availableTrainers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
               </div>
            </div>
          )}
        </div>

        {/* Status Sub-tabs */}
        <div className="flex border-b border-slate-200 gap-6">
          {(activeMainTab === 'bookings' ? ['upcoming', 'rescheduled', 'delivered', 'cancelled'] : 
            ['placed', 'picked-up', 'cancelled']).map(status => (
            <button key={status} onClick={() => setActiveStatusTab(status)} className={`pb-3 px-1 text-[10px] font-black uppercase tracking-widest relative transition-all ${activeStatusTab === status ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>
              {status}
              {activeStatusTab === status && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />}
            </button>
          ))}
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm overflow-x-auto">
          <table className="w-full text-left min-w-[1100px]">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] border-b border-slate-200">
                <th className="px-6 py-5">Order ID / Customer</th>
                <th className="px-6 py-5">Hub / Product</th>
                <th className="px-6 py-5">Configuration</th>
                <th className="px-6 py-5">Ledger Value</th>
                <th className="px-6 py-5">Payment / Status</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {activeMainTab === 'bookings' && filteredBookings.map(b => {
                const fac = facilities.find(f => f.id === b.facilityId);
                const cls = classes.find(c => c.id === b.classId);
                const loc = locations.find(l => l.id === b.locationId);

                // Refund Eligibility Logic
                const isCancelled = b.status === 'cancelled';
                const isRefunded = b.paymentStatus === 'refunded';
                let isEligible = false;
                if (isCancelled && !isRefunded) {
                  if (b.cancelledBy === 'trainer' || b.cancelledBy === 'admin') {
                    isEligible = true;
                  } else if (b.cancelledBy === 'customer' && b.cancelledAt) {
                    isEligible = (b.bookingDate - b.cancelledAt) >= (48 * 60 * 60 * 1000);
                  }
                }

                return (
                  <tr key={b.id} className="hover:bg-slate-50/50 cursor-pointer group transition-colors" onClick={() => setViewingBooking(b)}>
                    <td className="px-6 py-5">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 shrink-0">
                             <UserIcon className="w-5 h-5 text-slate-300" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-xs uppercase tracking-tight leading-none mb-1.5">{b.userName}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">{b.userEmail}</p>
                          </div>
                       </div>
                    </td>
                    <td className="px-6 py-5">
                       <div className="space-y-1">
                          <p className="font-black text-slate-700 text-[10px] uppercase tracking-widest leading-none">{cls?.name || 'Class'}</p>
                          <p className="font-black text-blue-600 text-[9px] uppercase tracking-widest leading-none">{fac?.name}</p>
                       </div>
                    </td>
                    <td className="px-6 py-5">
                       <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-900 uppercase">
                             <Calendar className="w-3 h-3 text-slate-300" />
                             {new Date(b.bookingDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                          </div>
                          <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                             <Clock className="w-3 h-3 text-slate-300" />
                             {b.startTime}
                          </div>
                       </div>
                    </td>
                    <td className="px-6 py-5">
                       <p className="font-black text-slate-900 text-xs tracking-tighter leading-none">${(b.amount || 0).toFixed(2)}</p>
                    </td>
                    <td className="px-6 py-5">
                       <div className="space-y-1.5">
                          <span className={`px-1.5 py-0.5 rounded-[4px] text-[8px] font-black uppercase border block w-fit ${getPaymentBadgeColor(b.paymentStatus || 'paid')}`}>{b.paymentStatus || 'Paid'}</span>
                          <span className="text-[8px] font-black text-slate-300 uppercase block tracking-tighter">REF: {b.id.substr(0,10)}</span>
                       </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end items-center" onClick={e => e.stopPropagation()}>
                        {b.status === 'cancelled' ? (
                          isRefunded ? (
                            <span className="text-[9px] font-black text-green-600 uppercase tracking-widest bg-green-50 px-3 py-1.5 rounded-lg border border-green-100 flex items-center gap-2">
                               <ShieldCheck className="w-3 h-3" /> Refunded
                            </span>
                          ) : isEligible ? (
                            <button 
                              onClick={() => {
                                onUpdateBooking(b.id, { paymentStatus: 'refunded' });
                                showToast('Refund initiated successfully', 'success');
                              }}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-sm active:scale-95 transition-all flex items-center gap-2"
                            >
                              <RefreshCcw className="w-3 h-3" /> Initiate Refund
                            </button>
                          ) : (
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                              Ineligible
                            </span>
                          )
                        ) : (
                          <div className="p-2.5 text-slate-300 group-hover:text-blue-600 group-hover:bg-blue-50 transition-all inline-block rounded-xl border border-transparent group-hover:border-blue-100 shadow-xs"><Eye className="w-4 h-4" /></div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {activeMainTab === 'orders' && filteredOrders.map(o => {
                const fac = facilities.find(f => f.id === o.facilityId);
                const primaryItem = o.items[0];
                const totalQty = o.items.reduce((sum, it) => sum + it.quantity, 0);
                
                // Refund Eligibility Logic for Orders: 48 hours from creation
                const isCancelled = o.status === 'cancelled';
                const isRefunded = o.paymentStatus === 'refunded';
                const isEligibleForRefund = (o.cancelledAt || Date.now()) - o.createdAt <= (48 * 60 * 60 * 1000);

                return (
                  <tr key={o.id} className="hover:bg-slate-50/50 cursor-pointer group transition-colors" onClick={() => setViewingOrder(o)}>
                    <td className="px-6 py-5">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 shrink-0">
                             <ShoppingBag className="w-5 h-5 text-blue-500" />
                          </div>
                          <div>
                            <p className="font-mono text-[10px] font-bold text-slate-400 uppercase mb-0.5">{o.orderNumber}</p>
                            <p className="font-bold text-slate-900 text-xs uppercase tracking-tight leading-none">{o.userName}</p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">{o.userEmail}</p>
                          </div>
                       </div>
                    </td>
                    <td className="px-6 py-5">
                       <div className="space-y-1">
                          <p className="font-black text-slate-700 text-[10px] uppercase tracking-widest leading-none truncate max-w-[150px]">
                            {primaryItem?.name || 'Retail Item'}
                            {o.items.length > 1 && <span className="text-blue-600 ml-1">+{o.items.length - 1}</span>}
                          </p>
                          <p className="font-black text-blue-600 text-[9px] uppercase tracking-widest leading-none">{fac?.name}</p>
                       </div>
                    </td>
                    <td className="px-6 py-5">
                       <div className="flex flex-col gap-1">
                          <p className="text-[10px] font-black text-slate-900 uppercase">QTY: {totalQty}</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">SIZE: {primaryItem?.size || 'NA'}</p>
                       </div>
                    </td>
                    <td className="px-6 py-5">
                       <p className="font-black text-slate-900 text-xs tracking-tighter leading-none">${o.total.toFixed(2)}</p>
                       <p className="text-[8px] font-black text-slate-300 uppercase mt-1 tracking-widest">{new Date(o.createdAt).toLocaleDateString()}</p>
                    </td>
                    <td className="px-6 py-5">
                       <div className="space-y-1.5">
                          <span className={`px-1.5 py-0.5 rounded-[4px] text-[8px] font-black uppercase border block w-fit ${getPaymentBadgeColor(o.paymentStatus || 'paid')}`}>{o.paymentStatus || 'Paid'}</span>
                          <span className={`px-1.5 py-0.5 rounded-[4px] text-[8px] font-black uppercase border block w-fit ${
                            o.status === 'placed' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                            o.status === 'picked-up' ? 'bg-green-50 text-green-700 border-green-100' :
                            'bg-red-50 text-red-700 border-red-100'
                          }`}>{o.status}</span>
                       </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                       <div className="flex justify-end gap-2" onClick={e => e.stopPropagation()}>
                          {o.status === 'placed' ? (
                             <>
                                <button 
                                  onClick={() => setPickupOrder(o)}
                                  className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 active:scale-95 transition-all shadow-sm"
                                >
                                   <Package className="w-3.5 h-3.5" /> Pickup
                                </button>
                                <button 
                                  onClick={() => handleCancelOrder(o)}
                                  className="p-2 text-slate-400 hover:text-red-600 border border-slate-100 rounded-lg transition-all"
                                  title="Cancel Order"
                                >
                                   <X className="w-4 h-4" />
                                </button>
                             </>
                          ) : o.status === 'picked-up' ? (
                             <div className="flex items-center gap-2">
                                {o.pickupNote && (
                                   <button 
                                     onClick={() => setShowPickupNoteModal(o.pickupNote || '')}
                                     className="p-2 text-blue-600 bg-blue-50 border border-blue-100 rounded-lg hover:bg-blue-100 transition-all"
                                     title="View Pickup Note"
                                   >
                                      <Info className="w-4 h-4" />
                                   </button>
                                )}
                                <div className="p-2 text-slate-300 group-hover:text-blue-600 transition-all"><Eye className="w-4 h-4" /></div>
                             </div>
                          ) : (
                             <div className="flex flex-col items-end gap-1">
                                {isRefunded ? (
                                   <span className="text-[8px] font-black text-green-600 uppercase bg-green-50 px-2 py-1 rounded border border-green-100">Refunded</span>
                                ) : isEligibleForRefund ? (
                                   <button 
                                     onClick={() => { onUpdateOrder(o.id, { paymentStatus: 'refunded' }); showToast('Refund processed', 'success'); }}
                                     className="px-2 py-1 bg-blue-600 text-white rounded text-[8px] font-black uppercase tracking-widest active:scale-95 transition-all"
                                   >
                                      Initiate Refund
                                   </button>
                                ) : (
                                   <span className="text-[8px] font-black text-slate-400 uppercase bg-slate-50 px-2 py-1 rounded border border-slate-100">Not Eligible</span>
                                )}
                             </div>
                          )}
                       </div>
                    </td>
                  </tr>
                );
              })}

              {(activeMainTab === 'bookings' ? filteredBookings : filteredOrders).length === 0 && (
                <tr><td colSpan={7} className="py-24 text-center text-slate-300 font-black uppercase text-[10px] tracking-[0.4em] italic bg-slate-50/10">Zero Ledger Entries Found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Pickup Note Modal */}
      {pickupOrder && (
         <div className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-300">
               <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto border border-blue-100 shadow-inner">
                     <Package className="w-8 h-8" />
                  </div>
                  <div>
                     <h3 className="text-xl font-bold text-slate-900 uppercase">Confirm Pickup</h3>
                     <p className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-widest">Order: {pickupOrder.orderNumber}</p>
                  </div>
                  <textarea 
                    value={pickupNote}
                    onChange={e => setPickupNote(e.target.value)}
                    placeholder="Enter pickup notes (optional)..."
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 min-h-[100px]"
                  />
                  <div className="grid grid-cols-2 gap-3 pt-2">
                     <button 
                       onClick={() => { setPickupOrder(null); setPickupNote(''); }}
                       className="py-3 text-slate-400 font-black uppercase text-[10px] tracking-widest hover:text-slate-600 transition-colors"
                     >
                        Cancel
                     </button>
                     <button 
                       onClick={handleConfirmPickup}
                       className="py-3 bg-slate-900 text-white rounded-xl font-black uppercase text-[10px] tracking-widest active:scale-95 transition-all shadow-lg"
                     >
                        Confirm Pickup
                     </button>
                  </div>
               </div>
            </div>
         </div>
      )}

      {/* View Note Modal */}
      {showPickupNoteModal && (
         <div className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-300">
               <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
                     <Info className="w-8 h-8" />
                  </div>
                  <div>
                     <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Pickup Information</h3>
                     <div className="mt-4 p-5 bg-slate-50 border border-slate-100 rounded-2xl text-left">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Internal Note</p>
                        <p className="text-xs font-bold text-slate-700 leading-relaxed italic">"{showPickupNoteModal}"</p>
                     </div>
                  </div>
                  <button 
                    onClick={() => setShowPickupNoteModal(null)}
                    className="w-full py-3 bg-slate-900 text-white rounded-xl font-black uppercase text-[10px] tracking-widest active:scale-95 transition-all mt-2"
                  >
                     Close View
                  </button>
               </div>
            </div>
         </div>
      )}

      {viewingBooking && (
        <BookingDetailModal 
          booking={viewingBooking} 
          cls={classes.find(c => c.id === viewingBooking.classId)} 
          trainer={trainers.find(t => t.id === viewingBooking.trainerId)} 
          facility={facilities.find(f => f.id === viewingBooking.facilityId)} 
          location={locations.find(l => l.id === viewingBooking.locationId)}
          onClose={() => setViewingBooking(null)} 
          onUpdateStatus={(s) => { onUpdateBooking(viewingBooking.id, { status: s }); setViewingBooking(null); }} 
          onReschedule={() => { setReschedulingBooking(viewingBooking); setViewingBooking(null); }}
        />
      )}

      {reschedulingBooking && (
        <RescheduleBookingModal
          booking={reschedulingBooking}
          slots={classSlots}
          classes={classes}
          trainers={trainers}
          locations={locations}
          onClose={() => setReschedulingBooking(null)}
          onConfirm={handleConfirmReschedule}
        />
      )}

      {viewingOrder && (
        <OrderDetailModal 
          order={viewingOrder}
          facility={facilities.find(f => f.id === viewingOrder.facilityId)}
          onClose={() => setViewingOrder(null)}
          onUpdateStatus={(status) => onUpdateOrder(viewingOrder.id, { status })}
        />
      )}
    </div>
  );
};

export default BookingsOrdersView;
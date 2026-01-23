
import React, { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, ClipboardList, Package, Search, Eye, XCircle, Calendar, CheckCircle, Filter, DollarSign, MapPin, ChevronRight, X, Construction } from 'lucide-react';
import { Booking, Facility, Class, Trainer, Location } from '../../types';
import BookingDetailModal from './BookingDetailModal';
import ConfirmationModal from './ConfirmationModal';

interface BookingsOrdersViewProps {
  facilities: Facility[];
  classes: Class[];
  trainers: Trainer[];
  locations: Location[];
  bookings: Booking[];
  onUpdateBooking: (id: string, updates: Partial<Booking>) => void;
  onOpenSidebar: () => void;
}

const BookingsOrdersView: React.FC<BookingsOrdersViewProps> = ({ 
  facilities, classes, trainers, locations, bookings, onUpdateBooking, onOpenSidebar 
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

  const [activeMainTab, setActiveMainTab] = useState<'bookings' | 'orders'>('bookings');
  const [activeBookingType, setActiveBookingType] = useState<'class' | 'block'>(deepLinkState?.filterType || 'class');
  const [activeStatusTab, setActiveStatusTab] = useState<Booking['status']>(deepLinkState?.status || 'upcoming');
  const [search, setSearch] = useState(deepLinkState?.searchId || '');
  
  // Filter States
  const [facilityFilter, setFacilityFilter] = useState<string>(deepLinkState?.facilityId || 'all');
  const [classFilter, setClassFilter] = useState<string>(deepLinkState?.classId || 'all');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [trainerFilter, setTrainerFilter] = useState<string>(deepLinkState?.trainerId || 'all');

  const [viewingBooking, setViewingBooking] = useState<Booking | null>(null);
  const [confirmingAction, setConfirmingAction] = useState<{ id: string, status: Booking['status'], title: string, message: string } | null>(null);

  // Dependent Filter Options
  const availableClasses = useMemo(() => {
    if (facilityFilter === 'all') return classes;
    return classes.filter(c => c.facilityId === facilityFilter);
  }, [facilityFilter, classes]);

  const availableLocations = useMemo(() => {
    if (facilityFilter === 'all') return locations;
    return locations.filter(l => l.facilityIds.includes(facilityFilter));
  }, [facilityFilter, locations]);

  const availableTrainers = useMemo(() => {
    if (facilityFilter === 'all') return trainers;
    return trainers.filter(t => t.facilityIds.includes(facilityFilter));
  }, [facilityFilter, trainers]);

  // Reset dependent filters when facility changes
  const handleFacilityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFacilityFilter(e.target.value);
    setClassFilter('all');
    setLocationFilter('all');
    setTrainerFilter('all');
  };

  const clearAllFilters = () => {
    setFacilityFilter('all');
    setClassFilter('all');
    setLocationFilter('all');
    setTrainerFilter('all');
    setSearch('');
    setActiveStatusTab('upcoming');
  };

  const hasActiveFilters = facilityFilter !== 'all' || classFilter !== 'all' || locationFilter !== 'all' || trainerFilter !== 'all' || search !== '' || activeStatusTab !== 'upcoming';

  const filteredBookings = bookings.filter(b => {
    if (b.type !== activeBookingType) return false;
    if (b.status !== activeStatusTab) return false;
    
    if (facilityFilter !== 'all' && b.facilityId !== facilityFilter) return false;
    if (classFilter !== 'all' && b.classId !== classFilter) return false;
    if (locationFilter !== 'all' && b.locationId !== locationFilter) return false;
    if (trainerFilter !== 'all' && b.trainerId !== trainerFilter) return false;

    if (search) {
      const s = search.toLowerCase();
      return b.userName.toLowerCase().includes(s) || b.userEmail.toLowerCase().includes(s) || b.id.toLowerCase().includes(s);
    }
    return true;
  });

  const handleAction = (id: string, status: Booking['status']) => {
    onUpdateBooking(id, { status });
    setConfirmingAction(null);
  };

  return (
    <div className="flex flex-col min-h-screen text-left">
      <header className="bg-white border-b border-slate-200 px-6 py-6 sticky top-0 z-10 lg:mt-14 mt-12 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <button onClick={onOpenSidebar} className="lg:hidden p-2 -ml-2 hover:bg-slate-100 rounded-lg">
              <Menu className="w-6 h-6" />
            </button>
            <div className="text-left">
              {activeMainTab === 'bookings' ? (
                <div className="flex items-center gap-2 group cursor-pointer relative">
                  <select 
                    value={activeBookingType} 
                    onChange={(e) => setActiveBookingType(e.target.value as 'class' | 'block')}
                    className="text-xl md:text-2xl font-bold bg-transparent outline-none cursor-pointer border-none p-0 text-slate-900 pr-10 appearance-none hover:text-blue-600 transition-colors z-10"
                  >
                    <option value="class">Classes Bookings</option>
                    <option value="block">Block Bookings</option>
                  </select>
                  <ChevronRight className="w-5 h-5 absolute right-0 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none group-hover:text-blue-600 transition-colors" />
                </div>
              ) : (
                <h2 className="text-xl md:text-2xl font-bold text-slate-900">Orders Management</h2>
              )}
              <p className="text-slate-500 text-xs md:text-sm">
                {activeMainTab === 'bookings' 
                  ? `Overview of all ${activeBookingType === 'class' ? 'class-based' : 'fixed block'} reservations.` 
                  : 'Fulfillment and tracking for marketplace orders.'
                }
              </p>
            </div>
          </div>
          
          <div className="flex bg-slate-100 p-1 rounded-2xl">
            <button 
              onClick={() => setActiveMainTab('bookings')}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeMainTab === 'bookings' ? 'bg-white text-black shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <ClipboardList className="w-4 h-4" /> Bookings
            </button>
            <button 
              onClick={() => setActiveMainTab('orders')}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeMainTab === 'orders' ? 'bg-white text-black shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Package className="w-4 h-4" /> Orders
            </button>
          </div>
        </div>
      </header>

      <div className="p-4 md:p-8 space-y-6 pb-32">
        {activeMainTab === 'orders' ? (
          <div className="py-24 text-center space-y-6 bg-white rounded-[40px] border border-slate-200 shadow-sm animate-in fade-in duration-500">
            <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto">
              <Package className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900">Orders Module Under Development</h3>
              <p className="text-slate-500 text-sm max-w-md mx-auto mt-2 leading-relaxed">The marketplace fulfillment tracking and order history dashboard is currently being optimized for global release.</p>
            </div>
          </div>
        ) : activeBookingType === 'block' ? (
          <div className="py-24 text-center space-y-6 bg-white rounded-[40px] border border-slate-200 shadow-sm animate-in fade-in duration-500">
            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
              <Construction className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900">Block Bookings Module Under Development</h3>
              <p className="text-slate-500 text-sm max-w-md mx-auto mt-2 leading-relaxed">Advanced multi-session reservation tools and block capacity management are in the final stages of design.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* Filters Row */}
            <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Filter className="w-4 h-4" /> Filter Stack
                </h4>
                {hasActiveFilters && (
                  <button 
                    onClick={clearAllFilters}
                    className="text-[10px] font-black text-red-500 uppercase tracking-widest flex items-center gap-1.5 hover:text-red-600 transition-colors"
                  >
                    <X className="w-3 h-3" /> Clear All Filters
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Facility</label>
                  <select value={facilityFilter} onChange={handleFacilityChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold appearance-none outline-none focus:ring-2 focus:ring-blue-500/20">
                    <option value="all">All Facilities</option>
                    {facilities.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Class</label>
                  <select value={classFilter} onChange={e => setClassFilter(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold appearance-none outline-none focus:ring-2 focus:ring-blue-500/20">
                    <option value="all">All Classes</option>
                    {availableClasses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Location</label>
                  <select value={locationFilter} onChange={e => setLocationFilter(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold appearance-none outline-none focus:ring-2 focus:ring-blue-500/20">
                    <option value="all">All Locations</option>
                    {availableLocations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Trainer</label>
                  <select value={trainerFilter} onChange={e => setTrainerFilter(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold appearance-none outline-none focus:ring-2 focus:ring-blue-500/20">
                    <option value="all">All Trainers</option>
                    {availableTrainers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Status Tabs & Search */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex border-b border-slate-200 gap-8 overflow-x-auto scrollbar-hide shrink-0">
                {(['upcoming', 'rescheduled', 'cancelled', 'delivered'] as const).map(status => (
                  <button
                    key={status}
                    onClick={() => setActiveStatusTab(status)}
                    className={`pb-4 px-2 text-xs font-black uppercase tracking-widest transition-all relative ${
                      activeStatusTab === status ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {status}
                    {activeStatusTab === status && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full" />}
                  </button>
                ))}
              </div>

              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search participant, email or ID..." 
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none text-sm font-medium shadow-sm focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
            </div>

            {/* Booking List */}
            <div className="bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                      <th className="px-8 py-5">Participant</th>
                      <th className="px-8 py-5">Date & Time</th>
                      <th className="px-8 py-5">Service Profile</th>
                      <th className="px-8 py-5">Financials</th>
                      <th className="px-8 py-5">Operations</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredBookings.length > 0 ? filteredBookings.map(b => {
                      const fac = facilities.find(f => f.id === b.facilityId);
                      const cls = classes.find(c => c.id === b.classId);
                      const trn = trainers.find(t => t.id === b.trainerId);
                      return (
                        <tr key={b.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0 uppercase">
                                {b.userName.charAt(0)}
                              </div>
                              <div className="text-left">
                                <p className="font-bold text-slate-900 text-sm leading-tight">{b.userName}</p>
                                <p className="text-[10px] text-slate-400 font-medium truncate max-w-[150px]">{b.userEmail}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6 text-left">
                            <div className="flex items-center gap-2 text-slate-700 text-sm font-bold whitespace-nowrap">
                              <Calendar className="w-4 h-4 text-slate-300" />
                              {new Date(b.bookingDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                            </div>
                            <p className="text-[10px] text-slate-400 font-black uppercase ml-6 tracking-widest">{b.startTime}</p>
                          </td>
                          <td className="px-8 py-6 text-left">
                            <div className="flex items-center gap-1.5 mb-1">
                              <MapPin className="w-3 h-3 text-blue-600" />
                              <span className="text-[9px] font-black text-blue-600 uppercase tracking-tight">{fac?.name || 'Hub'}</span>
                            </div>
                            <p className="font-bold text-slate-900 text-sm">{cls?.name || 'Session'}</p>
                            <div className="flex items-center gap-1.5 mt-1.5">
                               <div className="w-2 h-2 rounded-full" style={{ backgroundColor: trn?.colorCode || '#cbd5e1' }} />
                               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate max-w-[100px]">{trn?.name || 'TBA'}</span>
                            </div>
                          </td>
                          <td className="px-8 py-6 text-left">
                             <div className="flex items-center gap-1 font-black text-slate-900 text-sm">
                               <DollarSign className="w-3.5 h-3.5 text-green-600" />
                               {b.amount.toFixed(2)}
                             </div>
                             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{b.persons} {b.persons > 1 ? 'PERSONS' : 'PERSON'}</p>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <div className="flex justify-end gap-2">
                              <button 
                                onClick={() => setViewingBooking(b)}
                                className="p-2 bg-slate-50 text-slate-400 hover:text-blue-600 rounded-xl transition-all"
                                title="View Detail Profile"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              {b.status !== 'cancelled' && b.status !== 'delivered' && (
                                <>
                                  <button 
                                    onClick={() => setConfirmingAction({ id: b.id, status: 'delivered', title: 'Mark as Delivered?', message: 'Confirm that this service session has been successfully completed for the member.' })}
                                    className="p-2 bg-slate-50 text-slate-400 hover:text-green-600 rounded-xl transition-all"
                                    title="Mark Delivered"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                  </button>
                                  <button 
                                    onClick={() => setConfirmingAction({ id: b.id, status: 'cancelled', title: 'Cancel Booking?', message: 'Are you sure you want to cancel this reservation? This record will be archived as cancelled.' })}
                                    className="p-2 bg-slate-50 text-slate-400 hover:text-red-500 rounded-xl transition-all"
                                    title="Cancel Reservation"
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    }) : (
                      <tr>
                        <td colSpan={5} className="py-24 text-center">
                          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-200">
                            <ClipboardList className="w-8 h-8" />
                          </div>
                          <p className="font-bold text-slate-400 uppercase text-xs tracking-widest italic">No matching booking records found.</p>
                          {hasActiveFilters && <button onClick={clearAllFilters} className="mt-4 text-xs font-black text-blue-600 uppercase underline">Reset Filter stack</button>}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {viewingBooking && (
        <BookingDetailModal 
          booking={viewingBooking}
          cls={classes.find(c => c.id === viewingBooking.classId)}
          trainer={trainers.find(t => t.id === viewingBooking.trainerId)}
          onClose={() => setViewingBooking(null)}
          onUpdateStatus={(status) => {
            handleAction(viewingBooking.id, status);
            setViewingBooking(null);
          }}
        />
      )}

      {confirmingAction && (
        <ConfirmationModal 
          title={confirmingAction.title}
          message={confirmingAction.message}
          confirmText="Apply Status"
          variant={confirmingAction.status === 'cancelled' ? 'danger' : 'primary'}
          onConfirm={() => handleAction(confirmingAction.id, confirmingAction.status)}
          onCancel={() => setConfirmingAction(null)}
        />
      )}
    </div>
  );
};

export default BookingsOrdersView;

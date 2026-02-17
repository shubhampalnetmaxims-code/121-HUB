import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, User, Mail, Phone, ShieldCheck, Ban, Trash2, Menu, Calendar, 
  CreditCard, Clock, MapPin, ChevronRight, X, Activity, Image as ImageIcon, 
  Coins, Gift, TrendingUp, TrendingDown, Scale, Ruler, Star, ShieldAlert, 
  ShoppingBag, Ticket, Info, History, DollarSign, Quote, BookOpen, MessageSquare,
  Package, Layers, CheckCircle2, AlertTriangle, RefreshCcw
} from 'lucide-react';
import { User as UserType, Booking, Class, Facility, Order, UserPass, UserMembership, BlockBooking, BlockWeeklyPayment, Block, Measurement, PhotoLog, RewardTransaction, Trainer } from '../../types';
import { useToast } from '../ToastContext';
import ConfirmationModal from './ConfirmationModal';

interface UserDetailViewProps {
  users: UserType[];
  bookings: Booking[];
  classes: Class[];
  facilities: Facility[];
  orders: Order[];
  userPasses: UserPass[];
  userMemberships: UserMembership[];
  blockBookings: BlockBooking[];
  blockPayments: BlockWeeklyPayment[];
  blocks: Block[];
  measurements: Measurement[];
  photoLogs: PhotoLog[];
  rewardTransactions: RewardTransaction[];
  trainers: Trainer[];
  onUpdateUser: (id: string, updates: Partial<UserType>) => void;
  onDeleteUser: (id: string) => void;
  onOpenSidebar: () => void;
}

type TabType = 'details' | 'health' | 'rewards' | 'bookings' | 'membership' | 'blocks' | 'marketplace' | 'passes';

const PassUsageModal = ({ pass, usage, onClose, classes, facilities }: { pass: UserPass, usage: Booking[], onClose: () => void, classes: Class[], facilities: Facility[] }) => {
  return (
    <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[80vh]">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 text-left">
          <div className="text-left">
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight text-left">Pass Consumption Log</h3>
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1 text-left">{pass.name}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-lg transition-colors"><X className="w-5 h-5 text-slate-400" /></button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-0 scrollbar-hide">
          {usage.length > 0 ? (
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 bg-slate-50/30">
                  <th className="py-4 px-6">Event</th>
                  <th className="py-4 px-6">Timestamp</th>
                  <th className="py-4 px-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {usage.map(u => (
                  <tr key={u.id} className="text-sm">
                    <td className="py-4 px-6">
                      <p className="font-bold text-slate-900 uppercase text-xs tracking-tight">{classes.find(c => c.id === u.classId)?.name || 'Session'}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase">{facilities.find(f => f.id === u.facilityId)?.name}</p>
                    </td>
                    <td className="py-4 px-6">
                       <p className="text-xs font-medium text-slate-600">{new Date(u.bookingDate).toLocaleDateString()}</p>
                       <p className="text-[10px] text-slate-400">{u.startTime}</p>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className={`px-2 py-0.5 rounded-sm text-[8px] font-black uppercase border ${
                        u.status === 'upcoming' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                        u.status === 'delivered' ? 'bg-green-50 text-green-700 border-green-100' :
                        'bg-red-50 text-red-700 border-red-100'
                      }`}>
                        {u.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-20 text-center text-slate-300 font-bold uppercase text-[10px] tracking-widest italic">
              Zero usage history recorded for this pass.
            </div>
          )}
        </div>
        
        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <button onClick={onClose} className="px-8 py-2.5 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all">Close Audit</button>
        </div>
      </div>
    </div>
  );
};

const UserDetailView: React.FC<UserDetailViewProps> = ({ 
  users = [], 
  bookings = [], 
  classes = [], 
  facilities = [], 
  orders = [], 
  userPasses = [], 
  userMemberships = [], 
  blockBookings = [], 
  blockPayments = [], 
  blocks = [], 
  measurements = [], 
  photoLogs = [], 
  rewardTransactions = [],
  trainers = [],
  onUpdateUser, 
  onDeleteUser, 
  onOpenSidebar 
}) => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<TabType>('details');
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [viewingPassUsage, setViewingPassUsage] = useState<UserPass | null>(null);

  const user = users.find(u => u.id === userId);

  if (!user) {
    return (
      <div className="p-20 text-center text-slate-400 font-black uppercase text-xs tracking-widest">
        Record Not Found
        <button onClick={() => navigate('/admin/users')} className="block mx-auto mt-6 text-blue-600 underline">Back to Directory</button>
      </div>
    );
  }

  // Data filtering
  const userBookings = bookings.filter(b => b.userId === user.id).sort((a, b) => b.bookingDate - a.bookingDate);
  const userOrders = orders.filter(o => o.userId === user.id).sort((a, b) => b.createdAt - a.createdAt);
  const userPurchasedPasses = userPasses.filter(up => up.userId === user.id).sort((a, b) => b.purchasedAt - a.purchasedAt);
  const userPurchasedMemberships = userMemberships.filter(um => um.userId === user.id).sort((a, b) => b.purchasedAt - a.purchasedAt);
  const userBBookings = blockBookings.filter(bb => bb.userId === user.id).sort((a, b) => b.createdAt - a.createdAt);
  const userMeasurements = measurements.filter(m => m.userId === user.id).sort((a, b) => b.date - a.date);
  const userPhotos = photoLogs.filter(p => p.userId === user.id).sort((a, b) => b.date - a.date);
  const userRTX = rewardTransactions.filter(tx => tx.userId === user.id).sort((a, b) => b.date - a.date);

  const totalPointsEarned = useMemo(() => userRTX.filter(tx => tx.type === 'earned').reduce((acc, tx) => acc + tx.points, 0), [userRTX]);
  const totalPointsUsed = useMemo(() => userRTX.filter(tx => tx.type === 'used').reduce((acc, tx) => acc + tx.points, 0), [userRTX]);
  const totalDollarsRedeemed = (totalPointsUsed / 100);

  const TabButton = ({ id, label, icon: Icon }: { id: TabType, label: string, icon: any }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-6 py-4 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all shrink-0 ${
        activeTab === id ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'
      }`}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
    </button>
  );

  return (
    <div className="flex flex-col min-h-screen text-left bg-slate-50/30">
      <header className="bg-white border-b border-slate-200 px-6 py-6 sticky top-0 z-50 lg:mt-14 mt-12 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 max-w-[1400px] mx-auto w-full">
          <div className="flex items-center gap-4">
            <button onClick={onOpenSidebar} className="lg:hidden p-2 -ml-2 hover:bg-slate-100 rounded-md">
              <Menu className="w-6 h-6" />
            </button>
            <button onClick={() => navigate('/admin/users')} className="p-2 text-slate-400 hover:text-slate-900 border border-transparent hover:border-slate-200 rounded-md transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="overflow-hidden">
               <h2 className="text-xl font-bold text-slate-900 tracking-tight uppercase leading-none">{user.fullName}</h2>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Audit Ledger</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => onUpdateUser(user.id, { status: user.status === 'active' ? 'blocked' : 'active' })}
              className={`px-5 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all ${
                user.status === 'active' ? 'bg-white border-slate-200 text-slate-400 hover:text-red-600' : 'bg-green-50 border-green-100 text-green-700'
              }`}
            >
              {user.status === 'active' ? 'Block Account' : 'Unblock Account'}
            </button>
            <button 
              onClick={() => setIsDeleteConfirmOpen(true)}
              className="px-5 py-2.5 bg-red-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-red-700"
            >
              Purge User
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto w-full p-4 md:p-8 space-y-6">
        {/* Identity Quick Bar */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-6 overflow-hidden">
          <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-100">
            {user.profilePicture ? (
              <img src={user.profilePicture} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-200 bg-slate-50"><User className="w-8 h-8" /></div>
            )}
          </div>
          <div className="flex-1 min-w-0">
             <h3 className="text-lg font-black text-slate-900 uppercase truncate leading-none mb-1">{user.fullName}</h3>
             <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{user.email}</p>
          </div>
          <div className="shrink-0 flex items-center gap-3">
             <span className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest border ${user.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                {user.status}
             </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 overflow-x-auto scrollbar-hide bg-white rounded-t-2xl px-2">
          <TabButton id="details" label="User Details" icon={User} />
          <TabButton id="health" label="Health Data" icon={Activity} />
          <TabButton id="rewards" label="Rewards" icon={Gift} />
          <TabButton id="bookings" label="Bookings" icon={Calendar} />
          <TabButton id="membership" label="Membership" icon={CreditCard} />
          <TabButton id="blocks" label="Blocks" icon={Layers} />
          <TabButton id="marketplace" label="Marketplace" icon={ShoppingBag} />
          <TabButton id="passes" label="Passes" icon={Ticket} />
        </div>

        {/* Tab Content Rendering */}
        <div className="bg-white border border-t-0 border-slate-200 rounded-b-2xl shadow-sm min-h-[500px] overflow-hidden text-left p-8">
          
          {/* 1. User Details */}
          {activeTab === 'details' && (
            <div className="animate-in fade-in duration-300 space-y-10">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-y-10 gap-x-12">
                  <div className="space-y-1.5"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</p><p className="text-xl font-black text-slate-900 uppercase tracking-tight">{user.fullName}</p></div>
                  <div className="space-y-1.5"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</p><p className="text-sm font-bold text-slate-600">{user.email}</p></div>
                  <div className="space-y-1.5"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone Number</p><p className="text-sm font-bold text-slate-600">{user.phone}</p></div>
                  <div className="space-y-1.5"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Registration Date</p><p className="text-sm font-bold text-slate-600">{new Date(user.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p></div>
                  <div className="space-y-1.5"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date of Birth</p><p className="text-sm font-bold text-slate-600">{user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'Not Provided'}</p></div>
                  <div className="space-y-1.5"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gender</p><p className="text-sm font-bold text-slate-600 uppercase tracking-tight">{user.gender}</p></div>
                  {/* Removed Location field as requested */}
               </div>
            </div>
          )}

          {/* 2. Health Data */}
          {activeTab === 'health' && (
            <div className="animate-in fade-in duration-300 space-y-10">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-slate-50/50 rounded-2xl border border-slate-100 overflow-hidden flex flex-col">
                     <div className="p-6 border-b border-slate-100 flex justify-between items-center"><h5 className="text-xs font-black uppercase tracking-widest text-slate-900">Measurement History</h5><Scale className="w-4 h-4 text-slate-300" /></div>
                     <table className="w-full text-left">
                        <thead><tr className="text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50"><th className="py-4 px-6">Date</th><th className="py-4 px-6">Weight</th><th className="py-4 px-6">Body Fat %</th><th className="py-4 px-6">Muscle</th><th className="py-4 px-6">BMI</th></tr></thead>
                        <tbody className="divide-y divide-slate-50">
                           {userMeasurements.length > 0 ? userMeasurements.map(m => (
                             <tr key={m.id} className="text-xs hover:bg-white transition-colors"><td className="py-4 px-6 font-bold text-slate-500">{new Date(m.date).toLocaleDateString()}</td><td className="py-4 px-6 font-black text-slate-900">{m.weight}kg</td><td className="py-4 px-6 font-bold text-blue-600">{m.bodyFatPercentage || '--'}%</td><td className="py-4 px-6 font-bold text-green-600">{m.muscleMass || '--'}kg</td><td className="py-4 px-6 font-bold text-slate-600">{m.bmi}</td></tr>
                           )) : (<tr><td colSpan={5} className="py-20 text-center text-slate-300 uppercase font-black text-[9px] tracking-widest italic">Zero Records</td></tr>)}
                        </tbody>
                     </table>
                  </div>
                  <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-6 overflow-y-auto max-h-[400px] scrollbar-hide">
                     <h5 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-6">Progress Photos</h5>
                     {userPhotos.length > 0 ? (
                       <div className="grid grid-cols-3 gap-3">
                          {userPhotos.map(p => (
                             <div key={p.id} className="aspect-[3/4] rounded-xl overflow-hidden border border-slate-100 shadow-sm relative group cursor-pointer">
                                <img src={p.imageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2"><p className="text-[8px] text-white font-black uppercase">{new Date(p.date).toLocaleDateString()}</p></div>
                             </div>
                          ))}
                       </div>
                     ) : (<div className="py-20 text-center space-y-3"><div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mx-auto text-slate-200 border border-slate-50"><ImageIcon className="w-6 h-6" /></div><p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">No Visual Assets</p></div>)}
                  </div>
               </div>
            </div>
          )}

          {/* 3. Rewards Section */}
          {activeTab === 'rewards' && (
            <div className="animate-in fade-in duration-300 space-y-10">
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden flex flex-col justify-between h-56">
                     <div className="relative z-10 flex justify-between items-start">
                        <div className="p-3 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-md"><Coins className="w-6 h-6 text-blue-400" /></div>
                        <div className="text-right">
                           <p className="text-[8px] font-black uppercase tracking-widest opacity-40">Valuation</p>
                           <p className="text-2xl font-black text-blue-400">${(user.rewardPoints / 100).toFixed(2)}</p>
                        </div>
                     </div>
                     <div className="relative z-10">
                        <p className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-1">Available Wallet Balance</p>
                        <h4 className="text-5xl font-black tracking-tighter leading-none">{user.rewardPoints} <span className="text-sm opacity-30 font-bold ml-1 uppercase">Pts</span></h4>
                     </div>
                     <Gift className="absolute -right-8 -bottom-8 w-40 h-40 text-white/5 rotate-12" />
                  </div>
                  <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4 h-56">
                     <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col justify-center gap-2"><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Earned (Lifetime)</p><p className="text-3xl font-black text-slate-900">{totalPointsEarned}</p><TrendingUp className="w-4 h-4 text-green-500 opacity-30" /></div>
                     <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col justify-center gap-2"><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Used (Lifetime)</p><p className="text-3xl font-black text-slate-900">{totalPointsUsed}</p><TrendingDown className="w-4 h-4 text-red-500 opacity-30" /></div>
                     <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col justify-center gap-2"><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Monetary Redeemed</p><p className="text-3xl font-black text-blue-600">${totalDollarsRedeemed.toFixed(2)}</p><DollarSign className="w-4 h-4 text-blue-600 opacity-30" /></div>
                  </div>
               </div>
               <div className="bg-slate-50/50 rounded-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[300px]">
                  <div className="p-4 border-b border-slate-100 flex justify-between items-center"><h5 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Transaction History</h5><History className="w-4 h-4 text-slate-300" /></div>
                  <div className="flex-1 overflow-y-auto scrollbar-hide">
                     <table className="w-full text-left">
                        <tbody className="divide-y divide-slate-100">
                           {userRTX.length > 0 ? userRTX.map(tx => (
                             <tr key={tx.id} className="text-xs hover:bg-white"><td className="py-3 px-6 text-slate-400 font-bold">{new Date(tx.date).toLocaleDateString()}</td><td className="py-3 px-6 font-bold text-slate-900 uppercase tracking-tight">{tx.source}</td><td className="py-3 px-6"><span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${tx.type === 'earned' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{tx.type}</span></td><td className={`py-3 px-6 text-right font-black ${tx.type === 'earned' ? 'text-green-600' : 'text-red-600'}`}>{tx.type === 'earned' ? '+' : '-'}{tx.points}</td></tr>
                           )) : (<tr><td colSpan={4} className="py-10 text-center text-slate-300 font-bold uppercase text-[9px] italic tracking-widest">Empty Ledger</td></tr>)}
                        </tbody>
                     </table>
                  </div>
               </div>
            </div>
          )}

          {/* 4. Bookings */}
          {activeTab === 'bookings' && (
            <div className="animate-in fade-in duration-300 overflow-x-auto">
               <table className="w-full text-left">
                  <thead><tr className="bg-slate-50 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200"><th className="py-4 px-8">ID</th><th className="py-4 px-8">Class</th><th className="py-4 px-8">Facility</th><th className="py-4 px-8">Date & Time</th><th className="py-4 px-8">Amount</th><th className="py-4 px-8 text-right">Status</th></tr></thead>
                  <tbody className="divide-y divide-slate-100">
                     {userBookings.length > 0 ? userBookings.map(b => (
                       <tr key={b.id} className="text-sm hover:bg-slate-50 transition-colors"><td className="py-5 px-8 font-mono text-[10px] text-slate-400 uppercase tracking-tighter">BK-{b.id.substr(0,12)}</td><td className="py-5 px-8 font-black text-slate-900 uppercase text-xs">{classes.find(c => c.id === b.classId)?.name || 'Session'}</td><td className="py-5 px-8 text-xs font-bold text-blue-600 uppercase">{facilities.find(f => f.id === b.facilityId)?.name}</td><td className="py-5 px-8"><p className="text-xs font-bold text-slate-700">{new Date(b.bookingDate).toLocaleDateString()}</p><p className="text-[10px] font-black text-slate-400 uppercase">{b.startTime}</p></td><td className="py-5 px-8 font-black text-slate-900 text-xs">${b.amount.toFixed(2)}</td><td className="py-5 px-8 text-right"><span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${b.status === 'upcoming' ? 'bg-blue-50 text-blue-700 border-blue-200' : b.status === 'delivered' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>{b.status}</span></td></tr>
                     )) : (<tr><td colSpan={6} className="py-20 text-center text-slate-300 uppercase font-black text-[10px] tracking-widest italic">Zero Roster Records</td></tr>)}
                  </tbody>
               </table>
            </div>
          )}

          {/* 5. Membership */}
          {activeTab === 'membership' && (
            <div className="animate-in fade-in duration-300 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userPurchasedMemberships.length > 0 ? userPurchasedMemberships.map(um => {
                 const isExpired = Date.now() > um.endDate;
                 return (
                    <div key={um.id} className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-6 relative overflow-hidden group shadow-sm">
                       <div className="flex justify-between items-start relative z-10">
                          <div className="space-y-1"><h5 className="text-xl font-black text-slate-900 tracking-tighter uppercase leading-none">{um.title}</h5><p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{facilities.find(f => f.id === um.facilityId)?.name}</p></div>
                          <span className={`px-2.5 py-1 rounded text-[9px] font-black uppercase tracking-widest border ${!isExpired ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>{!isExpired ? 'Active' : 'Expired'}</span>
                       </div>
                       <div className="grid grid-cols-2 gap-4 relative z-10 pt-2 border-t border-slate-100">
                          <div><p className="text-[8px] font-black text-slate-400 uppercase mb-1">Start Date</p><p className="text-xs font-bold text-slate-900">{new Date(um.startDate).toLocaleDateString()}</p></div>
                          <div><p className="text-[8px] font-black text-slate-400 uppercase mb-1">End Date</p><p className="text-xs font-bold text-slate-900">{new Date(um.endDate).toLocaleDateString()}</p></div>
                          <div><p className="text-[8px] font-black text-slate-400 uppercase mb-1">Payment</p><p className="text-[9px] font-black text-slate-900 uppercase">{um.paymentStatus || 'Paid'}</p></div>
                          <div><p className="text-[8px] font-black text-slate-400 uppercase mb-1">Auto-Renew</p><p className={`text-[9px] font-black uppercase ${um.autoRenew ? 'text-green-600' : 'text-slate-400'}`}>{um.autoRenew ? 'On' : 'Off'}</p></div>
                       </div>
                       <CreditCard className="absolute -right-6 -bottom-6 w-24 h-24 text-slate-200/40 rotate-12" />
                    </div>
                 );
              }) : (<div className="col-span-full py-20 text-center"><ShieldAlert className="w-12 h-12 text-slate-200 mx-auto mb-4" /><p className="text-sm font-black uppercase tracking-widest text-slate-300 italic">No Active Membership Records</p></div>)}
            </div>
          )}

          {/* 6. Blocks */}
          {activeTab === 'blocks' && (
            <div className="animate-in fade-in duration-300 grid grid-cols-1 md:grid-cols-2 gap-6">
              {userBBookings.length > 0 ? userBBookings.map(bb => {
                 const block = blocks.find(b => b.id === bb.blockId);
                 const totalSessions = bb.totalSessions || block?.numWeeks || 1;
                 const sessionsUsed = bb.sessionsUsed || 0;
                 const completion = (sessionsUsed / totalSessions) * 100;
                 return (
                    <div key={bb.id} className="bg-slate-50 p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6 relative overflow-hidden">
                       <div className="flex justify-between items-start"><div className="space-y-1"><h5 className="text-xl font-black text-slate-900 tracking-tighter uppercase leading-none">{block?.name || 'Program'}</h5><p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Trainer ID: {bb.trainerId}</p></div><span className={`px-2 py-1 rounded text-[8px] font-black uppercase border ${bb.status === 'ongoing' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>{bb.status}</span></div>
                       <div className="grid grid-cols-3 gap-4 border-y border-slate-200/50 py-6">
                          <div><p className="text-[8px] font-black text-slate-400 uppercase mb-1">Total</p><p className="font-black text-slate-900 text-lg">{totalSessions}</p></div>
                          <div><p className="text-[8px] font-black text-slate-400 uppercase mb-1">Used</p><p className="font-black text-slate-900 text-lg">{sessionsUsed}</p></div>
                          <div><p className="text-[8px] font-black text-slate-400 uppercase mb-1">Remaining</p><p className="font-black text-blue-600 text-lg">{totalSessions - sessionsUsed}</p></div>
                       </div>
                       <div className="space-y-4">
                          <div className="flex justify-between items-end"><div><p className="text-[8px] font-black text-slate-400 uppercase">Valuation</p><p className="text-xl font-black text-slate-900">${block?.totalAmount || '0.00'}</p></div><p className="text-[9px] font-black text-slate-400 uppercase">{bb.bookingAmountPaid ? 'Deposit Paid' : 'Pending'}</p></div>
                          <div className="w-full h-1.5 bg-white rounded-full overflow-hidden shadow-inner"><div className="h-full bg-blue-600 transition-all duration-1000" style={{ width: `${completion}%` }} /></div>
                       </div>
                    </div>
                 );
              }) : (<div className="col-span-full py-20 text-center"><Layers className="w-12 h-12 text-slate-200 mx-auto mb-4" /><p className="text-sm font-black uppercase tracking-widest text-slate-300 italic">Zero Active Blocks</p></div>)}
            </div>
          )}

          {/* 7. Marketplace Orders */}
          {activeTab === 'marketplace' && (
            <div className="animate-in fade-in duration-300 overflow-x-auto">
               <table className="w-full text-left">
                  <thead><tr className="bg-slate-50 text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200"><th className="py-4 px-8">Order #</th><th className="py-4 px-8">Details</th><th className="py-4 px-8">Quantity</th><th className="py-4 px-8">Total Amount</th><th className="py-4 px-8 text-right">Order Status</th></tr></thead>
                  <tbody className="divide-y divide-slate-100">
                     {userOrders.length > 0 ? userOrders.map(o => (
                       <tr key={o.id} className="text-sm hover:bg-slate-50 transition-colors"><td className="py-5 px-8 font-mono text-[10px] text-slate-400 uppercase tracking-tighter">{o.orderNumber}</td><td className="py-5 px-8 font-black text-slate-900 uppercase text-xs">{o.items[0]?.name || 'Retail Item'}{o.items.length > 1 && <span className="text-blue-600 ml-1">+{o.items.length - 1} more</span>}</td><td className="py-5 px-8 font-bold text-slate-500">{o.items.reduce((sum, i) => sum + i.quantity, 0)}</td><td className="py-5 px-8 font-black text-slate-900 text-xs">${o.total.toFixed(2)}</td><td className="py-5 px-8 text-right"><span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${o.status === 'placed' ? 'bg-blue-50 text-blue-700 border-blue-200' : o.status === 'picked-up' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>{o.status}</span></td></tr>
                     )) : (<tr><td colSpan={5} className="py-20 text-center text-slate-300 uppercase font-black text-[10px] tracking-widest italic">Zero Order History</td></tr>)}
                  </tbody>
               </table>
            </div>
          )}

          {/* 8. Passes */}
          {activeTab === 'passes' && (
            <div className="animate-in fade-in duration-300 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userPurchasedPasses.length > 0 ? userPurchasedPasses.map(up => {
                 const creditPercent = (up.remainingCredits / up.totalCredits) * 100;
                 return (
                    <button key={up.id} onClick={() => setViewingPassUsage(up)} className="bg-slate-50 p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6 relative overflow-hidden text-left group active:scale-95 transition-all">
                       <div className="flex justify-between items-start relative z-10"><div className="space-y-1"><h5 className="text-xl font-black text-slate-900 tracking-tighter uppercase leading-none">{up.name}</h5><p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Facility Hub Identity</p></div><ChevronRight className="w-5 h-5 text-slate-300 group-hover:translate-x-1 transition-transform" /></div>
                       <div className="flex justify-between items-end relative z-10"><div><p className="text-[9px] font-black text-slate-400 uppercase mb-1">Credits Remaining</p><h4 className="text-4xl font-black text-slate-900 tracking-tighter">{up.remainingCredits} <span className="text-sm text-slate-300 font-bold">/ {up.totalCredits}</span></h4></div><div className="text-right"><span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase border ${up.status === 'active' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>{up.status}</span></div></div>
                       <div className="pt-4 border-t border-slate-200 relative z-10 grid grid-cols-2 gap-4"><div><p className="text-[8px] font-black text-slate-400 uppercase mb-1">Purchased</p><p className="text-[10px] font-bold text-slate-700">{new Date(up.purchasedAt).toLocaleDateString()}</p></div><div><p className="text-[8px] font-black text-slate-400 uppercase mb-1">Validity</p><p className="text-[10px] font-bold text-slate-700">{up.validityUntil ? new Date(up.validityUntil).toLocaleDateString() : 'LIFETIME'}</p></div></div>
                       <Ticket className="absolute -right-6 -bottom-6 w-32 h-32 text-slate-200/40 rotate-12" />
                    </button>
                 );
              }) : (<div className="col-span-full py-20 text-center"><Ticket className="w-12 h-12 text-slate-200 mx-auto mb-4" /><p className="text-sm font-black uppercase tracking-widest text-slate-300 italic">Zero Active Pass Inventory</p></div>)}
            </div>
          )}

        </div>
      </div>

      {/* Modal Overlays */}
      {viewingPassUsage && (
        <PassUsageModal 
          pass={viewingPassUsage}
          usage={userBookings.filter(b => b.usedPassId === viewingPassUsage.id)}
          classes={classes}
          facilities={facilities}
          onClose={() => setViewingPassUsage(null)}
        />
      )}

      {isDeleteConfirmOpen && (
        <ConfirmationModal
          title="Confirm Purge Node?"
          message={`Delete subscriber "${user.fullName}"? This terminates all metrics, historical ledgers and assets. Action is irreversible.`}
          variant="danger"
          confirmText="Yes, Purge"
          onConfirm={() => {
            onDeleteUser(user.id);
            navigate('/admin/users');
          }}
          onCancel={() => setIsDeleteConfirmOpen(false)}
        />
      )}
    </div>
  );
};

export default UserDetailView;


import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, ShieldCheck, Ban, Trash2, Menu, Calendar, CreditCard, ClipboardList, Clock, MapPin, ChevronRight, ShoppingBag, Ticket, UserCheck, Layers, Package, CheckCircle2, TrendingUp } from 'lucide-react';
import { User as UserType, Booking, Class, Facility, Order, UserPass, BlockBooking, BlockWeeklyPayment, Block } from '../../types';
import { useToast } from '../ToastContext';
import ConfirmationModal from './ConfirmationModal';

interface UserDetailViewProps {
  users: UserType[];
  bookings: Booking[];
  classes: Class[];
  facilities: Facility[];
  orders: Order[];
  userPasses: UserPass[];
  blockBookings: BlockBooking[];
  blockPayments: BlockWeeklyPayment[];
  blocks: Block[];
  onUpdateUser: (id: string, updates: Partial<UserType>) => void;
  onDeleteUser: (id: string) => void;
  onOpenSidebar: () => void;
}

const UserDetailView: React.FC<UserDetailViewProps> = ({ 
  users, bookings, classes, facilities, orders, userPasses, blockBookings, blockPayments, blocks, onUpdateUser, onDeleteUser, onOpenSidebar 
}) => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'profile' | 'bookings' | 'orders' | 'passes' | 'blocks'>('profile');
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const user = users.find(u => u.id === userId);

  if (!user) {
    return (
      <div className="p-20 text-center text-slate-400 font-black uppercase text-xs tracking-widest">
        Record Not Found
        <button onClick={() => navigate('/admin/users')} className="block mx-auto mt-6 text-blue-600 underline">Back to Directory</button>
      </div>
    );
  }

  const userBookings = bookings.filter(b => b.userId === user.id).sort((a, b) => b.bookingDate - a.bookingDate);
  const userOrders = orders.filter(o => o.userId === user.id).sort((a, b) => b.createdAt - a.createdAt);
  const userPurchasedPasses = userPasses.filter(up => up.userId === user.id).sort((a, b) => b.purchasedAt - a.purchasedAt);
  const userBBookings = blockBookings.filter(bb => bb.userId === user.id).sort((a, b) => b.createdAt - a.createdAt);

  const handleDelete = () => {
    onDeleteUser(user.id);
    showToast('Member account deleted', 'info');
    navigate('/admin/users');
  };

  const TabButton = ({ id, label, icon: Icon }: { id: typeof activeTab, label: string, icon: any }) => (
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
    <div className="flex flex-col min-h-screen text-left">
      <header className="bg-white border-b border-slate-200 px-6 py-6 sticky top-0 z-10 lg:mt-14 mt-12 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={onOpenSidebar} className="lg:hidden p-2 -ml-2 hover:bg-slate-100 rounded-md">
            <Menu className="w-6 h-6" />
          </button>
          <button onClick={() => navigate('/admin/users')} className="p-2 text-slate-400 hover:text-slate-900 border border-transparent hover:border-slate-200 rounded-md transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight uppercase">Member Profile Review</h2>
        </div>
      </header>

      <div className="p-4 md:p-8 max-w-6xl w-full mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-6 mb-10 p-8 bg-white border border-slate-200 rounded-lg shadow-sm">
          <div className="w-24 h-24 rounded-lg bg-slate-100 overflow-hidden flex items-center justify-center border border-slate-200 shadow-xs shrink-0">
            {user.profilePicture ? (
              <img src={user.profilePicture} className="w-full h-full object-cover" alt="" />
            ) : (
              <User className="w-10 h-10 text-slate-200" />
            )}
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-2">{user.fullName}</h3>
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-3">
              <span className={`px-2.5 py-0.5 rounded-sm text-[9px] font-black uppercase tracking-[0.2em] border ${
                user.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
              }`}>
                {user.status}
              </span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Enrolled: {new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button 
              onClick={() => onUpdateUser(user.id, { status: user.status === 'active' ? 'blocked' : 'active' })}
              className="flex-1 md:flex-none px-5 py-2.5 bg-white border border-slate-200 text-[10px] font-black uppercase tracking-widest rounded-md hover:bg-slate-50 transition-colors shadow-xs"
            >
              {user.status === 'active' ? 'Suspend Account' : 'Restore Access'}
            </button>
            <button 
              onClick={() => setIsDeleteConfirmOpen(true)}
              className="flex-1 md:flex-none px-5 py-2.5 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-md hover:bg-red-700 transition-colors shadow-md"
            >
              Purge
            </button>
          </div>
        </div>

        <div className="flex border-b border-slate-200 mb-8 overflow-x-auto scrollbar-hide px-1">
          <TabButton id="profile" label="Details" icon={UserCheck} />
          <TabButton id="bookings" label="Reservations" icon={Calendar} />
          <TabButton id="blocks" label="Transformations" icon={Layers} />
          <TabButton id="orders" label="Transactions" icon={ShoppingBag} />
          <TabButton id="passes" label="Bulk Passes" icon={Ticket} />
        </div>

        <div className="bg-white border border-slate-200 rounded-lg min-h-[400px] shadow-sm overflow-hidden">
          {activeTab === 'profile' && (
            <div className="p-10 space-y-10 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
                <div className="space-y-2 text-left">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Full Identification</p>
                  <p className="text-lg font-bold text-slate-900 tracking-tight uppercase">{user.fullName}</p>
                </div>
                <div className="space-y-2 text-left">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Gender Category</p>
                  <p className="text-lg font-bold text-slate-900 tracking-tight uppercase">{user.gender}</p>
                </div>
                <div className="space-y-2 text-left">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Email Address</p>
                  <p className="text-lg font-bold text-slate-900 tracking-tight">{user.email}</p>
                </div>
                <div className="space-y-2 text-left">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Phone Identity</p>
                  <p className="text-lg font-bold text-slate-900 tracking-tight">{user.phone}</p>
                </div>
              </div>
              
              <div className="pt-10 border-t border-slate-100">
                <h4 className="text-[10px] font-black text-slate-900 mb-6 uppercase tracking-[0.3em]">Account Lifecycle Metadata</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-5 bg-slate-50 border border-slate-200 rounded-md shadow-xs">
                    <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest mb-1">Subscriber ID</p>
                    <code className="text-[11px] font-mono font-bold text-slate-600 uppercase tracking-tighter">{user.id}</code>
                  </div>
                  <div className="p-5 bg-slate-50 border border-slate-200 rounded-md shadow-xs">
                    <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest mb-1">Financial State</p>
                    <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{user.paymentMethod === 'added' ? 'Billing Active' : 'No Source'}</p>
                  </div>
                  <div className="p-5 bg-slate-50 border border-slate-200 rounded-md shadow-xs">
                    <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest mb-1">Cards Linked</p>
                    <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{user.paymentCards?.length || 0} SECURE SOURCE</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="overflow-x-auto animate-in fade-in duration-300">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] border-b border-slate-200">
                    <th className="px-8 py-5">Transaction Reference</th>
                    <th className="px-8 py-5">Hub Context</th>
                    <th className="px-8 py-5">Scheduled Phase</th>
                    <th className="px-8 py-5">Value</th>
                    <th className="px-8 py-5">State</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {userBookings.length > 0 ? userBookings.map(b => (
                    <tr key={b.id} className="hover:bg-slate-50/50 transition-colors text-sm">
                      <td className="px-8 py-6 font-mono text-[10px] text-slate-400 tracking-tighter uppercase font-bold">{b.id.substr(0, 12)}</td>
                      <td className="px-8 py-6">
                        <p className="font-bold text-slate-900 uppercase text-xs tracking-tight">{classes.find(c => c.id === b.classId)?.name || 'Credit Unit'}</p>
                        <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-0.5">{facilities.find(f => f.id === b.facilityId)?.name}</p>
                      </td>
                      <td className="px-8 py-6">
                        <p className="font-bold text-slate-700 text-xs uppercase tracking-tight">{new Date(b.bookingDate).toLocaleDateString()}</p>
                        <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{b.startTime}</p>
                      </td>
                      <td className="px-8 py-6 font-black text-slate-900 tracking-tighter">${b.amount.toFixed(2)}</td>
                      <td className="px-8 py-6">
                        <span className={`px-2 py-0.5 rounded-sm text-[8px] font-black uppercase tracking-widest border ${
                          b.status === 'upcoming' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          b.status === 'delivered' ? 'bg-green-50 text-green-700 border-green-200' :
                          'bg-red-50 text-red-700 border-red-200'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan={5} className="py-24 text-center text-slate-300 font-black uppercase text-[10px] tracking-[0.4em] italic bg-slate-50/20">Zero Reservation Records</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'blocks' && (
            <div className="p-8 space-y-10 animate-in fade-in duration-300">
              {userBBookings.length > 0 ? userBBookings.map(bb => {
                const block = blocks.find(b => b.id === bb.blockId);
                const fac = facilities.find(f => f.id === bb.facilityId);
                const payments = blockPayments.filter(p => p.blockBookingId === bb.id).sort((a, b) => a.weekNumber - b.weekNumber);
                const totalPaid = payments.filter(p => p.status === 'paid').length;
                const progress = block ? (totalPaid / block.numWeeks) * 100 : 0;

                return (
                  <div key={bb.id} className="bg-slate-50 border border-slate-200 rounded-lg overflow-hidden shadow-xs">
                    <div className="p-6 bg-white border-b border-slate-100 flex justify-between items-start">
                       <div>
                          <div className="flex items-center gap-2 mb-2">
                             <Layers className="w-4 h-4 text-blue-600" />
                             <span className="text-[9px] font-black text-blue-600 uppercase tracking-[0.2em]">{fac?.name}</span>
                          </div>
                          <h4 className="text-xl font-black text-slate-900 tracking-tight uppercase leading-none">{block?.name}</h4>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">ENROLLMENT: {new Date(bb.createdAt).toLocaleDateString()}</p>
                       </div>
                       <div className="text-right">
                          <span className={`px-2.5 py-1 rounded-sm text-[9px] font-black uppercase tracking-widest border ${bb.status === 'ongoing' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-blue-100 text-blue-700 border-blue-200'}`}>
                             {bb.status}
                          </span>
                       </div>
                    </div>

                    <div className="p-6 grid grid-cols-1 xl:grid-cols-2 gap-10">
                       <section className="space-y-6">
                          <div>
                            <div className="flex justify-between items-end mb-2.5">
                               <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">CYCLE PROGRESSION</p>
                               <p className="text-lg font-black text-slate-900 uppercase">WEEK {totalPaid} <span className="text-xs text-slate-300 font-bold">OF {block?.numWeeks}</span></p>
                            </div>
                            <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                               <div className="h-full bg-blue-600 transition-all duration-1000" style={{ width: `${progress}%` }} />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3 pt-2">
                             <div className="bg-white p-4 rounded-md border border-slate-200 shadow-xs">
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">COMMENCE</p>
                                <p className="font-bold text-slate-900 text-xs uppercase tracking-tight">{new Date(bb.startDate).toLocaleDateString()}</p>
                             </div>
                             <div className="bg-white p-4 rounded-md border border-slate-200 shadow-xs">
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">PARTICIPANTS</p>
                                <p className="font-bold text-slate-900 text-xs">{bb.participantNames.length} PERS</p>
                             </div>
                          </div>
                       </section>

                       <section className="space-y-3">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">FINANCIAL LEDGER</p>
                          <div className="max-h-[220px] overflow-y-auto pr-1 space-y-2 scrollbar-hide">
                             {payments.map(p => (
                               <div key={p.id} className="bg-white p-3.5 rounded-md border border-slate-200 flex justify-between items-center hover:border-slate-300 transition-all shadow-xs">
                                  <div className="flex items-center gap-3">
                                     <div className="w-8 h-8 rounded-sm bg-slate-50 border border-slate-200 flex items-center justify-center font-black text-[9px] text-slate-400">W{p.weekNumber}</div>
                                     <div>
                                        <p className="text-[10px] font-black text-slate-900 uppercase tracking-tight">INSTALLMENT</p>
                                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">DUE: {new Date(p.dueDate).toLocaleDateString()}</p>
                                     </div>
                                  </div>
                                  <div className="text-right">
                                     <p className="font-black text-slate-900 text-xs tracking-tighter">${p.amount.toFixed(2)}</p>
                                     <span className={`text-[7px] font-black uppercase px-1.5 py-0.5 rounded-sm border ${p.status === 'paid' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                                        {p.status}
                                     </span>
                                  </div>
                               </div>
                             ))}
                          </div>
                       </section>
                    </div>
                  </div>
                );
              }) : (
                <div className="py-24 text-center space-y-4">
                   <div className="w-16 h-16 bg-slate-50 text-slate-200 rounded-md flex items-center justify-center mx-auto border border-slate-100">
                      <Layers className="w-8 h-8" />
                   </div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] italic">Zero Program Enrollments</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="overflow-x-auto animate-in fade-in duration-300">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] border-b border-slate-200">
                    <th className="px-8 py-5">Order Reference</th>
                    <th className="px-8 py-5">Context</th>
                    <th className="px-8 py-5">Units</th>
                    <th className="px-8 py-5">Value</th>
                    <th className="px-8 py-5">State</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {userOrders.length > 0 ? userOrders.map(o => (
                    <tr key={o.id} className="hover:bg-slate-50/50 transition-colors text-sm">
                      <td className="px-8 py-6 font-black text-slate-900 uppercase text-xs tracking-tight">{o.orderNumber}</td>
                      <td className="px-8 py-6 text-slate-500 font-bold uppercase text-[10px] tracking-tight">{facilities.find(f => f.id === o.facilityId)?.name}</td>
                      <td className="px-8 py-6 text-slate-900 font-bold text-xs">{o.items.length} ITEMS</td>
                      <td className="px-8 py-6 font-black text-blue-600 tracking-tighter">${o.total.toFixed(2)}</td>
                      <td className="px-8 py-6">
                        <span className={`px-2 py-0.5 rounded-sm text-[8px] font-black uppercase tracking-widest border ${
                          o.status === 'placed' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-green-50 text-green-700 border-green-200'
                        }`}>
                          {o.status === 'placed' ? 'PLACED' : 'FULFILLED'}
                        </span>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan={5} className="py-24 text-center text-slate-300 font-black uppercase text-[10px] tracking-[0.4em] italic bg-slate-50/20">Zero Purchase Records</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'passes' && (
            <div className="overflow-x-auto animate-in fade-in duration-300">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] border-b border-slate-200">
                    <th className="px-8 py-5">Pass Identity</th>
                    <th className="px-8 py-5">Context</th>
                    <th className="px-8 py-5">Credit Balance</th>
                    <th className="px-8 py-5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {userPurchasedPasses.length > 0 ? userPurchasedPasses.map(up => (
                    <tr key={up.id} className="hover:bg-slate-50/50 transition-colors text-sm">
                      <td className="px-8 py-6 font-bold text-slate-900 uppercase text-xs tracking-tight">{up.name}</td>
                      <td className="px-8 py-6 text-slate-500 font-bold uppercase text-[10px] tracking-tight">{facilities.find(f => f.id === up.facilityId)?.name}</td>
                      <td className="px-8 py-6 font-black text-blue-600 tracking-tighter">{up.remainingCredits} <span className="text-[9px] text-slate-300 font-bold">/ {up.totalCredits}</span></td>
                      <td className="px-8 py-6">
                        <span className={`px-2 py-0.5 rounded-sm text-[8px] font-black uppercase tracking-widest border ${
                          up.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
                        }`}>
                          {up.status}
                        </span>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan={4} className="py-24 text-center text-slate-300 font-black uppercase text-[10px] tracking-[0.4em] italic bg-slate-50/20">Zero bulk credits owned</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {isDeleteConfirmOpen && (
        <ConfirmationModal
          title="Purge Subscriber Record?"
          message={`Are you sure you want to permanently delete "${user.fullName}"? All historical data will be lost.`}
          variant="danger"
          confirmText="Purge Account"
          onConfirm={handleDelete}
          onCancel={() => setIsDeleteConfirmOpen(false)}
        />
      )}
    </div>
  );
};

export default UserDetailView;
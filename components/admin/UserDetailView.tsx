import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, ShieldCheck, Ban, Trash2, Menu, Calendar, CreditCard, ClipboardList, Clock, MapPin, ChevronRight, ShoppingBag, Ticket, UserCheck, Layers, Package } from 'lucide-react';
import { User as UserType, Booking, Class, Facility, Order, UserPass } from '../../types';
import { useToast } from '../ToastContext';
import ConfirmationModal from './ConfirmationModal';

interface UserDetailViewProps {
  users: UserType[];
  bookings: Booking[];
  classes: Class[];
  facilities: Facility[];
  orders: Order[];
  userPasses: UserPass[];
  onUpdateUser: (id: string, updates: Partial<UserType>) => void;
  onDeleteUser: (id: string) => void;
  onOpenSidebar: () => void;
}

const UserDetailView: React.FC<UserDetailViewProps> = ({ 
  users, bookings, classes, facilities, orders, userPasses, onUpdateUser, onDeleteUser, onOpenSidebar 
}) => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'profile' | 'bookings' | 'orders' | 'passes'>('profile');
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const user = users.find(u => u.id === userId);

  if (!user) {
    return (
      <div className="p-20 text-center text-slate-400 font-bold">
        User not found.
        <button onClick={() => navigate('/admin/users')} className="block mx-auto mt-4 text-blue-600 underline">Back to Users</button>
      </div>
    );
  }

  const userBookings = bookings.filter(b => b.userId === user.id).sort((a, b) => b.bookingDate - a.bookingDate);
  const userOrders = orders.filter(o => o.userId === user.id).sort((a, b) => b.createdAt - a.createdAt);
  const userPurchasedPasses = userPasses.filter(up => up.userId === user.id).sort((a, b) => b.purchasedAt - a.purchasedAt);

  const handleDelete = () => {
    onDeleteUser(user.id);
    showToast('Member account deleted', 'info');
    navigate('/admin/users');
  };

  const TabButton = ({ id, label, icon: Icon }: { id: typeof activeTab, label: string, icon: any }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-6 py-4 text-sm font-bold border-b-2 transition-all ${
        activeTab === id ? 'border-black text-black' : 'border-transparent text-slate-400 hover:text-slate-600'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );

  return (
    <div className="flex flex-col min-h-screen text-left">
      <header className="bg-white border-b border-slate-200 px-6 py-6 sticky top-0 z-10 lg:mt-14 mt-12">
        <div className="flex items-center gap-4">
          <button onClick={onOpenSidebar} className="lg:hidden p-2 -ml-2 hover:bg-slate-100 rounded-lg">
            <Menu className="w-6 h-6" />
          </button>
          <button onClick={() => navigate('/admin/users')} className="p-2 text-slate-400 hover:text-black">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-bold text-slate-900">User Management</h2>
        </div>
      </header>

      <div className="p-4 md:p-8 max-w-6xl w-full mx-auto">
        {/* Simple Header Profile */}
        <div className="flex items-center gap-6 mb-8 p-4 bg-white border border-slate-200">
          <div className="w-20 h-20 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center border border-slate-200 shrink-0">
            {user.profilePicture ? (
              <img src={user.profilePicture} className="w-full h-full object-cover" alt="" />
            ) : (
              <User className="w-10 h-10 text-slate-300" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-slate-900">{user.fullName}</h3>
            <div className="flex items-center gap-3 mt-1">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                user.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                {user.status}
              </span>
              <span className="text-xs text-slate-400 font-medium">Joined {new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => onUpdateUser(user.id, { status: user.status === 'active' ? 'blocked' : 'active' })}
              className="px-4 py-2 border border-slate-200 text-sm font-bold rounded hover:bg-slate-50"
            >
              {user.status === 'active' ? 'Block User' : 'Unblock User'}
            </button>
            <button 
              onClick={() => setIsDeleteConfirmOpen(true)}
              className="px-4 py-2 bg-red-50 text-red-600 text-sm font-bold rounded hover:bg-red-100"
            >
              Delete
            </button>
          </div>
        </div>

        {/* Tabbed Navigation */}
        <div className="flex border-b border-slate-200 mb-8 overflow-x-auto scrollbar-hide">
          <TabButton id="profile" label="Profile" icon={UserCheck} />
          <TabButton id="bookings" label="Bookings" icon={Calendar} />
          <TabButton id="orders" label="Orders" icon={ShoppingBag} />
          <TabButton id="passes" label="Passes" icon={Ticket} />
        </div>

        {/* Tab Content */}
        <div className="bg-white border border-slate-200 min-h-[400px]">
          {activeTab === 'profile' && (
            <div className="p-8 space-y-8 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                <div className="space-y-1">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Full Name</p>
                  <p className="text-base font-semibold text-slate-900">{user.fullName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Gender</p>
                  <p className="text-base font-semibold text-slate-900">{user.gender}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Email Address</p>
                  <p className="text-base font-semibold text-slate-900">{user.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Phone Number</p>
                  <p className="text-base font-semibold text-slate-900">{user.phone}</p>
                </div>
              </div>
              
              <div className="pt-8 border-t border-slate-100">
                <h4 className="text-sm font-bold text-slate-900 mb-4">Account Metadata</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="p-4 bg-slate-50 border border-slate-200">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">System User ID</p>
                    <code className="text-xs font-mono">{user.id}</code>
                  </div>
                  <div className="p-4 bg-slate-50 border border-slate-200">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Payment Status</p>
                    <p className="text-xs font-bold text-slate-900">{user.paymentMethod === 'added' ? 'Card Linked' : 'No Payment Method'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="overflow-x-auto animate-in fade-in duration-300">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase border-b border-slate-200">
                    <th className="px-6 py-4">Booking ID</th>
                    <th className="px-6 py-4">Facility / Class</th>
                    <th className="px-6 py-4">Date & Time</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {userBookings.length > 0 ? userBookings.map(b => (
                    <tr key={b.id} className="hover:bg-slate-50 transition-colors text-sm">
                      <td className="px-6 py-4 font-mono text-xs text-slate-400">{b.id.substr(0, 8)}</td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900">{classes.find(c => c.id === b.classId)?.name || 'Bulk Credit'}</p>
                        <p className="text-xs text-slate-400">{facilities.find(f => f.id === b.facilityId)?.name}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium">{new Date(b.bookingDate).toLocaleDateString()}</p>
                        <p className="text-xs text-slate-400">{b.startTime}</p>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900">${b.amount.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          b.status === 'upcoming' ? 'bg-blue-50 text-blue-700' :
                          b.status === 'delivered' ? 'bg-green-50 text-green-700' :
                          'bg-red-50 text-red-700'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan={5} className="py-20 text-center text-slate-400">No bookings found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="overflow-x-auto animate-in fade-in duration-300">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase border-b border-slate-200">
                    <th className="px-6 py-4">Order Number</th>
                    <th className="px-6 py-4">Facility</th>
                    <th className="px-6 py-4">Total</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {userOrders.length > 0 ? userOrders.map(o => (
                    <tr key={o.id} className="hover:bg-slate-50 transition-colors text-sm">
                      <td className="px-6 py-4 font-bold text-slate-900">{o.orderNumber}</td>
                      <td className="px-6 py-4 text-slate-500">{facilities.find(f => f.id === o.facilityId)?.name}</td>
                      <td className="px-6 py-4 font-bold text-slate-900">${o.total.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          o.status === 'placed' ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'
                        }`}>
                          {o.status === 'placed' ? 'Placed' : 'Picked Up'}
                        </span>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan={4} className="py-20 text-center text-slate-400">No orders found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'passes' && (
            <div className="overflow-x-auto animate-in fade-in duration-300">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase border-b border-slate-200">
                    <th className="px-6 py-4">Pass Name</th>
                    <th className="px-6 py-4">Facility</th>
                    <th className="px-6 py-4">Credits Remaining</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {userPurchasedPasses.length > 0 ? userPurchasedPasses.map(up => (
                    <tr key={up.id} className="hover:bg-slate-50 transition-colors text-sm">
                      <td className="px-6 py-4 font-bold text-slate-900">{up.name}</td>
                      <td className="px-6 py-4 text-slate-500">{facilities.find(f => f.id === up.facilityId)?.name}</td>
                      <td className="px-6 py-4 font-bold text-blue-600">{up.remainingCredits} / {up.totalCredits}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          up.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                        }`}>
                          {up.status}
                        </span>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan={4} className="py-20 text-center text-slate-400">No passes found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {isDeleteConfirmOpen && (
        <ConfirmationModal
          title="Delete Account?"
          message={`Delete "${user.fullName}" permanently? This will remove all bookings, orders, and passes associated with this user.`}
          variant="danger"
          confirmText="Delete Account"
          onConfirm={handleDelete}
          onCancel={() => setIsDeleteConfirmOpen(false)}
        />
      )}
    </div>
  );
};

export default UserDetailView;

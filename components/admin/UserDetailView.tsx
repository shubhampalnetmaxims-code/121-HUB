
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, ShieldCheck, Ban, Trash2, Menu, Calendar, CreditCard, ClipboardList, Clock, MapPin, ChevronRight } from 'lucide-react';
import { User as UserType, Booking, Class, Facility } from '../../types';
import { useToast } from '../ToastContext';
import ConfirmationModal from './ConfirmationModal';

interface UserDetailViewProps {
  users: UserType[];
  bookings: Booking[];
  classes: Class[];
  facilities: Facility[];
  onUpdateUser: (id: string, updates: Partial<UserType>) => void;
  onDeleteUser: (id: string) => void;
  onOpenSidebar: () => void;
}

const UserDetailView: React.FC<UserDetailViewProps> = ({ users, bookings, classes, facilities, onUpdateUser, onDeleteUser, onOpenSidebar }) => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const user = users.find(u => u.id === userId);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  if (!user) {
    return (
      <div className="p-20 text-center text-slate-400 font-bold">
        User profile not found.
        <button onClick={() => navigate('/admin/users')} className="block mx-auto mt-4 text-blue-600 underline">Back to Users</button>
      </div>
    );
  }

  const userBookings = bookings.filter(b => b.userId === user.id).sort((a, b) => b.bookingDate - a.bookingDate);

  const handleDelete = () => {
    onDeleteUser(user.id);
    showToast('Member account purged successfully', 'info');
    navigate('/admin/users');
  };

  const handleBookingClick = (booking: Booking) => {
    navigate('/admin/bookings-orders', { 
      state: { 
        filterType: 'class',
        facilityId: booking.facilityId,
        classId: booking.classId,
        trainerId: booking.trainerId,
        status: booking.status,
        searchId: booking.id
      } 
    });
  };

  return (
    <div className="flex flex-col min-h-screen text-left relative">
      <header className="bg-white border-b border-slate-200 px-6 py-6 sticky top-0 z-10 lg:mt-14 mt-12">
        <div className="flex items-center gap-4">
          <button onClick={onOpenSidebar} className="lg:hidden p-2 -ml-2 hover:bg-slate-100 rounded-lg">
            <Menu className="w-6 h-6" />
          </button>
          <button 
            onClick={() => navigate('/admin/users')} 
            className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">Member Profile</h2>
            <p className="text-slate-500 text-xs md:text-sm">Comprehensive account view and controls.</p>
          </div>
        </div>
      </header>

      <div className="p-4 md:p-8 pb-24 max-w-5xl mx-auto w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Profile Card */}
        <div className="bg-white rounded-[40px] border border-slate-200 p-8 md:p-12 shadow-sm flex flex-col md:flex-row gap-10 items-start">
          <div className="w-32 h-32 md:w-48 md:h-48 bg-slate-50 border border-slate-100 rounded-[48px] flex items-center justify-center shrink-0">
            <User className="w-16 h-16 md:w-24 md:h-24 text-slate-200" />
          </div>
          
          <div className="flex-1 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Global Member ID: {user.id}</p>
                <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-none">{user.fullName}</h3>
                <div className="flex gap-2 mt-4">
                  <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-xl text-xs font-black uppercase tracking-widest">{user.gender}</span>
                  <span className={`px-3 py-1 rounded-xl text-xs font-black uppercase tracking-widest ${
                    user.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                  }`}>
                    Account {user.status}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button 
                  onClick={() => onUpdateUser(user.id, { status: user.status === 'active' ? 'blocked' : 'active' })}
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all ${
                    user.status === 'active' 
                    ? 'bg-red-50 text-red-600 border border-red-100 hover:bg-red-100' 
                    : 'bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-600/20'
                  }`}
                >
                  <Ban className="w-4 h-4" />
                  {user.status === 'active' ? 'Block Access' : 'Restore Access'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Contact Gateway</p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-blue-600 shadow-sm"><Mail className="w-4 h-4" /></div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase leading-none mb-1">Email</p>
                      <p className="font-bold text-slate-900">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-blue-600 shadow-sm"><Phone className="w-4 h-4" /></div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase leading-none mb-1">Phone</p>
                      <p className="font-bold text-slate-900">{user.phone}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Account Integrity</p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-blue-600 shadow-sm"><Calendar className="w-4 h-4" /></div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase leading-none mb-1">Join Date</p>
                      <p className="font-bold text-slate-900">{new Date(user.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-blue-600 shadow-sm"><CreditCard className="w-4 h-4" /></div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase leading-none mb-1">Payment Method</p>
                      <p className={`font-bold ${user.paymentMethod === 'added' ? 'text-green-600' : 'text-slate-400'}`}>
                        {user.paymentMethod === 'added' ? 'Verified Method On File' : 'No Method Linked'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking History Section */}
        <div className="bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-sm">
           <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <ClipboardList className="w-5 h-5" />
                </div>
                <h4 className="text-xl font-bold text-slate-900">Booking History</h4>
              </div>
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{userBookings.length} total sessions</span>
           </div>
           
           <div className="overflow-x-auto">
             <table className="w-full text-left">
               <thead>
                 <tr className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                   <th className="px-8 py-4">Service / Class</th>
                   <th className="px-8 py-4">Facility</th>
                   <th className="px-8 py-4">Date & Time</th>
                   <th className="px-8 py-4">Attendees</th>
                   <th className="px-8 py-4">Status</th>
                   <th className="px-8 py-4 text-right"></th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                 {userBookings.length > 0 ? userBookings.map(b => {
                   const cls = classes.find(c => c.id === b.classId);
                   const fac = facilities.find(f => f.id === b.facilityId);
                   return (
                     <tr 
                      key={b.id} 
                      onClick={() => handleBookingClick(b)}
                      className="hover:bg-blue-50/50 transition-colors group text-sm cursor-pointer"
                     >
                       <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{cls?.name || 'Class'}</p>
                          </div>
                       </td>
                       <td className="px-8 py-5">
                          <div className="flex items-center gap-2">
                             <MapPin className="w-3 h-3 text-blue-600" />
                             <span className="text-slate-500 font-medium">{fac?.name || 'Facility'}</span>
                          </div>
                       </td>
                       <td className="px-8 py-5 text-left">
                          <div className="flex items-center gap-2 text-slate-700 font-bold whitespace-nowrap">
                            <Calendar className="w-3.5 h-3.5 text-slate-300" />
                            {new Date(b.bookingDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                            <Clock className="w-3 h-3" />
                            {b.startTime}
                          </div>
                       </td>
                       <td className="px-8 py-5">
                          <span className="text-xs font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded-lg">
                            {b.persons} {b.persons > 1 ? 'PERSONS' : 'PERSON'}
                          </span>
                       </td>
                       <td className="px-8 py-5">
                          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                            b.status === 'upcoming' ? 'bg-blue-50 text-blue-600' :
                            b.status === 'delivered' ? 'bg-green-50 text-green-600' :
                            'bg-red-50 text-red-600'
                          }`}>
                            {b.status}
                          </span>
                       </td>
                       <td className="px-8 py-5 text-right">
                          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                       </td>
                     </tr>
                   );
                 }) : (
                   <tr>
                     <td colSpan={6} className="py-20 text-center text-slate-400 font-bold italic">No booking records found for this member.</td>
                   </tr>
                 )}
               </tbody>
             </table>
           </div>
        </div>

        {/* Administration Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2 p-8 bg-blue-50 border border-blue-100 rounded-[40px] flex items-center gap-6">
             <div className="w-16 h-16 bg-blue-600 text-white rounded-3xl flex items-center justify-center shadow-xl shadow-blue-500/30">
               <ShieldCheck className="w-8 h-8" />
             </div>
             <div className="text-left">
               <h4 className="text-xl font-bold text-blue-900 mb-1">Authorized Operations</h4>
               <p className="text-sm text-blue-700 font-medium">This member profile is synchronized across all 121 facilities. Blocking access will restrict their ability to book classes or purchase items in all hubs.</p>
             </div>
          </div>

          <button 
            onClick={() => setIsDeleteConfirmOpen(true)}
            className="p-8 bg-red-50 border border-red-100 rounded-[40px] group hover:bg-red-600 transition-all flex flex-col items-center justify-center gap-2"
          >
             <Trash2 className="w-6 h-6 text-red-600 group-hover:text-white transition-colors" />
             <span className="font-black text-[10px] uppercase tracking-widest text-red-600 group-hover:text-white">Purge Record</span>
          </button>
        </div>
      </div>

      {isDeleteConfirmOpen && (
        <ConfirmationModal
          title="Purge Member Record?"
          message={`Are you sure you want to permanently delete "${user.fullName}" and all their associated platform data? This action is irreversible.`}
          variant="danger"
          confirmText="Confirm Purge"
          onConfirm={handleDelete}
          onCancel={() => setIsDeleteConfirmOpen(false)}
        />
      )}
    </div>
  );
};

export default UserDetailView;

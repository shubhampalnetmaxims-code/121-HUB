import React, { useState } from 'react';
import { User as UserType, Booking, Facility, Class, Order, UserPass, UserMembership } from '../../types';
import { User, Mail, Phone, CreditCard, Calendar, ShoppingBag, Ticket, LogOut, Trash2, ShieldCheck, AlertTriangle, FileText, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProfileViewProps {
  currentUser: UserType | null;
  bookings: Booking[];
  facilities: Facility[];
  classes: Class[];
  orders: Order[];
  onLogout: () => void;
  onDeleteAccount: (id: string) => void;
  onAuthTrigger: () => void;
  userPasses?: UserPass[];
  userMemberships?: UserMembership[];
}

const ProfileView: React.FC<ProfileViewProps> = ({ 
  currentUser, bookings, facilities, classes, orders, onLogout, onDeleteAccount, onAuthTrigger,
  userPasses = [], userMemberships = []
}) => {
  const navigate = useNavigate();
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  if (!currentUser) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-10 text-center bg-white">
        <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-300 mb-6">
          <User className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2 uppercase">Member Portal</h2>
        <p className="text-slate-500 font-medium text-sm leading-relaxed mb-8">Sign in to manage your health journey, view bookings, and access your profile.</p>
        <button 
          onClick={onAuthTrigger}
          className="w-full py-5 bg-black text-white rounded-2xl font-black text-lg shadow-2xl active:scale-95 transition-all"
        >
          Sign In / Register
        </button>
      </div>
    );
  }

  const handleLogout = () => {
    onLogout();
    navigate('/app/home');
  };

  const GridMenuItem = ({ icon: Icon, label, onClick, color = "text-slate-600", bg = "bg-slate-50" }: { icon: any, label: string, onClick?: () => void, color?: string, bg?: string }) => (
    <button 
      onClick={onClick}
      className="flex flex-col items-center justify-center p-4 bg-white border border-slate-100 rounded-2xl active:scale-95 transition-all shadow-sm group text-center aspect-square"
    >
       <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2.5 transition-transform group-hover:scale-110 ${bg} ${color}`}>
         <Icon className="w-5 h-5" />
       </div>
       <span className="text-[9px] font-black uppercase tracking-tight text-slate-700 leading-tight">{label}</span>
    </button>
  );

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden text-left relative">
      <div className="bg-white p-6 pt-12 border-b border-slate-100 shrink-0">
        <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase">My Profile</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-8 pb-32 scrollbar-hide">
        <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-5 relative z-10">
            <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden flex items-center justify-center shadow-md">
              {currentUser.profilePicture ? (
                <img src={currentUser.profilePicture} className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-black uppercase text-slate-400">{currentUser.fullName.charAt(0)}</span>
              )}
            </div>
            <div className="flex-1 overflow-hidden">
              <h3 className="text-xl font-black text-slate-900 tracking-tight truncate leading-tight uppercase">{currentUser.fullName}</h3>
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{currentUser.gender}</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-50 space-y-1 relative z-10">
            <div className="flex items-center gap-3">
              <Mail className="w-3.5 h-3.5 text-slate-300" />
              <span className="text-xs font-bold text-slate-500">{currentUser.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-3.5 h-3.5 text-slate-300" />
              <span className="text-xs font-bold text-slate-500">{currentUser.phone}</span>
            </div>
          </div>
          <ShieldCheck className="absolute -right-4 -bottom-4 w-32 h-32 text-slate-50 rotate-12" />
        </section>

        <section>
          <h4 className="px-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Management Grid</h4>
          <div className="grid grid-cols-3 gap-3">
            <GridMenuItem icon={User} label="Profile" color="text-blue-600" bg="bg-blue-50" onClick={() => {}} />
            <GridMenuItem icon={Trophy} label="Rewards" color="text-pink-600" bg="bg-pink-50" onClick={() => navigate('/app/rewards')} />
            <GridMenuItem icon={CreditCard} label="Payments" color="text-emerald-600" bg="bg-emerald-50" onClick={() => navigate('/app/profile/payments')} />
            <GridMenuItem icon={Calendar} label="Bookings" color="text-indigo-600" bg="bg-indigo-50" onClick={() => navigate('/app/bookings')} />
            <GridMenuItem icon={ShoppingBag} label="Orders" color="text-orange-600" bg="bg-orange-50" onClick={() => navigate('/app/profile/orders')} />
            <GridMenuItem icon={Ticket} label="Passes" color="text-purple-600" bg="bg-purple-50" onClick={() => navigate('/app/profile/passes')} />
            <GridMenuItem icon={ShieldCheck} label="Memberships" color="text-green-600" bg="bg-green-50" onClick={() => navigate('/app/profile/memberships')} />
            <GridMenuItem icon={FileText} label="Invoices" color="text-slate-600" bg="bg-slate-100" onClick={() => navigate('/app/profile/orders', { state: { view: 'invoices' } })} />
            <GridMenuItem icon={LogOut} label="Logout" color="text-slate-400" onClick={handleLogout} />
            <GridMenuItem icon={Trash2} label="Delete" color="text-red-600" bg="bg-red-50" onClick={() => setIsDeleteConfirmOpen(true)} />
          </div>
        </section>

        <section className="p-6 bg-slate-900 rounded-2xl text-white space-y-4 relative overflow-hidden">
           <div className="relative z-10">
             <div className="flex items-center gap-3 mb-2">
               <ShieldCheck className="w-5 h-5 text-blue-400" />
               <h4 className="font-bold tracking-tight uppercase text-sm">Community Member</h4>
             </div>
             <p className="text-[10px] text-white/50 leading-relaxed font-medium uppercase tracking-tight">
               Joined {new Date(currentUser.createdAt).toLocaleDateString()}. Thank you for being part of the 121 Wellness network.
             </p>
           </div>
        </section>
      </div>

      {isDeleteConfirmOpen && (
        <div className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
           <div className="bg-white rounded-[32px] p-8 text-center space-y-6 max-w-xs shadow-2xl">
             <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto"><AlertTriangle className="w-8 h-8" /></div>
             <div><h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2 uppercase">Permanently Delete?</h3><p className="text-slate-500 text-sm font-medium leading-relaxed">This action will permanently purge your profile and all associated records.</p></div>
             <div className="space-y-3 pt-2"><button onClick={onDeleteAccount.bind(null, currentUser.id)} className="w-full py-4 bg-red-600 text-white rounded-2xl font-black shadow-xl uppercase text-sm">Yes, Purge Data</button><button onClick={() => setIsDeleteConfirmOpen(false)} className="w-full py-4 text-slate-400 font-bold uppercase text-sm">Cancel</button></div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ProfileView;
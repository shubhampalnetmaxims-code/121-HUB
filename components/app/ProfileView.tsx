import React, { useState } from 'react';
import { User as UserType, Booking, Facility, Class, Order, UserPass } from '../../types';
import { User, Mail, Phone, CreditCard, Calendar, ShoppingBag, Ticket, LogOut, Trash2, ChevronRight, ShieldCheck, AlertTriangle, FileText, Camera } from 'lucide-react';
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
}

const ProfileView: React.FC<ProfileViewProps> = ({ 
  currentUser, bookings, facilities, classes, orders, onLogout, onDeleteAccount, onAuthTrigger,
  userPasses = [] 
}) => {
  const navigate = useNavigate();
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  if (!currentUser) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-10 text-center bg-white">
        <div className="w-20 h-20 bg-slate-100 rounded-[32px] flex items-center justify-center text-slate-300 mb-6">
          <User className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Member Portal</h2>
        <p className="text-slate-500 font-medium text-sm leading-relaxed mb-8">Sign in to manage your health journey, view bookings, and access your profile.</p>
        <button 
          onClick={onAuthTrigger}
          className="w-full py-5 bg-black text-white rounded-[28px] font-black text-lg shadow-2xl shadow-black/20 active:scale-95 transition-all"
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

  const ProfileMenuItem = ({ icon: Icon, label, color = 'text-slate-900', sublabel = '', onClick }: { icon: any, label: string, color?: string, sublabel?: string, onClick?: () => void }) => (
    <button 
      onClick={onClick}
      className="w-full p-5 bg-white border border-slate-100 rounded-[28px] flex items-center gap-4 active:scale-[0.98] transition-all group shadow-sm"
    >
       <div className={`w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center ${color}`}>
         <Icon className="w-5 h-5" />
       </div>
       <div className="flex-1 text-left">
         <p className={`font-bold text-base tracking-tight ${color}`}>{label}</p>
         {sublabel && <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{sublabel}</p>}
       </div>
       <ChevronRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
    </button>
  );

  const primaryCard = currentUser.paymentCards?.find(c => c.isPrimary);
  const userOrders = orders.filter(o => o.userId === currentUser.id);
  const activePassesCount = userPasses.filter(p => p.userId === currentUser.id && p.status === 'active').length;

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden text-left relative">
      <div className="bg-white p-6 pt-12 border-b border-slate-100 shrink-0">
        <h2 className="text-2xl font-black tracking-tight text-slate-900">My Profile</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-8 pb-32 scrollbar-hide">
        <section className="bg-white p-6 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-5 relative z-10">
            <div className="w-16 h-16 rounded-[24px] bg-slate-100 overflow-hidden flex items-center justify-center shadow-xl">
              {currentUser.profilePicture ? (
                <img src={currentUser.profilePicture} className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-black uppercase text-slate-400">{currentUser.fullName.charAt(0)}</span>
              )}
            </div>
            <div className="flex-1 overflow-hidden">
              <h3 className="text-xl font-black text-slate-900 tracking-tight truncate leading-tight">{currentUser.fullName}</h3>
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{currentUser.gender}</p>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-slate-50 space-y-3 relative z-10">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-slate-300" />
              <span className="text-sm font-bold text-slate-600">{currentUser.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-slate-300" />
              <span className="text-sm font-bold text-slate-600">{currentUser.phone}</span>
            </div>
          </div>
          <ShieldCheck className="absolute -right-4 -bottom-4 w-32 h-32 text-slate-50 rotate-12" />
        </section>

        <section className="space-y-3">
          <h4 className="px-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Manage Activity</h4>
          <ProfileMenuItem icon={Calendar} label="My Bookings" sublabel="Session History" onClick={() => navigate('/app/bookings')} />
          <ProfileMenuItem icon={ShoppingBag} label="My Orders" sublabel={`${userOrders.length} previous purchases`} onClick={() => navigate('/app/profile/orders')} />
          <ProfileMenuItem icon={FileText} label="Invoices" sublabel="Financial Receipts" onClick={() => navigate('/app/profile/orders', { state: { view: 'invoices' } })} />
        </section>

        <section className="space-y-3">
          <h4 className="px-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Settings</h4>
          <ProfileMenuItem 
            icon={CreditCard} 
            label="My Payments" 
            sublabel={primaryCard ? `Default: ${primaryCard.brand} ${primaryCard.cardNumber.slice(-4)}` : 'Add Card'} 
            onClick={() => navigate('/app/profile/payments')}
          />
          <ProfileMenuItem 
            icon={Ticket} 
            label="Memberships & Passes" 
            sublabel={activePassesCount > 0 ? `${activePassesCount} Active Passes` : "No active passes"} 
            onClick={() => navigate('/app/profile/passes')}
          />
        </section>

        <section className="pt-4 space-y-3">
          <button onClick={handleLogout} className="w-full p-5 bg-white border border-slate-100 rounded-[28px] flex items-center gap-4 active:scale-[0.98] transition-all text-slate-400 font-bold hover:text-slate-900 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center"><LogOut className="w-5 h-5" /></div>
            <span>Logout from Hub</span>
          </button>
          <button onClick={() => setIsDeleteConfirmOpen(true)} className="w-full p-5 bg-white border border-red-50 rounded-[28px] flex items-center gap-4 active:scale-[0.98] transition-all text-red-300 font-bold hover:text-red-500 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-red-50/30 flex items-center justify-center"><Trash2 className="w-5 h-5" /></div>
            <span>Delete Account Permanent</span>
          </button>
        </section>
      </div>

      {isDeleteConfirmOpen && (
        <div className="absolute inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
           <div className="bg-white rounded-[40px] p-8 text-center space-y-6 max-w-xs shadow-2xl">
             <div className="w-16 h-16 bg-red-100 text-red-600 rounded-3xl flex items-center justify-center mx-auto"><AlertTriangle className="w-8 h-8" /></div>
             <div><h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Are you sure?</h3><p className="text-slate-500 text-sm font-medium leading-relaxed">This action will permanently purge your profile and all records.</p></div>
             <div className="space-y-3 pt-2"><button onClick={onDeleteAccount.bind(null, currentUser.id)} className="w-full py-4 bg-red-600 text-white rounded-2xl font-black shadow-xl">Yes, Purge Data</button><button onClick={() => setIsDeleteConfirmOpen(false)} className="w-full py-4 text-slate-400 font-bold">Cancel</button></div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ProfileView;

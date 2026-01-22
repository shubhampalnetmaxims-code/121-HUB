
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, ShieldCheck, Ban, Trash2, Menu, Calendar, CreditCard, AlertTriangle } from 'lucide-react';
import { User as UserType } from '../../types';
import { useToast } from '../ToastContext';

interface UserDetailViewProps {
  users: UserType[];
  onUpdateUser: (id: string, updates: Partial<UserType>) => void;
  onDeleteUser: (id: string) => void;
  onOpenSidebar: () => void;
}

const UserDetailView: React.FC<UserDetailViewProps> = ({ users, onUpdateUser, onDeleteUser, onOpenSidebar }) => {
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

  const handleDelete = () => {
    onDeleteUser(user.id);
    showToast('Member account purged successfully', 'info');
    navigate('/admin/users');
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

        {/* Administration Section */}
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

      {/* Delete Confirmation Overlay */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
           <div className="bg-white rounded-[40px] p-8 text-center space-y-6 max-w-xs shadow-2xl">
             <div className="w-16 h-16 bg-red-100 text-red-600 rounded-3xl flex items-center justify-center mx-auto">
               <AlertTriangle className="w-8 h-8" />
             </div>
             <div>
               <h3 className="text-2xl font-black text-slate-900 tracking-tight">Confirm Deletion</h3>
               <p className="text-slate-500 text-sm font-medium">Are you sure? This will permanently delete the account data for {user.fullName}. This cannot be undone.</p>
             </div>
             <div className="space-y-3 pt-2">
               <button onClick={handleDelete} className="w-full py-4 bg-red-600 text-white rounded-2xl font-black active:scale-95 transition-all">Delete Account</button>
               <button onClick={() => setIsDeleteConfirmOpen(false)} className="w-full py-4 text-slate-400 font-bold hover:text-slate-600 transition-colors">Cancel</button>
             </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default UserDetailView;


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Search, User, Mail, Phone, Ban, Trash2, CheckCircle, ChevronRight } from 'lucide-react';
import { User as UserType } from '../../types';
import ConfirmationModal from './ConfirmationModal';

interface UsersViewProps {
  users: UserType[];
  onUpdateUser: (id: string, updates: Partial<UserType>) => void;
  onDeleteUser: (id: string) => void;
  onOpenSidebar: () => void;
}

const UsersView: React.FC<UsersViewProps> = ({ users, onUpdateUser, onDeleteUser, onOpenSidebar }) => {
  const [search, setSearch] = useState('');
  const [blockingUser, setBlockingUser] = useState<UserType | null>(null);
  const [deletingUser, setDeletingUser] = useState<UserType | null>(null);
  const navigate = useNavigate();

  const filteredUsers = users.filter(u => 
    u.fullName.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const confirmBlock = () => {
    if (blockingUser) {
      onUpdateUser(blockingUser.id, { status: blockingUser.status === 'active' ? 'blocked' : 'active' });
      setBlockingUser(null);
    }
  };

  const confirmDelete = () => {
    if (deletingUser) {
      onDeleteUser(deletingUser.id);
      setDeletingUser(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen text-left">
      <header className="bg-white border-b border-slate-200 px-6 py-6 sticky top-0 z-10 lg:mt-14 mt-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="text-left flex items-center gap-3">
            <button onClick={onOpenSidebar} className="lg:hidden p-2 -ml-2 hover:bg-slate-100 rounded-md">
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight uppercase">User Directory</h2>
              <p className="text-slate-500 text-xs font-medium">Manage subscriber accounts and platform access.</p>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Filter by name or email..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-11 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm outline-none w-full md:w-80 focus:bg-white transition-all font-medium"
            />
          </div>
        </div>
      </header>

      <div className="p-4 md:p-8 pb-24">
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-200">
                  <th className="px-6 py-5">Member</th>
                  <th className="px-6 py-5">Communication</th>
                  <th className="px-6 py-5">Account Status</th>
                  <th className="px-6 py-5 text-right">Ops</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredUsers.length > 0 ? filteredUsers.map(u => (
                  <tr 
                    key={u.id} 
                    className="hover:bg-slate-50/50 transition-colors cursor-pointer group" 
                    onClick={() => navigate(`/admin/user/${u.id}`)}
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md bg-slate-100 overflow-hidden flex items-center justify-center shrink-0 border border-slate-200 shadow-xs">
                          {u.profilePicture ? (
                            <img src={u.profilePicture} className="w-full h-full object-cover" alt="" />
                          ) : (
                            <User className="w-5 h-5 text-slate-300" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 leading-tight uppercase text-xs tracking-tight">{u.fullName}</p>
                          <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-1">{u.gender}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-xs font-bold text-slate-600">{u.email}</div>
                      <div className="text-[10px] text-slate-400 font-bold mt-0.5 tracking-tight">{u.phone}</div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex px-2 py-0.5 rounded-sm text-[9px] font-black uppercase tracking-widest border ${
                        u.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-1" onClick={e => e.stopPropagation()}>
                        <button 
                          onClick={() => setBlockingUser(u)}
                          className="p-2 text-slate-400 hover:text-slate-900 hover:bg-white border border-transparent hover:border-slate-200 rounded-md transition-all shadow-xs"
                          title={u.status === 'active' ? 'Suspend Account' : 'Restore Account'}
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setDeletingUser(u)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-white border border-transparent hover:border-slate-200 rounded-md transition-all shadow-xs"
                          title="Purge Data"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="p-2 text-slate-300 group-hover:text-slate-900 transition-colors">
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="py-20 text-center text-slate-400 font-black uppercase text-[10px] tracking-[0.4em] italic bg-slate-50/20">Zero Member Records</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {blockingUser && (
        <ConfirmationModal
          title={blockingUser.status === 'active' ? "Suspend User?" : "Restore Access?"}
          message={`Are you sure you want to ${blockingUser.status === 'active' ? 'suspend access for' : 'restore access for'} ${blockingUser.fullName}?`}
          variant={blockingUser.status === 'active' ? "warning" : "primary"}
          confirmText={blockingUser.status === 'active' ? "Suspend" : "Restore"}
          onConfirm={confirmBlock}
          onCancel={() => setBlockingUser(null)}
        />
      )}

      {deletingUser && (
        <ConfirmationModal
          title="Purge User Record?"
          message={`Delete "${deletingUser.fullName}"? All historical data and bookings will be permanently removed.`}
          variant="danger"
          confirmText="Purge Record"
          onConfirm={confirmDelete}
          onCancel={() => setDeletingUser(null)}
        />
      )}
    </div>
  );
};

export default UsersView;
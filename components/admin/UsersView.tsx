import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Search, User, Mail, Phone, Ban, Trash2, CheckCircle, ChevronRight, Filter } from 'lucide-react';
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
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'blocked'>('all');
  const [blockingUser, setBlockingUser] = useState<UserType | null>(null);
  const [deletingUser, setDeletingUser] = useState<UserType | null>(null);
  const navigate = useNavigate();

  const filteredUsers = users.filter(u => {
    // Status Filter
    if (statusFilter !== 'all' && u.status !== statusFilter) return false;

    // Enhanced Search: Name, Email, Phone, User ID
    const query = search.toLowerCase();
    const matches = 
      u.fullName.toLowerCase().includes(query) || 
      u.email.toLowerCase().includes(query) || 
      u.phone.includes(query) || 
      u.id.toLowerCase().includes(query);
    
    return matches;
  });

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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="text-left flex items-center gap-3">
            <button onClick={onOpenSidebar} className="lg:hidden p-2 -ml-2 hover:bg-slate-100 rounded-md">
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight uppercase">User Management</h2>
              <p className="text-slate-500 text-xs font-medium uppercase tracking-widest mt-1">Subscriber Network Control</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex bg-slate-100 p-1 rounded-lg">
              {(['all', 'active', 'blocked'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${
                    statusFilter === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {tab === 'active' ? 'Unblocked' : tab}
                </button>
              ))}
            </div>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search Name, Email, Phone or ID..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none w-full md:w-80 focus:bg-white transition-all font-bold"
              />
            </div>
          </div>
        </div>
      </header>

      <div className="p-4 md:p-8 pb-24">
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-slate-200">
                  <th className="px-8 py-5">Subscriber Identification</th>
                  <th className="px-8 py-5">Primary Contact</th>
                  <th className="px-8 py-5">System Status</th>
                  <th className="px-8 py-5 text-right">Ops</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredUsers.length > 0 ? filteredUsers.map(u => (
                  <tr 
                    key={u.id} 
                    className="hover:bg-slate-50/50 transition-colors cursor-pointer group" 
                    onClick={() => navigate(`/admin/user/${u.id}`)}
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden flex items-center justify-center shrink-0 border border-slate-200 shadow-inner">
                          {u.profilePicture ? (
                            <img src={u.profilePicture} className="w-full h-full object-cover" alt="" />
                          ) : (
                            <User className="w-6 h-6 text-slate-300" />
                          )}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 leading-tight uppercase text-sm tracking-tight">{u.fullName}</p>
                          <code className="text-[9px] text-slate-300 font-black uppercase mt-1 block">UID: {u.id}</code>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="text-xs font-bold text-slate-600">{u.email}</div>
                      <div className="text-[10px] text-slate-400 font-black mt-1 tracking-tight">{u.phone}</div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`inline-flex px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border ${
                        u.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
                      }`}>
                        {u.status === 'active' ? 'Active Account' : 'Blocked Access'}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2" onClick={e => e.stopPropagation()}>
                        <button 
                          onClick={() => setBlockingUser(u)}
                          className={`p-2 rounded-lg transition-all border ${
                            u.status === 'active' ? 'text-slate-400 hover:text-red-600 border-slate-100' : 'text-green-600 bg-green-50 border-green-100'
                          }`}
                          title={u.status === 'active' ? 'Block Account' : 'Unblock Account'}
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setDeletingUser(u)}
                          className="p-2 text-slate-400 hover:text-red-600 border border-slate-100 rounded-lg transition-all"
                          title="Purge Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="p-2 text-slate-300 group-hover:text-slate-900 transition-colors">
                          <ChevronRight className="w-5 h-5" />
                        </div>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="py-32 text-center text-slate-300 font-black uppercase text-[11px] tracking-[0.4em] italic bg-slate-50/20">Zero Matching Subscriber Records</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {blockingUser && (
        <ConfirmationModal
          title={blockingUser.status === 'active' ? "Restrict Subscriber?" : "Restore Access?"}
          message={`Confirming this will ${blockingUser.status === 'active' ? 'instantly revoke app entry' : 'reinstate hub access'} for ${blockingUser.fullName}.`}
          variant={blockingUser.status === 'active' ? "danger" : "primary"}
          confirmText={blockingUser.status === 'active' ? "Confirm Block" : "Restore Entry"}
          onConfirm={confirmBlock}
          onCancel={() => setBlockingUser(null)}
        />
      )}

      {deletingUser && (
        <ConfirmationModal
          title="Archive User Node?"
          message={`Delete "${deletingUser.fullName}" permanently? This terminates all health metrics, qualitative data, and historical ledger entries.`}
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
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
            <button onClick={onOpenSidebar} className="lg:hidden p-2 -ml-2 hover:bg-slate-100 rounded-lg">
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Platform Users</h2>
              <p className="text-slate-500 text-xs">View and manage all registered members.</p>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none w-full md:w-80"
            />
          </div>
        </div>
      </header>

      <div className="p-4 md:p-8 pb-24">
        <div className="bg-white border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredUsers.length > 0 ? filteredUsers.map(u => (
                  <tr 
                    key={u.id} 
                    className="hover:bg-slate-50 transition-colors cursor-pointer group" 
                    onClick={() => navigate(`/admin/user/${u.id}`)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center shrink-0 border border-slate-200">
                          {u.profilePicture ? (
                            <img src={u.profilePicture} className="w-full h-full object-cover" alt="" />
                          ) : (
                            <User className="w-5 h-5 text-slate-300" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 leading-tight">{u.fullName}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{u.gender}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-slate-600">{u.email}</div>
                      <div className="text-xs text-slate-400 font-medium mt-0.5">{u.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 rounded text-[10px] font-bold uppercase ${
                        u.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1" onClick={e => e.stopPropagation()}>
                        <button 
                          onClick={() => setBlockingUser(u)}
                          className="p-2 text-slate-400 hover:text-slate-900 hover:bg-white rounded transition-all"
                          title={u.status === 'active' ? 'Block' : 'Unblock'}
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setDeletingUser(u)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-white rounded transition-all"
                          title="Delete"
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
                    <td colSpan={4} className="py-20 text-center text-slate-400 text-sm font-medium">No members found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {blockingUser && (
        <ConfirmationModal
          title={blockingUser.status === 'active' ? "Block User?" : "Unblock User?"}
          message={`Are you sure you want to ${blockingUser.status === 'active' ? 'block access for' : 'restore access for'} ${blockingUser.fullName}?`}
          variant={blockingUser.status === 'active' ? "warning" : "primary"}
          confirmText={blockingUser.status === 'active' ? "Block" : "Restore"}
          onConfirm={confirmBlock}
          onCancel={() => setBlockingUser(null)}
        />
      )}

      {deletingUser && (
        <ConfirmationModal
          title="Delete Account?"
          message={`Delete "${deletingUser.fullName}"? All records will be removed. This cannot be undone.`}
          variant="danger"
          confirmText="Delete"
          onConfirm={confirmDelete}
          onCancel={() => setDeletingUser(null)}
        />
      )}
    </div>
  );
};

export default UsersView;

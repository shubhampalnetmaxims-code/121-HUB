
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Search, User, Mail, Phone, Ban, Trash2, CheckCircle } from 'lucide-react';
import { User as UserType } from '../../types';

interface UsersViewProps {
  users: UserType[];
  onUpdateUser: (id: string, updates: Partial<UserType>) => void;
  onDeleteUser: (id: string) => void;
  onOpenSidebar: () => void;
}

const UsersView: React.FC<UsersViewProps> = ({ users, onUpdateUser, onDeleteUser, onOpenSidebar }) => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const filteredUsers = users.filter(u => 
    u.fullName.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen text-left">
      <header className="bg-white border-b border-slate-200 px-6 py-6 sticky top-0 z-10 lg:mt-14 mt-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="text-left flex items-center gap-3">
            <button onClick={onOpenSidebar} className="lg:hidden p-2 -ml-2 hover:bg-slate-100 rounded-lg">
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900">Platform Users</h2>
              <p className="text-slate-500 text-xs md:text-sm">Manage member access and profiles.</p>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search members..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none w-full md:w-80"
            />
          </div>
        </div>
      </header>

      <div className="p-4 md:p-8 pb-24">
        <div className="bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                  <th className="px-8 py-5">User Profile</th>
                  <th className="px-8 py-5">Contact Info</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5">Payment</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredUsers.length > 0 ? filteredUsers.map(u => (
                  <tr 
                    key={u.id} 
                    className="hover:bg-slate-50/50 transition-colors group cursor-pointer" 
                    onClick={() => navigate(`/admin/user/${u.id}`)}
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                          <User className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{u.fullName}</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{u.gender}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 mb-1">
                        <Mail className="w-3.5 h-3.5 text-slate-300" />
                        <span className="text-sm font-medium text-slate-600">{u.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-300" />
                        <span className="text-xs text-slate-400 font-bold">{u.phone}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                        u.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        {u.paymentMethod === 'added' ? (
                          <>
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-xs font-bold text-slate-500">Method Added</span>
                          </>
                        ) : (
                          <>
                            <div className="w-4 h-4 rounded-full border-2 border-slate-200" />
                            <span className="text-xs font-bold text-slate-300 italic">Skipped</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2" onClick={e => e.stopPropagation()}>
                        <button 
                          onClick={() => onUpdateUser(u.id, { status: u.status === 'active' ? 'blocked' : 'active' })}
                          className={`p-2 rounded-xl transition-all ${
                            u.status === 'active' ? 'text-slate-400 hover:text-red-600 hover:bg-red-50' : 'text-slate-400 hover:text-green-600 hover:bg-green-50'
                          }`}
                          title={u.status === 'active' ? 'Block User' : 'Unblock User'}
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                        <button onClick={() => onDeleteUser(u.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all" title="Delete Account">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="py-20 text-center text-slate-400 font-bold italic">No members found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersView;

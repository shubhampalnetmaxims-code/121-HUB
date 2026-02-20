
import React, { useState } from 'react';
import { Menu, Plus, Search, User, Lock, Edit3, Trash2, CheckCircle, XCircle, ShieldCheck, Building, Mail } from 'lucide-react';
import { AdminUser, AdminPermission, Facility } from '../../types';
import AdminUserFormModal from './AdminUserFormModal';
import ConfirmationModal from './ConfirmationModal';
import { useToast } from '../ToastContext';

interface AdminStaffViewProps {
  adminUsers: AdminUser[];
  facilities: Facility[];
  onAddAdmin: (adm: Omit<AdminUser, 'id' | 'createdAt' | 'status'>) => void;
  onUpdateAdmin: (id: string, updates: Partial<AdminUser>) => void;
  onDeleteAdmin: (id: string) => void;
  onOpenSidebar: () => void;
}

const AdminStaffView: React.FC<AdminStaffViewProps> = ({ 
  adminUsers, facilities, onAddAdmin, onUpdateAdmin, onDeleteAdmin, onOpenSidebar 
}) => {
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredAdmins = adminUsers.filter(a => 
    a.name.toLowerCase().includes(search.toLowerCase()) || 
    a.username.toLowerCase().includes(search.toLowerCase()) ||
    a.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleStatus = (id: string, current: string) => {
    onUpdateAdmin(id, { status: current === 'active' ? 'suspended' : 'active' });
    showToast(`Access ${current === 'active' ? 'suspended' : 'restored'}`, 'info');
  };

  const confirmDelete = () => {
    if (deletingId) {
      onDeleteAdmin(deletingId);
      setDeletingId(null);
      showToast('Admin node purged', 'info');
    }
  };

  return (
    <div className="flex flex-col min-h-screen text-left">
      <header className="bg-white border-b border-slate-200 px-6 py-6 sticky top-0 z-10 lg:mt-14 mt-12 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <button onClick={onOpenSidebar} className="lg:hidden p-2 -ml-2 hover:bg-slate-100 rounded-md">
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight uppercase">Admin Governance</h2>
              <p className="text-slate-500 text-xs font-medium">Manage administrative staff and delegation roles.</p>
            </div>
          </div>
          <button 
            onClick={() => { setEditingAdmin(null); setIsFormOpen(true); }}
            className="bg-slate-900 text-white px-6 py-2.5 rounded-lg font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Enroll Staff
          </button>
        </div>
      </header>

      <div className="p-4 md:p-8 space-y-8 pb-32 max-w-[1400px] mx-auto w-full">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search staff by name, email or handle..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:bg-white transition-all font-medium"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {filteredAdmins.map(adm => {
             const assignedFac = facilities.find(f => f.id === adm.assignedFacilityId);
             return (
               <div key={adm.id} className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm flex flex-col group transition-all hover:shadow-md">
                  <div className="p-8 space-y-6">
                     <div className="flex justify-between items-start">
                        <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg border-4 border-slate-50 shrink-0">
                           <ShieldCheck className="w-7 h-7" />
                        </div>
                        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button onClick={() => { setEditingAdmin(adm); setIsFormOpen(true); }} className="p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:text-slate-900 transition-all border border-slate-100 hover:border-slate-200 shadow-xs"><Edit3 className="w-4 h-4" /></button>
                           <button 
                            onClick={() => setDeletingId(adm.id)} 
                            disabled={adm.username === 'admin'}
                            className="p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:text-red-600 transition-all border border-slate-100 hover:border-red-100 shadow-xs disabled:opacity-30"
                           >
                             <Trash2 className="w-4 h-4" />
                           </button>
                        </div>
                     </div>

                     <div className="space-y-1">
                        <h4 className="font-black text-xl text-slate-900 tracking-tight uppercase leading-none">{adm.name}</h4>
                        <p className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                           <Mail className="w-3 h-3" /> {adm.email}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                           <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1.5">
                              <Lock className="w-3 h-3" /> @{adm.username}
                           </p>
                           {assignedFac ? (
                             <span className="px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-100 rounded text-[8px] font-black uppercase flex items-center gap-1">
                                <Building className="w-2.5 h-2.5" /> {assignedFac.name}
                             </span>
                           ) : (
                             <span className="px-2 py-0.5 bg-slate-900 text-white rounded text-[8px] font-black uppercase">Master Network Access</span>
                           )}
                        </div>
                     </div>

                     <div className="space-y-4">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Permissions Audit</p>
                        <div className="flex flex-wrap gap-2">
                           {adm.permissions.includes('super_admin') ? (
                             <span className="px-3 py-1 bg-slate-900 text-white rounded-lg text-[8px] font-black uppercase tracking-widest">Master Control Hub</span>
                           ) : (
                             adm.permissions.map(p => (
                               <span key={p} className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg text-[8px] font-black uppercase tracking-widest">
                                  {p.replace('manage_', '').replace('_', ' ')}
                               </span>
                             ))
                           )}
                           {adm.permissions.length === 0 && <span className="text-[9px] font-bold text-slate-300 italic uppercase">Zero Credentials Assigned</span>}
                        </div>
                     </div>

                     <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           <div className={`w-2 h-2 rounded-full ${adm.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`} />
                           <span className={`text-[10px] font-black uppercase tracking-widest ${adm.status === 'active' ? 'text-green-600' : 'text-red-500'}`}>
                              {adm.status}
                           </span>
                        </div>
                        {adm.username !== 'admin' && (
                          <button 
                            onClick={() => handleToggleStatus(adm.id, adm.status)}
                            className="text-[9px] font-black text-slate-400 uppercase hover:text-slate-900 transition-colors"
                          >
                             {adm.status === 'active' ? 'Suspend Entry' : 'Restore Entry'}
                          </button>
                        )}
                     </div>
                  </div>
               </div>
             );
           })}
        </div>
      </div>

      {isFormOpen && (
        <AdminUserFormModal 
          admin={editingAdmin} 
          facilities={facilities}
          onClose={() => setIsFormOpen(false)} 
          onSave={(data) => {
            if (editingAdmin) onUpdateAdmin(editingAdmin.id, data);
            else onAddAdmin(data);
            setIsFormOpen(false);
          }} 
        />
      )}

      {deletingId && (
        <ConfirmationModal 
          title="Revoke Admin Access?"
          message="Purging this account will immediately terminate its node access across all hubs. This record cannot be recovered."
          variant="danger"
          onConfirm={confirmDelete}
          onCancel={() => setDeletingId(null)}
        />
      )}
    </div>
  );
};

export default AdminStaffView;


import React, { useState } from 'react';
import { X, ShieldCheck, User, Lock, Building, Check, Mail } from 'lucide-react';
import { AdminUser, AdminPermission, Facility } from '../../types';

interface AdminUserFormModalProps {
  admin: AdminUser | null;
  facilities: Facility[];
  onClose: () => void;
  onSave: (data: any) => void;
}

const ALL_PERMISSIONS: { id: AdminPermission, label: string }[] = [
  { id: 'manage_facilities', label: 'Facilities Control' },
  { id: 'manage_curriculum', label: 'Classes & Curriculum' },
  { id: 'manage_staff', label: 'Trainer Profiles' },
  { id: 'manage_users', label: 'Subscriber Records' },
  { id: 'manage_timetable', label: 'Live Timetable' },
  { id: 'manage_marketplace', label: 'Market Inventory' },
  { id: 'manage_finance', label: 'Financial Products' },
  { id: 'manage_operations', label: 'Bookings & Orders' },
  { id: 'manage_rewards', label: 'Loyalty Logic' },
  { id: 'manage_support', label: 'Helpdesk Tickets' },
  { id: 'manage_admin_staff', label: 'Staff Governance' }
];

const AdminUserFormModal: React.FC<AdminUserFormModalProps> = ({ admin, facilities, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: admin?.name || '',
    email: admin?.email || '',
    username: admin?.username || '',
    password: admin?.password || '',
    permissions: admin?.permissions || [] as AdminPermission[],
    assignedFacilityId: admin?.assignedFacilityId || ''
  });

  const togglePermission = (p: AdminPermission) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(p) 
        ? prev.permissions.filter(perm => perm !== p) 
        : [...prev.permissions, p]
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-[160] overflow-hidden flex items-center justify-end text-left">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>
      <div className="relative h-full w-full max-w-xl bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 border-l border-slate-200">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
          <div className="text-left">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">{admin ? 'Edit Credentials' : 'Enroll Admin Staff'}</h3>
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1">Institutional Governance Node</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-100 rounded-2xl transition-colors"><X className="w-6 h-6" /></button>
        </div>

        <form onSubmit={handleSave} className="flex-1 p-8 space-y-8 overflow-y-auto scrollbar-hide pb-32">
          <div className="space-y-6">
            <div className="space-y-4">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Identity Details</label>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input required value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm" placeholder="Professional Name" />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input required type="email" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm" placeholder="Institutional Email" />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input required value={formData.username} onChange={e => setFormData(p => ({ ...p, username: e.target.value }))} className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm" placeholder="Unique Handle" />
                  </div>
                  <div className="relative">
                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input required value={formData.password} onChange={e => setFormData(p => ({ ...p, password: e.target.value }))} className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm" placeholder="Secure Password" />
                  </div>
               </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100">
               <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Facility Restriction</label>
                  {formData.assignedFacilityId && <span className="text-[8px] font-black text-blue-600 uppercase">Hub Restricted</span>}
               </div>
               <div className="p-6 bg-slate-900 rounded-[32px] text-white relative overflow-hidden">
                  <div className="relative z-10 space-y-4">
                     <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Assign to Hub</p>
                     <select 
                       value={formData.assignedFacilityId} 
                       onChange={e => setFormData(p => ({ ...p, assignedFacilityId: e.target.value }))}
                       className="w-full bg-white/10 border border-white/10 rounded-2xl px-5 py-4 outline-none font-bold text-sm appearance-none cursor-pointer"
                     >
                        <option value="">Full Network Access (Super Admin)</option>
                        {facilities.map(f => <option key={f.id} value={f.id} className="text-slate-900">{f.name}</option>)}
                     </select>
                  </div>
                  <Building className="absolute -right-6 -bottom-6 w-24 h-24 text-white/5 rotate-12" />
               </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100">
               <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Institutional Credentials</label>
                  <button type="button" onClick={() => setFormData(p => ({ ...p, permissions: ['super_admin'] }))} className="text-[9px] font-black text-blue-600 uppercase">Elevation to Master</button>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {ALL_PERMISSIONS.map(p => {
                    const isSelected = formData.permissions.includes(p.id);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => togglePermission(p.id)}
                        className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left ${isSelected ? 'border-blue-600 bg-blue-50/50' : 'border-slate-50 bg-slate-50/50 text-slate-400'}`}
                      >
                         <span className={`text-[10px] font-black uppercase tracking-tight ${isSelected ? 'text-blue-900' : ''}`}>{p.label}</span>
                         {isSelected && <Check className="w-3 h-3 text-blue-600" />}
                      </button>
                    );
                  })}
               </div>
            </div>
          </div>
        </form>

        <div className="p-8 border-t border-slate-100 bg-white/95 backdrop-blur-md absolute bottom-0 left-0 right-0 z-10 flex gap-4">
           <button onClick={onClose} className="flex-1 py-4 border-2 border-slate-100 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:bg-slate-50">Discard</button>
           <button onClick={handleSave} className="flex-1 py-4 bg-black text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-black/20 hover:bg-slate-800 active:scale-95 transition-all">Publish Node</button>
        </div>
      </div>
    </div>
  );
};

export default AdminUserFormModal;

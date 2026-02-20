
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, BookOpen, Layers, Ticket, CreditCard, 
  ShoppingBag, Users, ArrowLeft, X, CalendarDays, ClipboardList,
  Gift, HelpCircle, Lock, Building
} from 'lucide-react';
import { AdminUser, AdminPermission } from '../../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentAdmin: AdminUser;
}

const SidebarItem = ({ 
  to, 
  icon: Icon, 
  label, 
  permission, 
  currentAdmin,
  onClick 
}: { 
  to: string, 
  icon: any, 
  label: string, 
  permission: AdminPermission,
  currentAdmin: AdminUser,
  onClick: () => void 
}) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  const hasPermission = currentAdmin.permissions.includes('super_admin') || 
                       currentAdmin.permissions.includes(permission);

  if (!hasPermission) return null;

  return (
    <Link 
      to={to}
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-md font-medium transition-all ${
        isActive ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:bg-white/5 hover:text-white'
      }`}
    >
      <Icon className="w-4 h-4" />
      <span className="text-sm">{label}</span>
    </Link>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, currentAdmin }) => {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[140] lg:hidden" onClick={onClose}></div>
      )}

      <aside className={`w-64 bg-slate-950 text-white flex flex-col p-6 fixed lg:h-full h-full lg:mt-14 mt-0 z-[150] transition-transform duration-300 lg:translate-x-0 overflow-x-hidden scrollbar-hide border-r border-slate-800 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="text-xl font-bold mb-10 flex items-center gap-2 shrink-0 text-left">
          <div className="bg-white text-black px-1.5 py-0.5 rounded-sm text-xs">121</div>
          <span className="tracking-tighter uppercase text-lg">Admin</span>
          <button onClick={onClose} className="lg:hidden ml-auto p-2 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6 px-4 py-3 bg-white/5 rounded-xl border border-white/5 text-left">
           <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Logged as</p>
           <p className="font-bold text-xs text-white truncate uppercase">{currentAdmin.name}</p>
           {currentAdmin.assignedFacilityId && (
             <div className="mt-2 flex items-center gap-1.5 text-blue-400">
                <Building className="w-3 h-3" />
                <span className="text-[8px] font-black uppercase tracking-widest">Hub Restricted Access</span>
             </div>
           )}
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto scrollbar-hide text-left">
          {/* Super Admins see global facility list, restricted ones see Hub Details directly on root */}
          <SidebarItem to="/admin" icon={currentAdmin.assignedFacilityId ? Building : LayoutDashboard} label={currentAdmin.assignedFacilityId ? "Hub Overview" : "Facilities"} permission="manage_facilities" currentAdmin={currentAdmin} onClick={onClose} />
          
          <SidebarItem to="/admin/classes" icon={BookOpen} label="Classes" permission="manage_curriculum" currentAdmin={currentAdmin} onClick={onClose} />
          <SidebarItem to="/admin/staff" icon={Users} label="Trainers" permission="manage_staff" currentAdmin={currentAdmin} onClick={onClose} />
          <SidebarItem to="/admin/users" icon={Users} label="Users" permission="manage_users" currentAdmin={currentAdmin} onClick={onClose} />
          <SidebarItem to="/admin/timetable" icon={CalendarDays} label="Timetable" permission="manage_timetable" currentAdmin={currentAdmin} onClick={onClose} />
          <SidebarItem to="/admin/marketplace" icon={ShoppingBag} label="Products" permission="manage_marketplace" currentAdmin={currentAdmin} onClick={onClose} />
          <SidebarItem to="/admin/passes" icon={Ticket} label="Passes" permission="manage_finance" currentAdmin={currentAdmin} onClick={onClose} />
          <SidebarItem to="/admin/memberships" icon={CreditCard} label="Memberships" permission="manage_finance" currentAdmin={currentAdmin} onClick={onClose} />
          <SidebarItem to="/admin/blocks" icon={Layers} label="Blocks" permission="manage_finance" currentAdmin={currentAdmin} onClick={onClose} />
          <SidebarItem to="/admin/bookings-orders" icon={ClipboardList} label="Booking & Orders" permission="manage_operations" currentAdmin={currentAdmin} onClick={onClose} />
          <SidebarItem to="/admin/rewards" icon={Gift} label="Rewards" permission="manage_rewards" currentAdmin={currentAdmin} onClick={onClose} />
          <SidebarItem to="/admin/support" icon={HelpCircle} label="Support" permission="manage_support" currentAdmin={currentAdmin} onClick={onClose} />
          
          <div className="pt-6 mt-6 border-t border-white/5">
             <SidebarItem to="/admin/admin-staff" icon={Lock} label="Admin Access" permission="manage_admin_staff" currentAdmin={currentAdmin} onClick={onClose} />
          </div>
        </nav>

        <Link to="/" className="flex items-center gap-3 px-4 py-4 text-slate-500 hover:text-white transition-all text-sm font-bold border-t border-slate-800 mt-6 shrink-0">
          <ArrowLeft className="w-4 h-4" />
          Sign Out
        </Link>
      </aside>
    </>
  );
};

export default Sidebar;

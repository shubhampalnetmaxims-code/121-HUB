import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, BookOpen, Layers, Ticket, CreditCard, 
  ShoppingBag, Users, ArrowLeft, X, CalendarDays, ClipboardList
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const SidebarItem = ({ to, icon: Icon, label, disabled = false, onClick }: { to: string, icon: any, label: string, disabled?: boolean, onClick: () => void }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link 
      to={disabled ? location.pathname : to}
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium transition-all ${
        isActive ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-white/5 hover:text-white'
      } ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
    >
      <Icon className="w-4 h-4" />
      <span className="text-sm">{label}</span>
      {disabled && <span className="ml-auto text-[8px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 font-bold uppercase">WIP</span>}
    </Link>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[140] lg:hidden" onClick={onClose}></div>
      )}

      <aside className={`w-64 bg-slate-950 text-white flex flex-col p-6 fixed lg:h-full h-full lg:mt-14 mt-0 z-[150] transition-transform duration-300 lg:translate-x-0 overflow-x-hidden scrollbar-hide border-r border-slate-800 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="text-xl font-bold mb-10 flex items-center gap-2 shrink-0">
          <div className="bg-white text-black px-1.5 py-0.5 rounded text-xs">121</div>
          <span className="tracking-tight">Admin</span>
          <button onClick={onClose} className="lg:hidden ml-auto p-2 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 space-y-2 overflow-y-auto scrollbar-hide">
          <SidebarItem to="/admin" icon={LayoutDashboard} label="Facilities" onClick={onClose} />
          <SidebarItem to="/admin/classes" icon={BookOpen} label="Classes" onClick={onClose} />
          <SidebarItem to="/admin/staff" icon={Users} label="Staff" onClick={onClose} />
          <SidebarItem to="/admin/users" icon={Users} label="Users" onClick={onClose} />
          <SidebarItem to="/admin/timetable" icon={CalendarDays} label="Timetable" onClick={onClose} />
          <SidebarItem to="/admin/marketplace" icon={ShoppingBag} label="Marketplace" onClick={onClose} />
          <SidebarItem to="/admin/passes" icon={Ticket} label="Passes" onClick={onClose} />
          <SidebarItem to="/admin/bookings-orders" icon={ClipboardList} label="Bookings & Orders" onClick={onClose} />
          <div className="pt-4 pb-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest px-4">Development</div>
          <SidebarItem to="/admin/blocks" icon={Layers} label="Blocks" disabled onClick={onClose} />
          <SidebarItem to="/admin/memberships" icon={CreditCard} label="Memberships" disabled onClick={onClose} />
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


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
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
        isActive ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-white/5'
      } ${disabled ? 'opacity-60 cursor-not-allowed grayscale' : ''}`}
    >
      <Icon className="w-5 h-5" />
      {label}
      {disabled && <span className="ml-auto text-[8px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300 uppercase">WIP</span>}
    </Link>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[140] lg:hidden" onClick={onClose}></div>
      )}

      <aside className={`w-64 bg-black text-white flex flex-col p-8 fixed lg:h-full h-full lg:mt-14 mt-0 shadow-2xl z-[150] transition-transform duration-300 lg:translate-x-0 overflow-x-hidden scrollbar-hide ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="text-2xl font-bold mb-12 flex items-center gap-3 shrink-0">
          <div className="bg-white text-black p-1.5 rounded-xl">121</div>
          <span className="tracking-tighter text-left">Admin</span>
          <button onClick={onClose} className="lg:hidden ml-auto p-2 text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="flex-1 space-y-3 overflow-y-auto scrollbar-hide overflow-x-hidden">
          <SidebarItem to="/admin" icon={LayoutDashboard} label="Facilities" onClick={onClose} />
          <SidebarItem to="/admin/classes" icon={BookOpen} label="Classes Hub" onClick={onClose} />
          <SidebarItem to="/admin/staff" icon={Users} label="Staff" onClick={onClose} />
          <SidebarItem to="/admin/users" icon={Users} label="Users" onClick={onClose} />
          <SidebarItem to="/admin/timetable" icon={CalendarDays} label="Timetable" onClick={onClose} />
          <SidebarItem to="/admin/marketplace" icon={ShoppingBag} label="Marketplace" onClick={onClose} />
          <SidebarItem to="/admin/bookings-orders" icon={ClipboardList} label="Booking & Orders" onClick={onClose} />
          <SidebarItem to="/admin/blocks" icon={Layers} label="Blocks" disabled onClick={onClose} />
          <SidebarItem to="/admin/passes" icon={Ticket} label="Passes" disabled onClick={onClose} />
          <SidebarItem to="/admin/memberships" icon={CreditCard} label="Memberships" disabled onClick={onClose} />
        </nav>
        <Link to="/" className="flex items-center gap-3 px-4 py-4 text-slate-500 hover:text-white transition-all text-sm font-bold border-t border-white/10 mt-auto mb-16 shrink-0">
          <ArrowLeft className="w-4 h-4" />
          Sign Out
        </Link>
      </aside>
    </>
  );
};

export default Sidebar;
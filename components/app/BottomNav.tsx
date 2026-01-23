
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home as HomeIcon, Compass, Calendar, User, ShoppingBag } from 'lucide-react';

const BottomNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname.includes(path);

  return (
    <div className="absolute bottom-0 left-0 right-0 h-24 bg-white/90 backdrop-blur-xl border-t border-slate-100 flex items-center justify-around px-4 pb-6 pt-2 z-40">
      <button onClick={() => navigate('/app/home')} className={`flex flex-col items-center gap-1.5 transition-colors ${isActive('/home') ? 'text-blue-600' : 'text-slate-400'}`}>
        <HomeIcon className="w-6 h-6" />
        <span className="text-[9px] font-bold uppercase tracking-widest">Home</span>
      </button>
      <button onClick={() => navigate('/app/market')} className={`flex flex-col items-center gap-1.5 transition-colors ${isActive('/market') ? 'text-blue-600' : 'text-slate-400'}`}>
        <ShoppingBag className="w-6 h-6" />
        <span className="text-[9px] font-bold uppercase tracking-widest">Market</span>
      </button>
      <button className="flex flex-col items-center gap-1.5 text-slate-400">
        <Compass className="w-6 h-6" />
        <span className="text-[9px] font-bold uppercase tracking-widest">Explore</span>
      </button>
      <button onClick={() => navigate('/app/bookings')} className={`flex flex-col items-center gap-1.5 transition-colors ${isActive('/bookings') ? 'text-blue-600' : 'text-slate-400'}`}>
        <Calendar className="w-6 h-6" />
        <span className="text-[9px] font-bold uppercase tracking-widest">Bookings</span>
      </button>
      <button onClick={() => navigate('/app/profile')} className={`flex flex-col items-center gap-1.5 transition-colors ${isActive('/profile') ? 'text-blue-600' : 'text-slate-400'}`}>
        <User className="w-6 h-6" />
        <span className="text-[9px] font-bold uppercase tracking-widest">Profile</span>
      </button>
    </div>
  );
};

export default BottomNav;

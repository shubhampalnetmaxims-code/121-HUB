import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home as HomeIcon, Calendar, User, ShoppingBag, Clock } from 'lucide-react';

const BottomNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname.includes(path);

  return (
    <div className="absolute bottom-0 left-0 right-0 h-20 bg-white border-t border-slate-100 flex items-center justify-around px-2 pb-2 z-40">
      <button onClick={() => navigate('/app/home')} className={`flex flex-col items-center gap-1.5 transition-colors ${isActive('/home') ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>
        <HomeIcon className="w-5 h-5" />
        <span className="text-[8px] font-bold uppercase tracking-widest">Home</span>
      </button>
      <button onClick={() => navigate('/app/market')} className={`flex flex-col items-center gap-1.5 transition-colors ${isActive('/market') ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>
        <ShoppingBag className="w-5 h-5" />
        <span className="text-[8px] font-bold uppercase tracking-widest">Shop</span>
      </button>
      <button onClick={() => navigate('/app/timetable')} className={`flex flex-col items-center gap-1.5 transition-colors ${isActive('/timetable') ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>
        <div className={`p-1.5 rounded-full ${isActive('/timetable') ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
          <Clock className="w-6 h-6" />
        </div>
        <span className="text-[8px] font-bold uppercase tracking-widest">Timetable</span>
      </button>
      <button onClick={() => navigate('/app/bookings')} className={`flex flex-col items-center gap-1.5 transition-colors ${isActive('/bookings') ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>
        <Calendar className="w-5 h-5" />
        <span className="text-[8px] font-bold uppercase tracking-widest">Schedule</span>
      </button>
      <button onClick={() => navigate('/app/profile')} className={`flex flex-col items-center gap-1.5 transition-colors ${isActive('/profile') ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>
        <User className="w-5 h-5" />
        <span className="text-[8px] font-bold uppercase tracking-widest">Profile</span>
      </button>
    </div>
  );
};

export default BottomNav;
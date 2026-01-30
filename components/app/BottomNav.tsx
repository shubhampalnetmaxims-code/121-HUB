import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home as HomeIcon, Compass, Calendar, User, ShoppingBag, ShoppingCart } from 'lucide-react';

interface BottomNavProps {
  cartCount?: number;
}

const BottomNav: React.FC<BottomNavProps> = ({ cartCount = 0 }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname.includes(path);

  return (
    <div className="absolute bottom-0 left-0 right-0 h-20 bg-white border-t border-slate-100 flex items-center justify-around px-4 pb-2 z-40">
      <button onClick={() => navigate('/app/home')} className={`flex flex-col items-center gap-1.5 transition-colors ${isActive('/home') ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>
        <HomeIcon className="w-5 h-5" />
        <span className="text-[8px] font-bold uppercase tracking-widest">Home</span>
      </button>
      <button onClick={() => navigate('/app/market')} className={`flex flex-col items-center gap-1.5 transition-colors ${isActive('/market') ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>
        <ShoppingBag className="w-5 h-5" />
        <span className="text-[8px] font-bold uppercase tracking-widest">Market</span>
      </button>
      <button onClick={() => navigate('/app/cart')} className={`flex flex-col items-center gap-1.5 transition-colors relative ${isActive('/cart') ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>
        <ShoppingCart className="w-5 h-5" />
        <span className="text-[8px] font-bold uppercase tracking-widest">Cart</span>
        {cartCount > 0 && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-[8px] font-bold rounded-full flex items-center justify-center border border-white">
            {cartCount}
          </div>
        )}
      </button>
      <button onClick={() => navigate('/app/bookings')} className={`flex flex-col items-center gap-1.5 transition-colors ${isActive('/bookings') ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>
        <Calendar className="w-5 h-5" />
        <span className="text-[8px] font-bold uppercase tracking-widest">Bookings</span>
      </button>
      <button onClick={() => navigate('/app/profile')} className={`flex flex-col items-center gap-1.5 transition-colors ${isActive('/profile') ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}>
        <User className="w-5 h-5" />
        <span className="text-[8px] font-bold uppercase tracking-widest">Profile</span>
      </button>
    </div>
  );
};

export default BottomNav;
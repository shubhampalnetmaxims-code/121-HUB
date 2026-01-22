
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const EntryView: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-black text-white">
      <div className="mb-12 text-7xl font-bold tracking-tighter">121</div>
      <p className="text-center text-slate-500 mb-8 max-w-xs font-medium leading-relaxed">Your portal to health, wellness, and peak performance.</p>
      <button 
        onClick={() => navigate('home')}
        className="w-full bg-blue-600 text-white font-bold py-5 rounded-[24px] hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/30 active:scale-95 transform text-lg"
      >
        Enter Hub
      </button>
      <Link to="/" className="mt-8 text-slate-600 text-sm hover:text-white transition-colors">Return to Site</Link>
    </div>
  );
};

export default EntryView;

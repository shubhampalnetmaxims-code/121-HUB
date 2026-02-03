
import React from 'react';
import { Construction, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UnderDevelopmentAppProps {
  title: string;
  subtitle?: string;
}

const UnderDevelopmentApp: React.FC<UnderDevelopmentAppProps> = ({ title, subtitle }) => {
  const navigate = useNavigate();
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-white">
      <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mb-6">
        <Construction className="w-10 h-10" />
      </div>
      <h2 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">{title}</h2>
      <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8 max-w-xs">
        {subtitle || "This feature is currently under construction. Check back soon for updates."}
      </p>
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-blue-600 font-bold hover:gap-3 transition-all text-sm uppercase tracking-widest"
      >
        <ArrowLeft className="w-4 h-4" />
        Go Back
      </button>
    </div>
  );
};

export default UnderDevelopmentApp;
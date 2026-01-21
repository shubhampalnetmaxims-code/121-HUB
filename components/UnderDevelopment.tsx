
import React from 'react';
import { Construction, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface UnderDevelopmentProps {
  title: string;
}

const UnderDevelopment: React.FC<UnderDevelopmentProps> = ({ title }) => {
  const navigate = useNavigate();
  return (
    <div className="p-8 flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mb-6">
        <Construction className="w-10 h-10" />
      </div>
      <h2 className="text-3xl font-bold text-slate-900 mb-2">{title}</h2>
      <p className="text-slate-500 max-w-md mb-8">
        We are currently building this module. Check back soon for management features related to {title.toLowerCase()}.
      </p>
      <button 
        onClick={() => navigate('/admin')}
        className="flex items-center gap-2 text-blue-600 font-bold hover:gap-3 transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Facilities
      </button>
    </div>
  );
};

export default UnderDevelopment;

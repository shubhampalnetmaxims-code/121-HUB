
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit3, Settings, BookOpen, Layers, Ticket, CreditCard, ShoppingBag, Menu } from 'lucide-react';
import { Facility, FEATURE_MODULES } from '../../types';
import FacilityFormModal from './FacilityFormModal';

const IconMap: Record<string, any> = {
  BookOpen, Layers, Ticket, CreditCard, ShoppingBag
};

interface FacilityDetailViewProps {
  facilities: Facility[];
  onUpdate: (id: string, updates: Partial<Facility>) => void;
  onOpenSidebar: () => void;
}

const FacilityDetailView: React.FC<FacilityDetailViewProps> = ({ facilities, onUpdate, onOpenSidebar }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const facility = facilities.find(f => f.id === id);
  if (!facility) return <div className="p-20 text-center font-bold text-slate-400">Facility Not Found</div>;

  const toggleFeature = (featureId: string) => {
    const currentFeatures = facility.features || [];
    const newFeatures = currentFeatures.includes(featureId)
      ? currentFeatures.filter(fid => fid !== featureId)
      : [...currentFeatures, featureId];
    onUpdate(facility.id, { features: newFeatures });
  };

  return (
    <div className="p-4 md:p-8 lg:mt-14 mt-12 pb-24">
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-10">
        <div className="flex items-center gap-4">
          <button onClick={onOpenSidebar} className="lg:hidden p-2 -ml-2 hover:bg-slate-100 rounded-lg">
            <Menu className="w-6 h-6" />
          </button>
          <button onClick={() => navigate('/admin')} className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors shadow-sm">
            <ArrowLeft className="w-6 h-6" />
          </button>
        </div>
        <div className="text-left">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">{facility.name}</h2>
            <button 
              onClick={() => setIsEditModalOpen(true)}
              className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"
            >
              <Edit3 className="w-5 h-5" />
            </button>
          </div>
          <p className="text-slate-500 font-medium text-sm md:text-base">Manage enabled features and site visibility.</p>
        </div>
      </div>

      <div className="space-y-8">
        <div className="bg-white rounded-[32px] md:rounded-[40px] p-6 md:p-10 border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-left flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-600" />
              Service Management
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FEATURE_MODULES.map(module => {
              const isEnabled = facility.features?.includes(module.id);
              const ModuleIcon = IconMap[module.icon] || ShoppingBag;
              return (
                <div 
                  key={module.id} 
                  className={`flex items-center justify-between p-4 md:p-6 rounded-3xl border-2 transition-all ${isEnabled ? 'border-blue-600 bg-blue-50/20' : 'border-slate-50 hover:border-slate-200'}`}
                >
                  <div className="flex items-center gap-3 md:gap-5">
                    <div className={`p-3 md:p-4 rounded-[20px] ${isEnabled ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                      <ModuleIcon className="w-6 h-6 md:w-7 md:h-7" />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-lg md:text-xl text-slate-900">{module.name}</p>
                      <p className="text-[10px] md:text-xs text-slate-500">Toggle {module.name.toLowerCase()}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => toggleFeature(module.id)}
                    className={`px-4 md:px-8 py-2 md:py-3 rounded-2xl font-bold text-xs md:text-sm transition-all shadow-sm ${isEnabled ? 'bg-red-50 text-red-600 border border-red-100 hover:bg-red-100' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                  >
                    {isEnabled ? 'Remove' : 'Add'}
                  </button>
                </div>
              );
            })}
          </div>

          <div className="mt-12 pt-12 border-t border-slate-100">
             <div className="flex items-center justify-between p-6 bg-slate-900 rounded-[32px] text-white">
                <div className="text-left">
                  <p className="font-bold text-lg">Visibility Status</p>
                  <p className="text-sm text-white/50">{facility.isActive ? 'Facility is live in the app' : 'Facility is currently hidden'}</p>
                </div>
                <button 
                  onClick={() => onUpdate(facility.id, { isActive: !facility.isActive })}
                  className={`px-8 py-3 rounded-2xl font-bold transition-all ${facility.isActive ? 'bg-white/10 hover:bg-white/20' : 'bg-green-600 hover:bg-green-700'}`}
                >
                  {facility.isActive ? 'Go Offline' : 'Publish Live'}
                </button>
             </div>
          </div>
        </div>
      </div>

      {isEditModalOpen && (
        <FacilityFormModal 
          facility={facility} 
          onClose={() => setIsEditModalOpen(false)} 
          onSave={(data) => {
            onUpdate(facility.id, data);
            setIsEditModalOpen(false);
          }} 
        />
      )}
    </div>
  );
};

export default FacilityDetailView;

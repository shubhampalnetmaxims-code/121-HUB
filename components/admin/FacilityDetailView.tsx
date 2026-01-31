
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit3, Settings, BookOpen, Layers, Ticket, CreditCard, ShoppingBag, Menu, ShieldCheck, XCircle, RefreshCw, ShoppingCart } from 'lucide-react';
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
  if (!facility) return <div className="p-20 text-center font-bold text-slate-400 uppercase tracking-widest text-xs">Facility Not Found</div>;

  const currentSettings = facility.settings || {
    canCancelBooking: true,
    canRescheduleBooking: true,
    canCancelOrder: true
  };

  const toggleFeature = (featureId: string) => {
    const currentFeatures = facility.features || [];
    const newFeatures = currentFeatures.includes(featureId)
      ? currentFeatures.filter(fid => fid !== featureId)
      : [...currentFeatures, featureId];
    onUpdate(facility.id, { features: newFeatures });
  };

  const updateSettings = (key: keyof NonNullable<Facility['settings']>, value: boolean) => {
    onUpdate(facility.id, {
      settings: { ...currentSettings, [key]: value }
    });
  };

  const PolicyToggle = ({ icon: Icon, label, description, active, onChange }: { icon: any, label: string, description: string, active: boolean, onChange: (v: boolean) => void }) => (
    <div className={`p-6 rounded-lg border transition-all flex items-center justify-between ${active ? 'border-blue-600 bg-blue-50/20' : 'border-slate-100 bg-white'}`}>
      <div className="flex items-center gap-5">
        <div className={`p-3.5 rounded-md ${active ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="text-left">
          <p className="font-bold text-base text-slate-900 leading-none mb-1 uppercase tracking-tight">{label}</p>
          <p className="text-xs text-slate-500 max-w-[280px] leading-tight font-medium">{description}</p>
        </div>
      </div>
      <input 
        type="checkbox" 
        checked={active} 
        onChange={e => onChange(e.target.checked)} 
        className="w-6 h-6 accent-blue-600 rounded-sm cursor-pointer"
      />
    </div>
  );

  return (
    <div className="p-4 md:p-8 lg:mt-14 mt-12 pb-32">
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-10">
        <div className="flex items-center gap-4">
          <button onClick={onOpenSidebar} className="lg:hidden p-2 -ml-2 hover:bg-slate-100 rounded-md">
            <Menu className="w-6 h-6" />
          </button>
          <button onClick={() => navigate('/admin')} className="p-2.5 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors shadow-sm text-slate-400 hover:text-slate-900">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
        <div className="text-left flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight uppercase">{facility.name}</h2>
            <button 
              onClick={() => setIsEditModalOpen(true)}
              className="p-2 hover:bg-slate-100 rounded-md text-slate-400 transition-colors border border-transparent hover:border-slate-200"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          </div>
          <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.2em]">Platform Hub Configuration</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Module Management */}
        <section className="bg-white rounded-lg p-8 md:p-10 border border-slate-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xs font-black text-left flex items-center gap-3 uppercase tracking-[0.2em] text-slate-400">
              <Settings className="w-4 h-4" /> Enabled Modules
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {FEATURE_MODULES.map(module => {
              const isEnabled = facility.features?.includes(module.id);
              const ModuleIcon = IconMap[module.icon] || ShoppingBag;
              return (
                <div 
                  key={module.id} 
                  className={`flex items-center justify-between p-4 rounded-lg border transition-all ${isEnabled ? 'border-blue-600 bg-blue-50/10' : 'border-slate-50 hover:border-slate-100 bg-slate-50/30'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-md ${isEnabled ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-300'}`}>
                      <ModuleIcon className="w-5 h-5" />
                    </div>
                    <p className="font-bold text-sm text-slate-900 uppercase tracking-tight">{module.name}</p>
                  </div>
                  <button 
                    onClick={() => toggleFeature(module.id)}
                    className={`px-5 py-2 rounded-md font-black text-[10px] uppercase tracking-widest transition-all ${isEnabled ? 'bg-red-50 text-red-600 border border-red-100 hover:bg-red-600 hover:text-white' : 'bg-slate-900 text-white hover:bg-black shadow-sm'}`}
                  >
                    {isEnabled ? 'Disable' : 'Enable'}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Policies & Actions */}
        <section className="bg-white rounded-lg p-8 md:p-10 border border-slate-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xs font-black text-left flex items-center gap-3 uppercase tracking-[0.2em] text-slate-400">
              <ShieldCheck className="w-4 h-4" /> Hub Policies
            </h3>
          </div>
          <div className="space-y-3">
            <PolicyToggle 
              icon={XCircle} 
              label="Cancel Booking" 
              description="Allow members to cancel their upcoming session reservations."
              active={currentSettings.canCancelBooking}
              onChange={(v) => updateSettings('canCancelBooking', v)}
            />
            <PolicyToggle 
              icon={RefreshCw} 
              label="Reschedule Booking" 
              description="Allow members to move their session to another available time."
              active={currentSettings.canRescheduleBooking}
              onChange={(v) => updateSettings('canRescheduleBooking', v)}
            />
            <PolicyToggle 
              icon={ShoppingCart} 
              label="Cancel Order" 
              description="Allow members to cancel marketplace item orders before pickup."
              active={currentSettings.canCancelOrder}
              onChange={(v) => updateSettings('canCancelOrder', v)}
            />
          </div>
        </section>
      </div>

      <div className="mt-12 bg-slate-900 rounded-lg p-10 text-white overflow-hidden relative shadow-md">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
           <div className="text-left">
             <h4 className="text-2xl font-black tracking-tight mb-2 uppercase">Global Visibility Control</h4>
             <p className="text-white/60 text-sm max-w-lg leading-relaxed font-medium uppercase tracking-tight">Hidden facilities are only visible to administrators. Toggle live to publish this hub to the global user network.</p>
           </div>
           <button 
            onClick={() => onUpdate(facility.id, { isActive: !facility.isActive })}
            className={`px-8 py-4 rounded-md font-black text-sm uppercase tracking-widest transition-all shadow-lg active:scale-95 ${facility.isActive ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}
           >
            {facility.isActive ? 'Go Offline' : 'Publish Hub'}
           </button>
        </div>
        <Settings className="absolute -right-20 -bottom-20 w-80 h-80 text-white/5 rotate-45" />
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
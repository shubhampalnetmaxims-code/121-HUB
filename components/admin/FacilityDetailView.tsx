
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
  if (!facility) return <div className="p-20 text-center font-bold text-slate-400">Facility Not Found</div>;

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
    <div className={`p-6 rounded-[32px] border-2 transition-all flex items-center justify-between ${active ? 'border-blue-600 bg-blue-50/20' : 'border-slate-50 bg-white'}`}>
      <div className="flex items-center gap-5">
        <div className={`p-4 rounded-2xl ${active ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="text-left">
          <p className="font-bold text-lg text-slate-900 leading-none mb-1">{label}</p>
          <p className="text-xs text-slate-500 max-w-[280px] leading-tight">{description}</p>
        </div>
      </div>
      <input 
        type="checkbox" 
        checked={active} 
        onChange={e => onChange(e.target.checked)} 
        className="w-7 h-7 accent-blue-600 rounded-lg cursor-pointer"
      />
    </div>
  );

  return (
    <div className="p-4 md:p-8 lg:mt-14 mt-12 pb-32">
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-10">
        <div className="flex items-center gap-4">
          <button onClick={onOpenSidebar} className="lg:hidden p-2 -ml-2 hover:bg-slate-100 rounded-lg">
            <Menu className="w-6 h-6" />
          </button>
          <button onClick={() => navigate('/admin')} className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors shadow-sm">
            <ArrowLeft className="w-6 h-6" />
          </button>
        </div>
        <div className="text-left flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">{facility.name}</h2>
            <button 
              onClick={() => setIsEditModalOpen(true)}
              className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"
            >
              <Edit3 className="w-5 h-5" />
            </button>
          </div>
          <p className="text-slate-500 font-medium text-sm md:text-base">System policies and feature set for this hub.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Module Management */}
        <section className="bg-white rounded-[40px] p-8 md:p-10 border border-slate-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-left flex items-center gap-3 uppercase tracking-widest text-slate-400">
              <Settings className="w-5 h-5" /> Enabled Modules
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {FEATURE_MODULES.map(module => {
              const isEnabled = facility.features?.includes(module.id);
              const ModuleIcon = IconMap[module.icon] || ShoppingBag;
              return (
                <div 
                  key={module.id} 
                  className={`flex items-center justify-between p-5 rounded-[32px] border-2 transition-all ${isEnabled ? 'border-blue-600 bg-blue-50/10' : 'border-slate-50 hover:border-slate-100'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-4 rounded-[20px] ${isEnabled ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                      <ModuleIcon className="w-6 h-6" />
                    </div>
                    <p className="font-bold text-lg text-slate-900">{module.name}</p>
                  </div>
                  <button 
                    onClick={() => toggleFeature(module.id)}
                    className={`px-6 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${isEnabled ? 'bg-red-50 text-red-600 border border-red-100 hover:bg-red-600 hover:text-white' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20'}`}
                  >
                    {isEnabled ? 'Disable' : 'Enable'}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Policies & Actions */}
        <section className="bg-white rounded-[40px] p-8 md:p-10 border border-slate-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black text-left flex items-center gap-3 uppercase tracking-widest text-slate-400">
              <ShieldCheck className="w-5 h-5" /> Hub Policies
            </h3>
          </div>
          <div className="space-y-4">
            <PolicyToggle 
              icon={XCircle} 
              label="Cancel Booking" 
              description="Allow members to cancel their upcoming session reservations directly from the app."
              active={currentSettings.canCancelBooking}
              onChange={(v) => updateSettings('canCancelBooking', v)}
            />
            <PolicyToggle 
              icon={RefreshCw} 
              label="Reschedule Booking" 
              description="Allow members to move their session to another available time slot (if applicable)."
              active={currentSettings.canRescheduleBooking}
              onChange={(v) => updateSettings('canRescheduleBooking', v)}
            />
            <PolicyToggle 
              icon={ShoppingCart} 
              label="Cancel Order" 
              description="Allow members to cancel marketplace item orders before they are marked as fulfilled."
              active={currentSettings.canCancelOrder}
              onChange={(v) => updateSettings('canCancelOrder', v)}
            />
          </div>
        </section>
      </div>

      <div className="mt-12 bg-slate-900 rounded-[40px] p-10 text-white overflow-hidden relative">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
           <div className="text-left">
             <h4 className="text-3xl font-black tracking-tighter mb-2">Visibility Control</h4>
             <p className="text-white/60 text-lg max-w-lg leading-relaxed">Hidden facilities are only visible to administrators. Toggle live to publish this hub to the global user network.</p>
           </div>
           <button 
            onClick={() => onUpdate(facility.id, { isActive: !facility.isActive })}
            className={`px-12 py-5 rounded-[28px] font-black text-xl transition-all shadow-2xl active:scale-95 ${facility.isActive ? 'bg-red-500 hover:bg-red-600 shadow-red-500/30' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/30'}`}
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

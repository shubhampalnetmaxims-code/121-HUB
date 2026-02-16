import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit3, Settings, BookOpen, Layers, Ticket, CreditCard, ShoppingBag, Menu, ShieldCheck, XCircle, RefreshCw, ShoppingCart, Image as ImageIcon, Trash2, Plus, CloudUpload, Save, Lock } from 'lucide-react';
import { Facility, FEATURE_MODULES } from '../../types';
import FacilityFormModal from './FacilityFormModal';
import { useToast } from '../ToastContext';

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
  const { showToast } = useToast();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const facility = facilities.find(f => f.id === id);
  
  // Local state for batch saving
  const [localFeatures, setLocalFeatures] = useState<string[]>([]);
  const [localSettings, setLocalSettings] = useState<NonNullable<Facility['settings']>>({
    canCancelBooking: true,
    canRescheduleBooking: true,
    canCancelOrder: true,
    canCancelMembership: true,
    canCancelBlock: true,
    refundPolicyClasses: "",
    refundPolicyOrders: "",
    refundPolicyMemberships: "",
    refundPolicyBlocks: ""
  });

  useEffect(() => {
    if (facility) {
      setLocalFeatures(facility.features || []);
      if (facility.settings) {
        setLocalSettings(facility.settings);
      }
    }
  }, [facility]);

  if (!facility) return <div className="p-20 text-center font-bold text-slate-400 uppercase tracking-widest text-xs">Facility Not Found</div>;

  const [localGallery, setLocalGallery] = useState<string[]>(facility.galleryImages || []);

  const toggleFeature = (featureId: string) => {
    setLocalFeatures(prev => {
      const isEnabling = !prev.includes(featureId);
      const next = isEnabling ? [...prev, featureId] : prev.filter(fid => fid !== featureId);
      
      // Auto-update settings based on feature toggles
      const nextSettings = { ...localSettings };
      
      if (!isEnabling) {
        // Disabling logic
        if (featureId === 'classes' || featureId === 'timetable') {
          nextSettings.canCancelBooking = false;
          nextSettings.canRescheduleBooking = false;
        } else if (featureId === 'marketplace') {
          nextSettings.canCancelOrder = false;
        } else if (featureId === 'memberships') {
          nextSettings.canCancelMembership = false;
        } else if (featureId === 'blocks') {
          nextSettings.canCancelBlock = false;
        }
      } else {
        // Enabling logic (Default to true for convenience)
        if (featureId === 'classes' || featureId === 'timetable') {
          nextSettings.canCancelBooking = true;
          nextSettings.canRescheduleBooking = true;
        } else if (featureId === 'marketplace') {
          nextSettings.canCancelOrder = true;
        } else if (featureId === 'memberships') {
          nextSettings.canCancelMembership = true;
        } else if (featureId === 'blocks') {
          nextSettings.canCancelBlock = true;
        }
      }
      
      setLocalSettings(nextSettings);
      return next;
    });
  };

  const updateLocalSetting = (key: keyof NonNullable<Facility['settings']>, value: any) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleBatchSave = () => {
    onUpdate(facility.id, {
      features: localFeatures,
      settings: localSettings
    });
    showToast('Configuration updated successfully', 'success');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLocalGallery(prev => [...prev, reader.result as string]);
        showToast('Image added to queue', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const removeGalleryImage = (idx: number) => {
    setLocalGallery(prev => prev.filter((_, i) => i !== idx));
    showToast('Image removed from queue', 'success');
  };

  const saveGallery = () => {
    onUpdate(facility.id, { galleryImages: localGallery });
    showToast('Facility images updated', 'success');
  };

  // Visibility logic for policies
  const isClassesEnabled = localFeatures.includes('classes') || localFeatures.includes('timetable');
  const isMarketplaceEnabled = localFeatures.includes('marketplace');
  const isMembershipsEnabled = localFeatures.includes('memberships');
  const isBlocksEnabled = localFeatures.includes('blocks');

  const PolicyToggle = ({ 
    icon: Icon, 
    label, 
    description, 
    active, 
    onChange, 
    parentEnabled = true 
  }: { 
    icon: any, 
    label: string, 
    description: string, 
    active: boolean, 
    onChange: (v: boolean) => void,
    parentEnabled?: boolean
  }) => (
    <div className={`p-6 rounded-lg border transition-all flex items-center justify-between ${!parentEnabled ? 'opacity-40 grayscale pointer-events-none bg-slate-50' : active ? 'border-blue-600 bg-blue-50/20' : 'border-slate-100 bg-white'}`}>
      <div className="flex items-center gap-5">
        <div className={`p-3.5 rounded-md ${active ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="text-left">
          <div className="flex items-center gap-2">
            <p className="font-bold text-base text-slate-900 leading-none mb-1 uppercase tracking-tight">{label}</p>
            {!parentEnabled && <Lock className="w-3 h-3 text-slate-400" />}
          </div>
          <p className="text-xs text-slate-500 max-w-[280px] leading-tight font-medium">{description}</p>
        </div>
      </div>
      <input 
        type="checkbox" 
        disabled={!parentEnabled}
        checked={active} 
        onChange={e => onChange(e.target.checked)} 
        className="w-6 h-6 accent-blue-600 rounded-sm cursor-pointer"
      />
    </div>
  );

  return (
    <div className="p-4 md:p-8 lg:mt-14 mt-12 pb-32 text-left">
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
        {/* Gallery Section */}
        <section className="xl:col-span-2 bg-white rounded-lg p-8 border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <div className="text-left">
              <h3 className="text-xs font-black flex items-center gap-3 uppercase tracking-[0.2em] text-slate-400">
                <ImageIcon className="w-4 h-4" /> Facility Images
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-1">Add multiple showcase images for the auto-scrolling hub slider.</p>
            </div>
            <button 
              onClick={saveGallery}
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-md font-bold text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg active:scale-95"
            >
              <Save className="w-4 h-4" /> Save Images
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {localGallery.map((img, idx) => (
              <div key={idx} className="aspect-video relative rounded-lg overflow-hidden group border border-slate-100 shadow-sm">
                <img src={img} className="w-full h-full object-cover" alt="" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button 
                    onClick={() => removeGalleryImage(idx)}
                    className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="aspect-video border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-blue-500 hover:text-blue-500 transition-all group"
            >
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                <Plus className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-black uppercase">Add Image</span>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
            </button>
          </div>
        </section>

        <section className="bg-white rounded-lg p-8 md:p-10 border border-slate-200 shadow-sm flex flex-col h-full">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xs font-black text-left flex items-center gap-3 uppercase tracking-[0.2em] text-slate-400">
              <Settings className="w-4 h-4" /> Enabled Modules
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {FEATURE_MODULES.map(module => {
              const isEnabled = localFeatures.includes(module.id);
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

        <section className="bg-white rounded-lg p-8 md:p-10 border border-slate-200 shadow-sm flex flex-col h-full">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xs font-black text-left flex items-center gap-3 uppercase tracking-[0.2em] text-slate-400">
              <ShieldCheck className="w-4 h-4" /> Hub Policies
            </h3>
          </div>
          <div className="space-y-3 flex-1">
            <PolicyToggle 
              icon={XCircle} 
              label="Cancel Booking" 
              description="Allow members to cancel their upcoming session reservations."
              active={localSettings.canCancelBooking}
              parentEnabled={isClassesEnabled}
              onChange={(v) => updateLocalSetting('canCancelBooking', v)}
            />
            <PolicyToggle 
              icon={RefreshCw} 
              label="Reschedule Booking" 
              description="Allow members to move their session to another available time."
              active={localSettings.canRescheduleBooking}
              parentEnabled={isClassesEnabled}
              onChange={(v) => updateLocalSetting('canRescheduleBooking', v)}
            />
            <PolicyToggle 
              icon={ShoppingCart} 
              label="Cancel Order" 
              description="Allow members to cancel marketplace item orders."
              active={localSettings.canCancelOrder}
              parentEnabled={isMarketplaceEnabled}
              onChange={(v) => updateLocalSetting('canCancelOrder', v)}
            />
            <PolicyToggle 
              icon={CreditCard} 
              label="Cancel Membership" 
              description="Allow members to terminate their active subscription plans."
              active={localSettings.canCancelMembership}
              parentEnabled={isMembershipsEnabled}
              onChange={(v) => updateLocalSetting('canCancelMembership', v)}
            />
            <PolicyToggle 
              icon={Layers} 
              label="Cancel Block" 
              description="Allow members to withdraw from transformation programs."
              active={localSettings.canCancelBlock}
              parentEnabled={isBlocksEnabled}
              onChange={(v) => updateLocalSetting('canCancelBlock', v)}
            />
          </div>
          
          <div className="pt-8 mt-8 border-t border-slate-50">
             <button 
              onClick={handleBatchSave}
              className="w-full py-4 bg-slate-900 text-white rounded-md font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-slate-900/10 hover:bg-black transition-all flex items-center justify-center gap-2"
             >
               <Save className="w-4 h-4" /> Save Policy Configuration
             </button>
          </div>
        </section>
      </div>

      <div className="mt-12 bg-slate-900 rounded-lg p-10 text-white overflow-hidden relative shadow-md">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8 text-left">
           <div>
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
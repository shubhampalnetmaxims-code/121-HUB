import React, { useState } from 'react';
import { Menu, Gift, Coins, RefreshCcw, DollarSign, Check, Info, Settings, Layout, Layers, ShoppingBag, Ticket, CreditCard, MapPin, Search } from 'lucide-react';
import { RewardSettings, Facility } from '../../types';
import { useToast } from '../ToastContext';
import ConfirmationModal from './ConfirmationModal';

interface RewardsViewProps {
  settings: RewardSettings;
  facilities: Facility[];
  onUpdateSettings: (updates: RewardSettings) => void;
  onOpenSidebar: () => void;
}

const RewardsView: React.FC<RewardsViewProps> = ({ settings, facilities, onUpdateSettings, onOpenSidebar }) => {
  const { showToast } = useToast();
  const [localSettings, setLocalSettings] = useState<RewardSettings>(settings);
  const [isConfirming, setIsConfirming] = useState(false);

  const handleUpdate = (path: string, value: any) => {
    const parts = path.split('.');
    const nextSettings = { ...localSettings };
    let current: any = nextSettings;
    for (let i = 0; i < parts.length - 1; i++) {
      current = current[parts[i]];
    }
    current[parts[parts.length - 1]] = value;
    setLocalSettings(nextSettings);
  };

  const toggleFacilityInConfig = (path: string, facilityId: string) => {
    const config = path.split('.').reduce((o: any, i: any) => o[i], localSettings);
    const currentIds = config.facilityIds || [];
    const nextIds = currentIds.includes(facilityId)
      ? currentIds.filter((id: string) => id !== facilityId)
      : [...currentIds, facilityId];
    handleUpdate(`${path}.facilityIds`, nextIds);
  };

  const toggleRedemptionModule = (moduleId: string) => {
    const modules = localSettings.redemption.enabledModules;
    const nextModules = modules.includes(moduleId)
      ? modules.filter(m => m !== moduleId)
      : [...modules, moduleId];
    handleUpdate('redemption.enabledModules', nextModules);
  };

  const saveSettings = () => {
    onUpdateSettings(localSettings);
    showToast('Saved successfully', 'success');
    setIsConfirming(false);
  };

  const EarningCard = ({ label, icon: Icon, configPath }: { label: string, icon: any, configPath: string }) => {
    const config = configPath.split('.').reduce((o: any, i: any) => o[i], localSettings);
    const enabled = config.enabled;
    const points = config.points;
    const selectedFacilityIds = config.facilityIds || [];

    return (
      <div className={`p-6 rounded-lg border transition-all ${enabled ? 'border-blue-600 bg-white shadow-sm' : 'border-slate-100 bg-slate-50/50 opacity-60'}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
             <div className={`p-2.5 rounded-lg ${enabled ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-400'}`}>
                <Icon className="w-5 h-5" />
             </div>
             <span className="font-bold text-slate-900 uppercase text-xs tracking-tight">{label}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-black uppercase tracking-widest ${enabled ? 'text-blue-600' : 'text-slate-400'}`}>{enabled ? 'On' : 'Off'}</span>
            <input 
              type="checkbox" 
              checked={enabled} 
              onChange={e => handleUpdate(`${configPath}.enabled`, e.target.checked)}
              className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
            />
          </div>
        </div>

        <div className={`space-y-6 transition-all ${!enabled ? 'pointer-events-none' : ''}`}>
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Points per action</label>
              <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-md border border-slate-100">
                 <Coins className="w-4 h-4 text-blue-500" />
                 <input 
                   type="number" 
                   value={points} 
                   onChange={e => handleUpdate(`${configPath}.points`, parseInt(e.target.value) || 0)}
                   className="bg-transparent outline-none font-black text-lg w-full"
                 />
              </div>
           </div>

           <div className="space-y-3">
              <div className="flex justify-between items-center px-1">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Facility</label>
                 <button 
                  onClick={() => handleUpdate(`${configPath}.facilityIds`, selectedFacilityIds.length === facilities.length ? [] : facilities.map(f => f.id))}
                  className="text-[9px] font-bold text-blue-600 uppercase tracking-widest hover:underline"
                 >
                   {selectedFacilityIds.length === facilities.length ? 'Clear All' : 'Select All'}
                 </button>
              </div>
              <div className="grid grid-cols-1 gap-1.5 max-h-32 overflow-y-auto scrollbar-hide pr-1">
                 {facilities.map(f => {
                   const isSelected = selectedFacilityIds.includes(f.id);
                   return (
                     <button
                      key={f.id}
                      onClick={() => toggleFacilityInConfig(configPath, f.id)}
                      className={`flex items-center justify-between px-3 py-2 rounded-md border text-[10px] font-bold uppercase tracking-tight transition-all ${isSelected ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-100 text-slate-400'}`}
                     >
                       <span className="truncate">{f.name}</span>
                       {isSelected && <Check className="w-3 h-3" />}
                     </button>
                   );
                 })}
                 {selectedFacilityIds.length === 0 && enabled && (
                   <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 text-amber-700 rounded-md border border-amber-100">
                      <Check className="w-3 h-3" />
                      <span className="text-[9px] font-black uppercase">Active in All Facilities</span>
                   </div>
                 )}
              </div>
           </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen text-left">
      <header className="bg-white border-b border-slate-200 px-6 py-6 sticky top-0 z-10 lg:mt-14 mt-12 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-3 text-left">
            <button onClick={onOpenSidebar} className="lg:hidden p-2 -ml-2 hover:bg-slate-100 rounded-md">
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight uppercase">Rewards</h2>
              <p className="text-slate-500 text-xs font-medium">Manage point earning and redemption rules.</p>
            </div>
          </div>
          <button 
            onClick={() => setIsConfirming(true)}
            className="bg-slate-900 text-white px-8 py-2.5 rounded-md font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-sm"
          >
            Save
          </button>
        </div>
      </header>

      <div className="p-4 md:p-8 space-y-12 pb-32 max-w-[1400px] w-full mx-auto">
        
        <section className="space-y-6">
          <div className="flex items-center gap-3 px-1 border-b border-slate-100 pb-4">
             <Gift className="w-5 h-5 text-blue-600" />
             <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">Earning Rules</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
             <EarningCard label="Class Booking" icon={Layout} configPath="classes" />
             <EarningCard label="Pass Purchase" icon={Ticket} configPath="passes" />
             <EarningCard label="Program Block" icon={Layers} configPath="blocks" />
             <EarningCard label="Market Order" icon={ShoppingBag} configPath="orders" />
             <EarningCard label="Membership" icon={CreditCard} configPath="memberships" />
          </div>
        </section>

        <section className="space-y-6">
           <div className="flex items-center gap-3 px-1 border-b border-slate-100 pb-4">
              <RefreshCcw className="w-5 h-5 text-blue-600" />
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">Redemption</h3>
           </div>
           
           <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
              <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/20">
                 <div className="text-left">
                    <p className="font-bold text-slate-900 text-lg uppercase tracking-tight">Status</p>
                    <p className="text-xs text-slate-500 font-medium">Allow members to use points for discounts.</p>
                 </div>
                 <div className="flex items-center gap-3">
                   <span className={`text-[10px] font-black uppercase ${localSettings.redemption.enabled ? 'text-blue-600' : 'text-slate-400'}`}>{localSettings.redemption.enabled ? 'Enabled' : 'Disabled'}</span>
                   <input 
                    type="checkbox" 
                    checked={localSettings.redemption.enabled} 
                    onChange={e => handleUpdate('redemption.enabled', e.target.checked)}
                    className="w-7 h-7 accent-blue-600 rounded-lg cursor-pointer"
                   />
                 </div>
              </div>

              <div className={`p-8 space-y-10 transition-opacity ${!localSettings.redemption.enabled ? 'opacity-40 pointer-events-none grayscale' : ''}`}>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    <div className="space-y-3">
                       <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Points Value</label>
                       <div className="flex items-center gap-3 bg-slate-50 p-5 rounded-2xl border border-slate-100 shadow-inner">
                          <Coins className="w-6 h-6 text-blue-500" />
                          <input type="number" value={localSettings.redemption.pointsToValue} onChange={e => handleUpdate('redemption.pointsToValue', parseInt(e.target.value) || 0)} className="bg-transparent outline-none font-black text-2xl w-full" />
                       </div>
                       <p className="text-[9px] text-slate-400 font-bold uppercase px-1">Accumulated Points</p>
                    </div>
                    <div className="flex items-center justify-center pt-8">
                       <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200"><RefreshCcw className="w-6 h-6" /></div>
                    </div>
                    <div className="space-y-3">
                       <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Cash Discount</label>
                       <div className="flex items-center gap-3 bg-slate-50 p-5 rounded-2xl border border-slate-100 shadow-inner">
                          <DollarSign className="w-6 h-6 text-green-600" />
                          <input type="number" value={localSettings.redemption.monetaryValue} onChange={e => handleUpdate('redemption.monetaryValue', parseInt(e.target.value) || 0)} className="bg-transparent outline-none font-black text-2xl w-full" />
                       </div>
                       <p className="text-[9px] text-slate-400 font-bold uppercase px-1">Value in USD</p>
                    </div>
                 </div>

                 <div className="p-8 bg-blue-50/50 rounded-3xl border border-blue-100 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="text-left max-w-lg">
                       <p className="font-bold text-blue-900 uppercase tracking-tight mb-1">Threshold</p>
                       <p className="text-sm text-blue-700/70 font-medium leading-relaxed">Member must reach this minimum before they can start redeeming points in the app.</p>
                    </div>
                    <div className="flex items-center gap-4 bg-white px-8 py-4 rounded-2xl border border-blue-100 shadow-sm shrink-0">
                       <Coins className="w-6 h-6 text-blue-500" />
                       <input type="number" value={localSettings.redemption.minPointsRequired} onChange={e => handleUpdate('redemption.minPointsRequired', parseInt(e.target.value) || 0)} className="bg-transparent outline-none font-black text-2xl w-24" />
                    </div>
                 </div>

                 <div className="space-y-6 pt-4">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Redemption Channels</label>
                    <div className="flex flex-wrap gap-4">
                       {[
                         { id: 'booking', label: 'Bookings', icon: Layout },
                         { id: 'pass', label: 'Passes', icon: Ticket },
                         { id: 'block', label: 'Blocks', icon: Layers },
                         { id: 'order', label: 'Products', icon: ShoppingBag }
                       ].map(channel => {
                         const active = localSettings.redemption.enabledModules.includes(channel.id);
                         return (
                           <button 
                            key={channel.id}
                            onClick={() => toggleRedemptionModule(channel.id)}
                            className={`flex items-center gap-4 px-8 py-4 rounded-[20px] border-2 transition-all ${active ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm' : 'border-slate-100 bg-slate-50/50 text-slate-400'}`}
                           >
                             <channel.icon className="w-5 h-5" />
                             <span className="font-black text-xs uppercase tracking-widest">{channel.label}</span>
                             {active && <Check className="w-5 h-5" />}
                           </button>
                         );
                       })}
                    </div>
                 </div>
              </div>
           </div>
        </section>

        <section className="p-10 bg-slate-900 rounded-[48px] text-white relative overflow-hidden text-left shadow-2xl">
           <div className="relative z-10 space-y-6 max-w-2xl">
              <div className="flex items-center gap-4 mb-2">
                 <Info className="w-6 h-6 text-blue-400" />
                 <h4 className="text-xl font-bold tracking-tight uppercase leading-none">Summary</h4>
              </div>
              <p className="text-sm text-white/50 leading-relaxed font-medium uppercase tracking-tight">
                 Facility-specific rewards allow hub owners to control point accumulation independently for each location. Points are earned instantly on payment and deducted on refund. Redemption applies globally across the network based on your threshold settings.
              </p>
           </div>
           <Settings className="absolute -right-16 -bottom-16 w-80 h-80 text-white/5 rotate-45" />
        </section>
      </div>

      {isConfirming && (
        <ConfirmationModal
          title="Save Policies?"
          message="Are you sure you want to update the network reward configuration? Changes apply immediately."
          confirmText="Yes"
          onConfirm={saveSettings}
          onCancel={() => setIsConfirming(false)}
        />
      )}
    </div>
  );
};

export default RewardsView;
import React, { useState } from 'react';
import { Menu, Gift, Coins, RefreshCcw, DollarSign, Check, Info, Settings, Layout, Layers, ShoppingBag, Ticket, CreditCard } from 'lucide-react';
import { RewardSettings } from '../../types';
import { useToast } from '../ToastContext';
import ConfirmationModal from './ConfirmationModal';

interface RewardsViewProps {
  settings: RewardSettings;
  onUpdateSettings: (updates: RewardSettings) => void;
  onOpenSidebar: () => void;
}

const RewardsView: React.FC<RewardsViewProps> = ({ settings, onUpdateSettings, onOpenSidebar }) => {
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

  const toggleRedemptionModule = (moduleId: string) => {
    const modules = localSettings.redemption.enabledModules;
    const nextModules = modules.includes(moduleId)
      ? modules.filter(m => m !== moduleId)
      : [...modules, moduleId];
    handleUpdate('redemption.enabledModules', nextModules);
  };

  const saveSettings = () => {
    onUpdateSettings(localSettings);
    showToast('Reward policies updated successfully', 'success');
    setIsConfirming(false);
  };

  const EarningCard = ({ id, label, icon: Icon, pointsPath, enabledPath }: any) => {
    const enabled = enabledPath.split('.').reduce((o: any, i: any) => o[i], localSettings);
    const points = pointsPath.split('.').reduce((o: any, i: any) => o[i], localSettings);

    return (
      <div className={`p-6 rounded-lg border transition-all ${enabled ? 'border-blue-600 bg-blue-50/10' : 'border-slate-100 bg-white opacity-60'}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
             <div className={`p-2.5 rounded-lg ${enabled ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                <Icon className="w-5 h-5" />
             </div>
             <span className="font-bold text-slate-900 uppercase text-xs tracking-tight">{label}</span>
          </div>
          <input 
            type="checkbox" 
            checked={enabled} 
            onChange={e => handleUpdate(enabledPath, e.target.checked)}
            className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
          />
        </div>
        <div className="space-y-1 text-left">
           <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Points per action</label>
           <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-md border border-slate-100">
              <Coins className="w-3.5 h-3.5 text-blue-500" />
              <input 
                type="number" 
                value={points} 
                onChange={e => handleUpdate(pointsPath, parseInt(e.target.value) || 0)}
                className="bg-transparent outline-none font-bold text-sm w-full"
              />
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
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight uppercase">Reward Configuration</h2>
              <p className="text-slate-500 text-xs font-medium">Define point earning and redemption logic.</p>
            </div>
          </div>
          <button 
            onClick={() => setIsConfirming(true)}
            className="bg-slate-900 text-white px-8 py-2.5 rounded-md font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-sm"
          >
            Save Changes
          </button>
        </div>
      </header>

      <div className="p-4 md:p-8 space-y-10 pb-32 max-w-6xl w-full mx-auto">
        
        {/* Section: Earning Rules */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 px-1">
             <Gift className="w-5 h-5 text-blue-600" />
             <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">Accumulation Settings</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
             <EarningCard label="Class Bookings" icon={Layout} enabledPath="classes.enabled" pointsPath="classes.points" />
             <EarningCard label="Pass Purchases" icon={Ticket} enabledPath="passes.enabled" pointsPath="passes.points" />
             <EarningCard label="Program Enrollments" icon={Layers} enabledPath="blocks.enabled" pointsPath="blocks.points" />
             <EarningCard label="Market Orders" icon={ShoppingBag} enabledPath="orders.enabled" pointsPath="orders.points" />
             <EarningCard label="Memberships" icon={CreditCard} enabledPath="memberships.enabled" pointsPath="memberships.points" />
          </div>
        </section>

        {/* Section: Redemption Framework */}
        <section className="space-y-6">
           <div className="flex items-center gap-3 px-1">
              <RefreshCcw className="w-5 h-5 text-blue-600" />
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em]">Redemption Framework</h3>
           </div>
           
           <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
              <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                 <div className="text-left">
                    <p className="font-bold text-slate-900 text-lg uppercase tracking-tight">Enable Redemption</p>
                    <p className="text-xs text-slate-500 font-medium">Allow members to use points for monetary discounts during checkout.</p>
                 </div>
                 <input 
                  type="checkbox" 
                  checked={localSettings.redemption.enabled} 
                  onChange={e => handleUpdate('redemption.enabled', e.target.checked)}
                  className="w-7 h-7 accent-blue-600 rounded-lg cursor-pointer"
                 />
              </div>

              <div className={`p-8 space-y-8 transition-opacity ${!localSettings.redemption.enabled ? 'opacity-40 pointer-events-none grayscale' : ''}`}>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-3">
                       <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Conversion Rule (Points)</label>
                       <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                          <Coins className="w-5 h-5 text-blue-500" />
                          <input type="number" value={localSettings.redemption.pointsToValue} onChange={e => handleUpdate('redemption.pointsToValue', parseInt(e.target.value) || 0)} className="bg-transparent outline-none font-black text-xl w-full" />
                       </div>
                    </div>
                    <div className="flex items-center justify-center pt-8">
                       <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400"><RefreshCcw className="w-5 h-5" /></div>
                    </div>
                    <div className="space-y-3">
                       <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Equivalent Value ($)</label>
                       <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                          <DollarSign className="w-5 h-5 text-green-600" />
                          <input type="number" value={localSettings.redemption.monetaryValue} onChange={e => handleUpdate('redemption.monetaryValue', parseInt(e.target.value) || 0)} className="bg-transparent outline-none font-black text-xl w-full" />
                       </div>
                    </div>
                 </div>

                 <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="text-left max-w-md">
                       <p className="text-xs font-black text-slate-900 uppercase tracking-tight mb-1">Minimum points required</p>
                       <p className="text-[11px] text-slate-400 font-medium">Member must accumulate this amount before redemption becomes an option in the app.</p>
                    </div>
                    <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-xl border border-slate-200 shrink-0">
                       <Coins className="w-4 h-4 text-blue-500" />
                       <input type="number" value={localSettings.redemption.minPointsRequired} onChange={e => handleUpdate('redemption.minPointsRequired', parseInt(e.target.value) || 0)} className="bg-transparent outline-none font-black text-lg w-24" />
                    </div>
                 </div>

                 <div className="space-y-4">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Enabled Redemption Channels</label>
                    <div className="flex flex-wrap gap-3">
                       {[
                         { id: 'booking', label: 'Class Bookings', icon: Layout },
                         { id: 'pass', label: 'Pass Purchases', icon: Ticket },
                         { id: 'block', label: 'Program Blocks', icon: Layers },
                         { id: 'order', label: 'Market Orders', icon: ShoppingBag }
                       ].map(channel => {
                         const active = localSettings.redemption.enabledModules.includes(channel.id);
                         return (
                           <button 
                            key={channel.id}
                            onClick={() => toggleRedemptionModule(channel.id)}
                            className={`flex items-center gap-3 px-5 py-3 rounded-xl border-2 transition-all ${active ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-100 bg-slate-50 text-slate-400 grayscale'}`}
                           >
                             <channel.icon className="w-4 h-4" />
                             <span className="text-xs font-bold uppercase">{channel.label}</span>
                             {active && <Check className="w-4 h-4" />}
                           </button>
                         );
                       })}
                    </div>
                 </div>
              </div>
           </div>
        </section>

        <section className="p-8 bg-slate-900 rounded-[40px] text-white relative overflow-hidden text-left shadow-xl">
           <div className="relative z-10 space-y-4 max-w-lg">
              <div className="flex items-center gap-3 mb-2">
                 <Info className="w-5 h-5 text-blue-400" />
                 <h4 className="font-bold tracking-tight uppercase">Economic Impact</h4>
              </div>
              <p className="text-xs text-white/50 leading-relaxed font-medium uppercase tracking-tight">
                 Points are awarded instantly upon successful payment. If a transaction is refunded, any earned points will be automatically deducted from the member's wallet. Redemption reduces the immediate revenue but increases long-term subscriber retention.
              </p>
           </div>
           <Settings className="absolute -right-10 -bottom-10 w-64 h-64 text-white/5 rotate-45" />
        </section>
      </div>

      {isConfirming && (
        <ConfirmationModal
          title="Save Reward Policies?"
          message="This will update earning and redemption rules for all facilities in the network."
          confirmText="Yes, Update Policies"
          onConfirm={saveSettings}
          onCancel={() => setIsConfirming(false)}
        />
      )}
    </div>
  );
};

export default RewardsView;
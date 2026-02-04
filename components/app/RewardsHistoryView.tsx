import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Gift, Coins, TrendingUp, TrendingDown, Clock, Info, ShieldCheck, ArrowRight, Lock, MapPin } from 'lucide-react';
import { User, RewardTransaction, RewardSettings, Facility } from '../../types';

interface RewardsHistoryViewProps {
  currentUser: User | null;
  transactions: RewardTransaction[];
  settings: RewardSettings;
  facilities: Facility[];
}

const RewardsHistoryView: React.FC<RewardsHistoryViewProps> = ({ currentUser, transactions, settings, facilities }) => {
  const navigate = useNavigate();

  if (!currentUser) return null;

  const userTransactions = transactions.filter(t => t.userId === currentUser.id).sort((a, b) => b.date - a.date);
  
  const discountValue = (currentUser.rewardPoints / settings.redemption.pointsToValue) * settings.redemption.monetaryValue;
  const minRequired = settings.redemption.minPointsRequired;
  const isUnlocked = currentUser.rewardPoints >= minRequired;
  const progressPercent = Math.min(100, (currentUser.rewardPoints / minRequired) * 100);

  const getSourceLabel = (src: RewardTransaction['source']) => {
    switch (src) {
      case 'booking': return 'Session Booking';
      case 'block': return 'Program Block';
      case 'order': return 'Market Order';
      case 'pass': return 'Hub Pass';
      case 'membership': return 'Membership';
      default: return 'System Adjustment';
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden text-left relative">
      <div className="bg-white p-6 pt-12 border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-4 mb-2">
          <button onClick={() => navigate('/app/profile')} className="p-2 hover:bg-slate-100 rounded-xl transition-all"><ChevronLeft className="w-5 h-5" /></button>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase leading-none">Wallet Rewards</h2>
        </div>
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest ml-12">Point accumulation ledger</p>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6 pb-32 scrollbar-hide">
        {/* Balance Card */}
        <section className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden shadow-2xl">
           <div className="relative z-10">
              <div className="flex justify-between items-start mb-10">
                 <div className="p-3 bg-white/10 rounded-2xl"><Coins className="w-8 h-8 text-blue-400" /></div>
                 <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Discount Ready</p>
                    <p className="text-4xl font-black text-blue-400">${isUnlocked ? discountValue.toFixed(2) : '0.00'}</p>
                 </div>
              </div>
              <div>
                 <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">Available Points</p>
                 <h4 className="text-5xl font-black tracking-tighter leading-none">{currentUser.rewardPoints}</h4>
              </div>
              <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                 <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-green-500" />
                    <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Loyalty Certified</span>
                 </div>
                 <div className="text-[10px] font-bold text-white/40 italic">
                    {settings.redemption.pointsToValue} pts = ${settings.redemption.monetaryValue}
                 </div>
              </div>
           </div>
           <Gift className="absolute -right-8 -bottom-8 w-48 h-48 text-white/5 rotate-12" />
        </section>

        {/* Minimum Points Requirement Progress */}
        {!isUnlocked && (
          <section className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm space-y-4">
             <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                   <Lock className="w-4 h-4 text-amber-500" />
                   <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Locked: Points Needed</h3>
                </div>
                <span className="text-[10px] font-black text-blue-600 uppercase">{currentUser.rewardPoints} / {minRequired}</span>
             </div>
             <div className="w-full h-2 bg-slate-50 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 transition-all duration-1000" style={{ width: `${progressPercent}%` }} />
             </div>
             <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                You need at least <span className="font-black text-slate-900">{minRequired} points</span> to start using them for discounts.
             </p>
          </section>
        )}

        {/* Transaction Ledger */}
        <section className="space-y-4">
           <div className="flex items-center justify-between px-1">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Transaction History</h3>
              <Clock className="w-3.5 h-3.5 text-slate-300" />
           </div>

           <div className="space-y-2">
              {userTransactions.length > 0 ? userTransactions.map(tx => {
                const fac = facilities.find(f => f.id === tx.facilityId);
                return (
                  <div key={tx.id} className="bg-white p-5 rounded-[28px] border border-slate-100 flex items-center gap-4 group transition-all hover:border-slate-200">
                     <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${tx.type === 'earned' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                        {tx.type === 'earned' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                     </div>
                     <div className="flex-1 overflow-hidden">
                        <div className="flex justify-between items-start mb-0.5">
                           <h5 className="font-bold text-slate-900 text-sm tracking-tight leading-none uppercase truncate">{getSourceLabel(tx.source)}</h5>
                           <span className={`font-black text-sm tracking-tighter ${tx.type === 'earned' ? 'text-green-600' : 'text-red-600'}`}>
                              {tx.type === 'earned' ? '+' : '-'}{tx.points}
                           </span>
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{new Date(tx.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} • ID: {tx.referenceId.substr(0,8)}</p>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-1 text-[8px] font-black text-blue-600 uppercase tracking-widest">
                            <MapPin className="w-2 h-2" /> {fac?.name || 'Manual'}
                          </div>
                          <div className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Bal: {tx.remainingBalance} pts</div>
                        </div>
                     </div>
                  </div>
                );
              }) : (
                <div className="py-20 text-center space-y-4">
                   <div className="w-16 h-16 bg-white rounded-[32px] flex items-center justify-center mx-auto border border-slate-100 text-slate-200"><Coins className="w-8 h-8" /></div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No transactions logged</p>
                </div>
              )}
           </div>
        </section>

        {/* Info Banner */}
        <section className="p-6 bg-blue-50 rounded-[32px] border border-blue-100 flex items-start gap-4">
           <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
           <div className="text-left">
              <p className="text-xs font-bold text-blue-900 leading-tight mb-1 uppercase tracking-tight">How to use points</p>
              <p className="text-[10px] text-blue-700 leading-relaxed font-medium">You can redeem points for a discount on any Session, Program, or Hub Order. Simply toggle 'Use Rewards' during the pay phase.</p>
           </div>
        </section>
      </div>

      <div className="p-6 pt-2 pb-12 border-t border-slate-50 bg-white/95 backdrop-blur-md absolute bottom-0 left-0 right-0 z-10 shrink-0">
         <button onClick={() => navigate('/app/home')} className="w-full py-5 bg-black text-white rounded-[28px] font-black text-xl shadow-2xl active:scale-95 transition-all uppercase tracking-tight">Return to Home</button>
      </div>
    </div>
  );
};

export default RewardsHistoryView;
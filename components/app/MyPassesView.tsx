import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Fix: Added ChevronRight to the lucide-react icon imports
import { ChevronLeft, Ticket, Layers, MapPin, CheckCircle, Clock, Eye, ChevronRight } from 'lucide-react';
import { User, UserPass, Facility, Class } from '../../types';
import ItemDetailModal from './ItemDetailModal';

interface MyPassesViewProps {
  currentUser: User | null;
  userPasses: UserPass[];
  facilities: Facility[];
  classes: Class[];
}

const MyPassesView: React.FC<MyPassesViewProps> = ({ currentUser, userPasses, facilities, classes }) => {
  const navigate = useNavigate();
  const [viewingPass, setViewingPass] = useState<UserPass | null>(null);

  if (!currentUser) return null;

  const myPasses = userPasses.filter(up => up.userId === currentUser.id).sort((a, b) => b.purchasedAt - a.purchasedAt);

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden text-left relative">
      <div className="bg-white p-6 pt-12 border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-4 mb-2">
          <button onClick={() => navigate('/app/profile')} className="p-2 hover:bg-slate-100 rounded-xl">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase">My Wallet</h2>
        </div>
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest ml-12">Bulk Credits & Bundles</p>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4 pb-32 scrollbar-hide">
        {myPasses.length > 0 ? myPasses.map(pass => {
          const fac = facilities.find(f => f.id === pass.facilityId);
          const creditPercent = (pass.remainingCredits / pass.totalCredits) * 100;
          
          return (
            <div key={pass.id} onClick={() => setViewingPass(pass)} className="bg-white rounded-[32px] border border-slate-100 p-6 shadow-sm flex flex-col gap-5 relative overflow-hidden group active:scale-[0.98] transition-all cursor-pointer">
              <div className="flex justify-between items-start relative z-10">
                <div className="flex items-center gap-3">
                   <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                     <Ticket className="w-6 h-6" />
                   </div>
                   <div>
                     <h4 className="font-black text-slate-900 text-lg leading-tight tracking-tight uppercase line-clamp-1">{pass.name}</h4>
                     <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{fac?.name}</p>
                   </div>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                  pass.status === 'active' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'
                }`}>
                  {pass.status}
                </span>
              </div>

              <div className="relative z-10">
                 <div className="flex justify-between items-end mb-3">
                    <div>
                       <p className="text-[9px] font-black text-slate-400 uppercase mb-1">AVAILABLE SESSIONS</p>
                       <h5 className="text-3xl font-black text-slate-900 tracking-tighter leading-none">{pass.remainingCredits} <span className="text-base text-slate-300 font-bold">/ {pass.totalCredits}</span></h5>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:translate-x-1 transition-transform" />
                 </div>
                 <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 transition-all duration-1000" style={{ width: `${creditPercent}%` }} />
                 </div>
              </div>

              <div className="absolute -right-6 -bottom-6 w-32 h-32 text-slate-50 rotate-12 group-hover:scale-110 transition-transform">
                <Ticket className="w-full h-full" />
              </div>
            </div>
          );
        }) : (
          <div className="py-24 text-center space-y-6">
            <div className="w-20 h-20 bg-white rounded-[40px] flex items-center justify-center mx-auto border border-slate-100 text-slate-200">
               <Ticket className="w-8 h-8" />
            </div>
            <p className="text-lg font-bold text-slate-400 uppercase text-xs tracking-widest">No active units found.</p>
          </div>
        )}
      </div>

      {viewingPass && (
        <ItemDetailModal 
           type="pass"
           item={viewingPass}
           facility={facilities.find(f => f.id === viewingPass.facilityId)}
           onClose={() => setViewingPass(null)}
           actions={
             <div className="p-5 bg-slate-50 rounded-[32px] border border-slate-100">
                <p className="text-[9px] font-black text-slate-400 uppercase mb-3">Pass Coverage</p>
                <p className="text-sm font-bold text-slate-700 leading-relaxed">{viewingPass.isAllClasses ? 'Unlimited scope for standard sessions.' : 'Specific eligibility reach applied.'}</p>
             </div>
           }
        />
      )}
    </div>
  );
};

export default MyPassesView;
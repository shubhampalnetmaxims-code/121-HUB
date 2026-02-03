import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, CreditCard, ShieldCheck, Calendar, Clock, MapPin, CheckCircle2, ChevronRight, Eye } from 'lucide-react';
import { User, UserMembership, Facility } from '../../types';
import ItemDetailModal from './ItemDetailModal';

interface MyMembershipsViewProps {
  currentUser: User | null;
  userMemberships: UserMembership[];
  facilities: Facility[];
}

const MyMembershipsView: React.FC<MyMembershipsViewProps> = ({ currentUser, userMemberships, facilities }) => {
  const navigate = useNavigate();
  const [viewingMembership, setViewingMembership] = useState<UserMembership | null>(null);

  if (!currentUser) return null;

  const myMemberships = userMemberships.filter(um => um.userId === currentUser.id).sort((a, b) => b.purchasedAt - a.purchasedAt);

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden text-left relative">
      <div className="bg-white p-6 pt-12 border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-4 mb-2">
          <button onClick={() => navigate('/app/profile')} className="p-2 hover:bg-slate-100 rounded-xl">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase">My Access</h2>
        </div>
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest ml-12">Commitment Record</p>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-4 pb-32 scrollbar-hide">
        {myMemberships.length > 0 ? myMemberships.map(um => {
          const fac = facilities.find(f => f.id === um.facilityId);
          const isExpired = Date.now() > um.endDate;
          
          return (
            <div key={um.id} onClick={() => setViewingMembership(um)} className="bg-white rounded-[32px] border border-slate-100 p-6 shadow-sm flex flex-col gap-5 relative overflow-hidden group active:scale-[0.98] transition-all cursor-pointer">
              <div className="flex justify-between items-start relative z-10">
                <div className="flex items-center gap-3">
                   <div className={`w-12 h-12 rounded-2xl flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-colors ${isExpired ? 'bg-slate-100 text-slate-400' : 'bg-green-50 text-green-600'}`}>
                     <ShieldCheck className="w-6 h-6" />
                   </div>
                   <div>
                     <h4 className="font-black text-slate-900 text-lg leading-tight tracking-tight uppercase line-clamp-1">{um.title}</h4>
                     <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{fac?.name}</p>
                   </div>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                  !isExpired ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'
                }`}>
                  {!isExpired ? 'Active' : 'Expired'}
                </span>
              </div>

              <div className="relative z-10 flex justify-between items-end pt-2 border-t border-slate-50">
                 <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">CONTRACT VALIDITY</p>
                    <p className="font-bold text-xs text-slate-900 uppercase">{new Date(um.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                 </div>
                 <ChevronRight className="w-5 h-5 text-slate-300 group-hover:translate-x-1 transition-transform" />
              </div>

              {!isExpired && (
                <div className="absolute -right-6 -bottom-6 w-32 h-32 text-green-500/5 rotate-12 group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="w-full h-full" />
                </div>
              )}
            </div>
          );
        }) : (
          <div className="py-24 text-center space-y-6">
            <div className="w-20 h-20 bg-white rounded-[40px] flex items-center justify-center mx-auto border border-slate-100 text-slate-200">
               <ShieldCheck className="w-8 h-8" />
            </div>
            <p className="text-lg font-bold text-slate-400 uppercase text-xs tracking-widest">No recurring plans.</p>
          </div>
        )}
      </div>

      {viewingMembership && (
        <ItemDetailModal 
           type="membership"
           item={viewingMembership}
           facility={facilities.find(f => f.id === viewingMembership.facilityId)}
           onClose={() => setViewingMembership(null)}
           actions={
             <div className="grid grid-cols-2 gap-3">
                <div className="p-5 bg-slate-50 rounded-[32px] border border-slate-100">
                   <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Time Access</p>
                   <p className="font-bold text-slate-900 text-xs">{viewingMembership.allow24Hour ? '24/7 Hours' : 'Hub Timing'}</p>
                </div>
                <div className="p-5 bg-slate-50 rounded-[32px] border border-slate-100">
                   <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Access Type</p>
                   <p className="font-bold text-slate-900 text-xs uppercase">{viewingMembership.daysAccess} Days</p>
                </div>
             </div>
           }
        />
      )}
    </div>
  );
};

export default MyMembershipsView;
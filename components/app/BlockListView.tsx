import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Layers, Calendar, Clock, ArrowRight, User } from 'lucide-react';
import { Facility, Block, Trainer, User as UserType } from '../../types';

interface BlockListViewProps {
  facilities: Facility[];
  blocks: Block[];
  trainers: Trainer[];
  onAuthTrigger: () => void;
  currentUser: UserType | null;
}

const BlockListView: React.FC<BlockListViewProps> = ({ facilities, blocks, trainers, onAuthTrigger, currentUser }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const facility = facilities.find(f => f.id === id);
  
  if (!facility) return null;
  
  const facilityBlocks = blocks.filter(b => b.facilityId === id && b.status === 'active');

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden text-left relative">
      <div className="bg-white p-6 pt-12 border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-4 mb-2">
          <button onClick={() => navigate(`/app/facility/${id}`)} className="p-2 hover:bg-slate-100 rounded-xl">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-black tracking-tight text-slate-900 uppercase">Training Blocks</h2>
        </div>
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest ml-12">Fixed Cycle Programs</p>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6 pb-32 scrollbar-hide">
        {facilityBlocks.length > 0 ? facilityBlocks.map(block => {
          const trainer = trainers.find(t => t.id === block.trainerId);
          const displayPrice = block.paymentType === 'full' ? block.totalAmount : block.reservedAmount;
          return (
            <div key={block.id} className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm group">
               <div className="p-6 space-y-6">
                 <div className="flex justify-between items-start">
                   <div className="space-y-1">
                     <h4 className="text-2xl font-black text-slate-900 tracking-tighter leading-none uppercase">{block.name}</h4>
                     <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{block.numWeeks} Week Transformation</p>
                   </div>
                   <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                      <Layers className="w-6 h-6" />
                   </div>
                 </div>

                 <p className="text-sm text-slate-500 font-medium leading-relaxed line-clamp-2">{block.about}</p>

                 <div className="grid grid-cols-2 gap-3">
                   <div className="bg-slate-50 p-4 rounded-2xl">
                      <div className="flex items-center gap-2 mb-1 opacity-40"><Calendar className="w-3 h-3" /><span className="text-[8px] font-black uppercase">Start Date</span></div>
                      <p className="font-black text-slate-900 text-sm">{new Date(block.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p>
                   </div>
                   <div className="bg-slate-50 p-4 rounded-2xl">
                      <div className="flex items-center gap-2 mb-1 opacity-40"><Clock className="w-3 h-3" /><span className="text-[8px] font-black uppercase">Schedule</span></div>
                      <p className="font-black text-slate-900 text-sm">{block.startTime}</p>
                   </div>
                 </div>

                 <div className="flex items-center gap-3 py-4 border-y border-slate-50">
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                       {trainer?.profilePicture ? <img src={trainer.profilePicture} className="w-full h-full object-cover" /> : <User className="w-5 h-5 m-auto mt-2.5 text-slate-300" />}
                    </div>
                    <div className="flex-1">
                       <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">Lead Coach</p>
                       <p className="font-bold text-slate-900 text-sm">{trainer?.name}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">{block.paymentType === 'full' ? 'Full Price' : 'Reservation'}</p>
                       <p className="font-black text-slate-900 text-lg">${displayPrice?.toFixed(2)}</p>
                    </div>
                 </div>

                 <button 
                  onClick={() => navigate(`/app/facility/${id}/block/${block.id}`)}
                  className="w-full py-5 bg-black text-white rounded-[28px] font-black text-lg shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 group-hover:bg-slate-800"
                 >
                   View Detailed Plan <ArrowRight className="w-5 h-5" />
                 </button>
               </div>
            </div>
          );
        }) : (
          <div className="py-24 text-center text-slate-400 font-bold uppercase text-xs tracking-widest italic">No active blocks currently.</div>
        )}
      </div>
    </div>
  );
};

export default BlockListView;
import React, { useState } from 'react';
import { X, DollarSign, ShieldCheck, AlertCircle, RefreshCcw } from 'lucide-react';

interface RefundModalProps {
  title: string;
  referenceId: string;
  totalPaid: number;
  onConfirm: (refundableAmount: number) => void;
  onCancel: () => void;
}

const RefundModal: React.FC<RefundModalProps> = ({ title, referenceId, totalPaid, onConfirm, onCancel }) => {
  const [serviceFee] = useState(2.50); // Fixed mock service fee
  const refundableAmount = Math.max(0, totalPaid - serviceFee);

  return (
    <div className="fixed inset-0 z-[260] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-lg p-8 text-center space-y-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-300 border border-slate-200 text-left">
        <div className="flex justify-between items-center mb-2">
           <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <RefreshCcw className="w-6 h-6" />
           </div>
           <button onClick={onCancel} className="p-2 hover:bg-slate-50 rounded-lg text-slate-300 transition-colors"><X className="w-5 h-5" /></button>
        </div>
        
        <div className="space-y-1">
          <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Initiate Refund</h3>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title} • {referenceId}</p>
        </div>

        <div className="bg-slate-50 rounded-2xl p-5 space-y-4 border border-slate-100">
           <div className="flex justify-between text-xs font-bold text-slate-500">
              <span>Paid Amount</span>
              <span>${totalPaid.toFixed(2)}</span>
           </div>
           <div className="flex justify-between text-xs font-bold text-slate-400 italic">
              <span>Non-refundable Service Charge</span>
              <span>-${serviceFee.toFixed(2)}</span>
           </div>
           <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
              <span className="font-black text-slate-900 uppercase text-[10px]">Net Refundable</span>
              <span className="text-xl font-black text-blue-600">${refundableAmount.toFixed(2)}</span>
           </div>
        </div>

        <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100">
           <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
           <p className="text-[10px] font-bold text-amber-700 leading-relaxed uppercase">Refund will be processed back to the original payment source within 3-5 business days.</p>
        </div>

        <div className="space-y-2 pt-2">
          <button 
            onClick={() => onConfirm(refundableAmount)}
            className="w-full py-4 bg-blue-600 text-white rounded-xl font-black shadow-xl shadow-blue-500/20 active:scale-95 transition-all uppercase text-xs tracking-widest"
          >
            Confirm & Process Refund
          </button>
          <button 
            onClick={onCancel} 
            className="w-full py-3 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-slate-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default RefundModal;
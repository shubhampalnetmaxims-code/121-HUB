
import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationModalProps {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'primary' | 'warning';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  variant = 'primary'
}) => {
  const variantStyles = {
    danger: 'bg-red-600 hover:bg-red-700 shadow-red-600/10',
    primary: 'bg-slate-900 hover:bg-black shadow-black/10',
    warning: 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/10'
  };

  const iconStyles = {
    danger: 'bg-red-50 text-red-600 border-red-100',
    primary: 'bg-blue-50 text-blue-600 border-blue-100',
    warning: 'bg-amber-50 text-amber-600 border-amber-100'
  };

  return (
    <div className="fixed inset-0 z-[250] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-lg p-8 text-center space-y-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-300 border border-slate-200">
        <div className={`w-14 h-14 rounded-md border flex items-center justify-center mx-auto ${iconStyles[variant]} shadow-sm`}>
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-slate-900 tracking-tight uppercase">{title}</h3>
          <p className="text-slate-500 text-sm font-medium leading-relaxed">{message}</p>
        </div>
        <div className="space-y-2 pt-2">
          <button 
            onClick={onConfirm} 
            className={`w-full py-3 text-white rounded-md font-black text-xs uppercase tracking-widest shadow-md transition-all active:scale-95 ${variantStyles[variant]}`}
          >
            {confirmText}
          </button>
          <button 
            onClick={onCancel} 
            className="w-full py-3 text-slate-400 font-black text-xs uppercase tracking-widest hover:text-slate-600 transition-colors"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;

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
    danger: 'bg-red-600 hover:bg-red-700 shadow-red-500/20',
    primary: 'bg-black hover:bg-slate-800 shadow-black/10',
    warning: 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20'
  };

  const iconStyles = {
    danger: 'bg-red-50 text-red-600',
    primary: 'bg-blue-50 text-blue-600',
    warning: 'bg-amber-50 text-amber-500'
  };

  return (
    <div className="fixed inset-0 z-[250] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-[40px] p-8 text-center space-y-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-300">
        <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mx-auto ${iconStyles[variant]}`}>
          <AlertTriangle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h3>
          <p className="text-slate-500 text-sm font-medium leading-relaxed">{message}</p>
        </div>
        <div className="space-y-3">
          <button 
            onClick={onConfirm} 
            className={`w-full py-4 text-white rounded-2xl font-black shadow-xl transition-all active:scale-95 ${variantStyles[variant]}`}
          >
            {confirmText}
          </button>
          <button 
            onClick={onCancel} 
            className="w-full py-4 text-slate-400 font-bold hover:text-slate-600 transition-colors"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;


import React from 'react';
import { X, Bell, CheckCircle, AlertCircle, Info, Clock, Trash2 } from 'lucide-react';
import { useNotifications } from '../NotificationContext';
import { User } from '../../types';

interface NotificationListModalProps {
  currentUser: User | null;
  onClose: () => void;
}

const NotificationListModal: React.FC<NotificationListModalProps> = ({ currentUser, onClose }) => {
  const { notifications, markAsRead, clearNotifications } = useNotifications();
  
  const userNotifications = notifications.filter(n => n.target === currentUser?.id);
  const unreadCount = userNotifications.filter(n => !n.isRead).length;

  const handleClear = () => {
    if (currentUser) clearNotifications(currentUser.id);
  };

  return (
    <div className="absolute inset-0 z-[110] bg-black/60 backdrop-blur-md flex items-end animate-in fade-in duration-300">
      <div className="w-full bg-white rounded-t-[40px] flex flex-col max-h-[85%] animate-in slide-in-from-bottom duration-500 overflow-hidden shadow-2xl">
        <div className="p-6 pt-10 border-b border-slate-50 flex items-center justify-between">
          <div className="text-left">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Notifications</h3>
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
              {unreadCount} UNREAD MESSAGES
            </p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleClear} 
              className="p-3 bg-slate-50 text-slate-400 hover:text-red-500 rounded-2xl transition-colors"
              title="Clear All"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <button 
              onClick={onClose} 
              className="p-3 bg-slate-50 text-slate-900 rounded-2xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide pb-20">
          {userNotifications.length > 0 ? userNotifications.map(n => (
            <div 
              key={n.id}
              onClick={() => markAsRead(n.id)}
              className={`p-5 rounded-[28px] border transition-all text-left relative group ${
                n.isRead ? 'bg-white border-slate-100' : 'bg-blue-50/30 border-blue-100'
              }`}
            >
              {!n.isRead && (
                <div className="absolute top-5 right-5 w-2 h-2 bg-blue-600 rounded-full" />
              )}
              <div className="flex gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  n.type === 'success' ? 'bg-green-100 text-green-600' :
                  n.type === 'alert' ? 'bg-red-100 text-red-600' :
                  n.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  {n.type === 'success' && <CheckCircle className="w-5 h-5" />}
                  {n.type === 'alert' && <AlertCircle className="w-5 h-5" />}
                  {n.type === 'warning' && <AlertCircle className="w-5 h-5" />}
                  {n.type === 'info' && <Info className="w-5 h-5" />}
                </div>
                <div className="flex-1 space-y-1">
                  <h4 className="font-bold text-slate-900 text-sm leading-tight">{n.title}</h4>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">{n.message}</p>
                  <div className="pt-2 flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                    <Clock className="w-3 h-3" />
                    {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • 
                    {new Date(n.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <div className="py-20 text-center space-y-4">
              <div className="w-16 h-16 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mx-auto">
                <Bell className="w-8 h-8" />
              </div>
              <p className="font-bold text-slate-400">No notifications yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationListModal;

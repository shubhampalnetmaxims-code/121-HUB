
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { AppNotification } from '../types';

interface NotificationContextType {
  notifications: AppNotification[];
  addNotification: (title: string, message: string, type: AppNotification['type'], target: AppNotification['target']) => void;
  markAsRead: (id: string) => void;
  clearNotifications: (target: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('121_notifications');
      if (stored && stored !== 'null' && stored !== 'undefined') {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setNotifications(parsed);
        }
      }
    } catch (e) {
      console.error('Failed to load notifications:', e);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('121_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = useCallback((title: string, message: string, type: AppNotification['type'], target: AppNotification['target']) => {
    const newNotification: AppNotification = {
      id: Math.random().toString(36).substring(2, 9),
      title,
      message,
      type,
      target,
      createdAt: Date.now(),
      isRead: false
    };
    setNotifications(prev => [newNotification, ...(prev || [])]);
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => (prev || []).map(n => n.id === id ? { ...n, isRead: true } : n));
  }, []);

  const clearNotifications = useCallback((target: string) => {
    setNotifications(prev => (prev || []).filter(n => n.target !== target));
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications: notifications || [], addNotification, markAsRead, clearNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within a NotificationProvider');
  return context;
};

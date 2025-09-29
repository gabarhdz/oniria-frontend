import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import type { NotificationState } from './types';

interface NotificationProps {
  notification: NotificationState | null;
}

// Notification Component
export const Notification: React.FC<NotificationProps> = ({ notification }) => {
  if (!notification) return null;

  return (
    <div className={`fixed top-24 right-6 z-50 p-4 rounded-2xl shadow-2xl backdrop-blur-xl border transition-all duration-500 max-w-sm ${
      notification.type === 'success' 
        ? 'bg-green-500/20 border-green-400/30 text-green-100' 
        : 'bg-red-500/20 border-red-400/30 text-red-100'
    } animate-slide-in-right`}>
      <div className="flex items-center space-x-3">
        {notification.type === 'success' ? (
          <CheckCircle className="w-6 h-6 text-green-400 animate-scale-in" />
        ) : (
          <AlertCircle className="w-6 h-6 text-red-400 animate-shake" />
        )}
        <p className="font-medium">{notification.message}</p>
      </div>
    </div>
  );
};
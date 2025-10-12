// src/components/NotificationCenter.tsx
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  Bell, 
  BellRing, 
  Check, 
  CheckCheck, 
  X, 
  MessageSquare, 
  ThumbsUp, 
  UserPlus, 
  Sparkles,
  ExternalLink,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useNotifications } from '../hooks/useNotification';
import type { Notification } from '../hooks/useNotification';

// Mapeo de iconos según tipo de notificación
const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'new_post': return MessageSquare;
    case 'post_reply': return MessageSquare;
    case 'post_like': return ThumbsUp;
    case 'community_join': return UserPlus;
    case 'system': return Sparkles;
    default: return Bell;
  }
};

// Mapeo de colores según tipo
const getNotificationColor = (type: string) => {
  switch (type) {
    case 'new_post': return 'from-blue-500/20 to-blue-600/20';
    case 'post_reply': return 'from-purple-500/20 to-purple-600/20';
    case 'post_like': return 'from-pink-500/20 to-pink-600/20';
    case 'community_join': return 'from-emerald-500/20 to-emerald-600/20';
    case 'system': return 'from-yellow-500/20 to-yellow-600/20';
    default: return 'from-gray-500/20 to-gray-600/20';
  }
};

// Componente individual de notificación
const NotificationItem: React.FC<{
  notification: Notification;
  onRead: (id: string) => void;
  onClear: (id: string) => void;
}> = ({ notification, onRead, onClear }) => {
  const Icon = getNotificationIcon(notification.type);
  const colorClass = getNotificationColor(notification.type);

  const handleClick = () => {
    if (!notification.is_read) {
      onRead(notification.id);
    }
    if (notification.redirect_url) {
      window.location.href = notification.redirect_url;
    }
  };

  return (
    <div 
      className={`group relative p-4 rounded-xl transition-all duration-300 cursor-pointer hover:scale-[1.02] ${
        notification.is_read 
          ? 'bg-white/5 hover:bg-white/10' 
          : `bg-gradient-to-r ${colorClass} hover:bg-white/15 border-l-4 border-oniria_pink`
      } animate-fade-in-up`}
      onClick={handleClick}
    >
      {/* Unread indicator */}
      {!notification.is_read && (
        <div className="absolute top-2 right-2 w-2 h-2 bg-oniria_pink rounded-full animate-pulse" />
      )}

      <div className="flex items-start space-x-3">
        {/* Icon */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-oniria_purple to-oniria_pink flex items-center justify-center shadow-lg`}>
          <Icon className="w-5 h-5 text-white" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <h4 className="text-sm font-semibold text-oniria_lightpink truncate pr-2">
              {notification.title}
            </h4>
            {notification.redirect_url && (
              <ExternalLink className="w-3 h-3 text-oniria_lightpink/50 flex-shrink-0" />
            )}
          </div>
          
          <p className="text-xs text-oniria_lightpink/70 line-clamp-2 mb-2">
            {notification.message}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs text-oniria_lightpink/50">
              {notification.sender && (
                <span className="font-medium">{notification.sender.username}</span>
              )}
              {notification.community && (
                <>
                  <span>•</span>
                  <span>{notification.community.name}</span>
                </>
              )}
              <span>•</span>
              <span>
                {new Date(notification.created_at).toLocaleDateString('es-ES', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {!notification.is_read && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRead(notification.id);
                  }}
                  className="p-1.5 bg-oniria_purple/20 hover:bg-oniria_purple/40 text-oniria_lightpink rounded-lg transition-all duration-300"
                  title="Marcar como leída"
                >
                  <Check className="w-3 h-3" />
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClear(notification.id);
                }}
                className="p-1.5 bg-red-500/20 hover:bg-red-500/40 text-red-300 rounded-lg transition-all duration-300"
                title="Eliminar"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente principal del centro de notificaciones
export const NotificationCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const {
    notifications,
    unreadCount,
    isConnected,
    markAsRead,
    markAllAsRead,
    clearNotification,
  } = useNotifications();

  // Debug: Log cuando cambian las notificaciones
  useEffect(() => {
    console.log('📊 Notifications updated:', { 
      count: notifications.length, 
      unread: unreadCount,
      notifications 
    });
  }, [notifications, unreadCount]);

  // Calcular posición del dropdown
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX - 350 + rect.width,
      });
    }
  }, [isOpen]);

  // Cerrar con Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
    localStorage.setItem('notification_sound', (!soundEnabled).toString());
  };

  return (
    <>
      {/* Notification Bell Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 sm:p-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 rounded-xl transition-all duration-300 transform hover:scale-105 group"
        title="Notificaciones"
      >
        {unreadCount > 0 ? (
          <BellRing className="w-5 h-5 sm:w-6 sm:h-6 text-oniria_lightpink animate-bounce" />
        ) : (
          <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-oniria_lightpink group-hover:animate-wiggle" />
        )}
        
        {/* Unread badge */}
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-oniria_pink to-red-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
            <span className="text-white text-xs font-bold">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          </div>
        )}

        {/* Connection indicator */}
        <div className={`absolute bottom-0 right-0 w-2 h-2 rounded-full ${
          isConnected ? 'bg-emerald-500' : 'bg-red-500'
        } animate-pulse`} />
      </button>

      {/* Notification Dropdown usando Portal */}
      {isOpen && createPortal(
        <div className="fixed inset-0 z-[99999]">
          {/* Overlay */}
          <div 
            className="absolute inset-0"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div 
            className="absolute bg-gradient-to-br from-oniria_darkblue/98 via-oniria_blue/95 to-oniria_purple/98 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden animate-dropdown-enter"
            style={{
              top: dropdownPosition.top,
              left: Math.max(16, dropdownPosition.left),
              width: 'min(400px, calc(100vw - 32px))',
              maxHeight: '70vh',
              zIndex: 99999
            }}
          >
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-oniria_purple/30 to-oniria_pink/30 backdrop-blur-xl p-4 border-b border-white/10 z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-bold text-oniria_lightpink">
                    Notificaciones
                  </h3>
                  {unreadCount > 0 && (
                    <span className="px-2 py-1 bg-oniria_pink/30 text-oniria_lightpink text-xs font-bold rounded-full">
                      {unreadCount} nueva{unreadCount !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  {/* Toggle sound */}
                  <button
                    onClick={toggleSound}
                    className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300"
                    title={soundEnabled ? 'Silenciar' : 'Activar sonido'}
                  >
                    {soundEnabled ? (
                      <Volume2 className="w-4 h-4 text-oniria_lightpink" />
                    ) : (
                      <VolumeX className="w-4 h-4 text-oniria_lightpink/50" />
                    )}
                  </button>

                  {/* Close button */}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300"
                  >
                    <X className="w-4 h-4 text-oniria_lightpink" />
                  </button>
                </div>
              </div>

              {/* Actions */}
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center space-x-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-medium text-oniria_lightpink transition-all duration-300 transform hover:scale-105"
                >
                  <CheckCheck className="w-4 h-4" />
                  <span>Marcar todas como leídas</span>
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto max-h-[calc(70vh-120px)] p-4 space-y-2">
              {notifications.length > 0 ? (
                notifications.map((notification, index) => (
                  <div
                    key={notification.id}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <NotificationItem
                      notification={notification}
                      onRead={markAsRead}
                      onClear={clearNotification}
                    />
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-br from-oniria_purple/20 to-oniria_pink/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bell className="w-8 h-8 text-oniria_lightpink/50" />
                  </div>
                  <p className="text-oniria_lightpink/70 text-sm">
                    No tienes notificaciones
                  </p>
                  <p className="text-oniria_lightpink/50 text-xs mt-2">
                    Te avisaremos cuando haya novedades
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-gradient-to-r from-oniria_purple/20 to-oniria_pink/20 backdrop-blur-xl p-3 border-t border-white/10">
              <div className="flex items-center justify-between text-xs text-oniria_lightpink/60">
                <span>
                  {isConnected ? '🟢 Conectado' : '🔴 Desconectado'}
                </span>
                <span>
                  {notifications.length} notificación{notifications.length !== 1 ? 'es' : ''}
                </span>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};
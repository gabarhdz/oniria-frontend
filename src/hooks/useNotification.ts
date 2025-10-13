// useNotification.ts
import { useState, useEffect, useCallback, useRef } from 'react';

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  sender?: {
    id: string;
    username: string;
    profile_pic?: string;
  };
  community?: {
    id: string;
    name: string;
  };
  post?: {
    id: string;
    title: string;
  };
  redirect_url?: string;
  is_read: boolean;
  created_at: string;
}

export interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  isConnected: boolean;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  clearNotification: (notificationId: string) => void;
  playNotificationSound: () => void;
}

const WEBSOCKET_URL = 'ws://127.0.0.1:8000/ws/notifications/';

export const useNotifications = (): UseNotificationsReturn => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<number | undefined>(undefined);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isConnecting = useRef(false);

  const playNotificationSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(err => console.log('Audio play failed:', err));
    }
  }, []);

  const connectWebSocket = useCallback(() => {
    // Evitar múltiples conexiones simultáneas
    if (isConnecting.current || ws.current?.readyState === WebSocket.OPEN) {
      console.log('⚠️ Connection already in progress or open');
      return;
    }

    const token = localStorage.getItem('access_token');
    if (!token) {
      console.log('❌ No auth token found');
      return;
    }

    isConnecting.current = true;

    try {
      console.log('🔌 Connecting to WebSocket...');
      
      ws.current = new WebSocket(`${WEBSOCKET_URL}?token=${token}`);

      ws.current.onopen = () => {
        console.log('✅ WebSocket Connected');
        setIsConnected(true);
        isConnecting.current = false;
        
        // Solicitar notificaciones no leídas
        if (ws.current?.readyState === WebSocket.OPEN) {
          ws.current.send(JSON.stringify({ action: 'get_unread_count' }));
        }
      };

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('📩 WebSocket Message:', data);

          switch (data.type) {
            case 'initial_notifications':
              setNotifications(data.notifications);
              setUnreadCount(data.count);
              break;

            case 'new_notification':
              const newNotif = data.notification;
              setNotifications(prev => [newNotif, ...prev]);
              setUnreadCount(prev => prev + 1);
              
              playNotificationSound();
              
              if ('Notification' in window && Notification.permission === 'granted') {
                new Notification(newNotif.title, {
                  body: newNotif.message,
                  icon: '/img/Oniria.svg',
                  badge: '/img/Oniria.svg',
                });
              }
              break;

            case 'unread_count':
              setUnreadCount(data.count);
              break;

            case 'mark_read_success':
              setNotifications(prev =>
                prev.map(n =>
                  n.id === data.notification_id ? { ...n, is_read: true } : n
                )
              );
              setUnreadCount(prev => Math.max(0, prev - 1));
              break;

            case 'mark_all_read_success':
              setNotifications(prev =>
                prev.map(n => ({ ...n, is_read: true }))
              );
              setUnreadCount(0);
              break;

            case 'error':
              console.error('WebSocket error:', data.message);
              break;
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.current.onerror = (error) => {
        console.error('❌ WebSocket Error:', error);
        isConnecting.current = false;
      };

      ws.current.onclose = (event) => {
        console.log('🔌 WebSocket Closed:', event.code, event.reason);
        setIsConnected(false);
        isConnecting.current = false;
        
        // Solo reconectar si no fue un cierre intencional
        if (event.code !== 1000 && event.code !== 1001) {
          reconnectTimeout.current = window.setTimeout(() => {
            console.log('🔄 Attempting to reconnect...');
            connectWebSocket();
          }, 5000);
        }
      };
    } catch (error) {
      console.error('Error creating WebSocket:', error);
      isConnecting.current = false;
    }
  }, []); // Sin dependencias

  useEffect(() => {
    // Inicializar audio solo una vez
    const audio = new Audio();
    // NO cargar el archivo de audio por ahora para evitar errores
    audio.volume = 0.5;
    audioRef.current = audio;

    // Solicitar permiso para notificaciones
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Conectar WebSocket
    connectWebSocket();

    // Cleanup
    return () => {
      console.log('🧹 Cleaning up WebSocket connection');
      if (reconnectTimeout.current) {
        window.clearTimeout(reconnectTimeout.current);
      }
      if (ws.current) {
        ws.current.close(1000, 'Component unmounting');
        ws.current = null;
      }
      isConnecting.current = false;
    };
  }, [connectWebSocket]);

  const markAsRead = useCallback((notificationId: string) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        action: 'mark_as_read',
        notification_id: notificationId,
      }));
    }
  }, []);

  const markAllAsRead = useCallback(() => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        action: 'mark_all_as_read',
      }));
    }
  }, []);

  const clearNotification = useCallback((notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  }, []);

  return {
    notifications,
    unreadCount,
    isConnected,
    markAsRead,
    markAllAsRead,
    clearNotification,
    playNotificationSound,
  };
};
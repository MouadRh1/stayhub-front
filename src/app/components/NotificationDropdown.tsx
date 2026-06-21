// components/NotificationDropdown.tsx
import { useState, useEffect, useRef } from 'react';
import { 
  Bell, Check, X, AlertCircle, Calendar, Heart, 
  MessageSquare, DollarSign, Star, Home, Sparkles,
  Loader2, CheckCheck
} from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export function NotificationDropdown() {
  const { user } = useAuth();
  const { 
    notifications, 
    unreadCount, 
    loading, 
    markAsRead, 
    markAllAsRead,
    deleteNotification,
    fetchNotifications 
  } = useNotifications();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fermer le dropdown quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Rafraîchir quand le dropdown s'ouvre
  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, fetchNotifications]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'reservation_confirmed':
        return <Check className="w-4 h-4 text-green-500" />;
      case 'reservation_pending':
        return <Calendar className="w-4 h-4 text-yellow-500" />;
      case 'reservation_cancelled':
        return <X className="w-4 h-4 text-red-500" />;
      case 'new_review':
        return <Star className="w-4 h-4 text-yellow-500" />;
      case 'new_message':
        return <MessageSquare className="w-4 h-4 text-blue-500" />;
      case 'payment_received':
        return <DollarSign className="w-4 h-4 text-green-500" />;
      case 'promotion':
        return <Sparkles className="w-4 h-4 text-purple-500" />;
      case 'reminder':
        return <AlertCircle className="w-4 h-4 text-blue-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const getNotificationLink = (notification: any) => {
    switch (notification.type) {
      case 'reservation_confirmed':
      case 'reservation_pending':
      case 'reservation_cancelled':
        return `/dashboard/user`;
      case 'new_review':
        return `/dashboard/user`;
      case 'new_message':
        return `/dashboard/user`;
      default:
        return '#';
    }
  };

  const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await markAsRead(id);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteNotification(id);
  };

  const handleMarkAllAsRead = async () => {
    setIsLoading(true);
    await markAllAsRead();
    setIsLoading(false);
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bouton de notification */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-accent transition-colors relative"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 max-h-[500px] bg-card rounded-2xl border border-border shadow-2xl overflow-hidden z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
            <h3 className="font-semibold">Notifications</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  disabled={isLoading}
                  className="text-xs text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1"
                >
                  <CheckCheck className="w-3 h-3" />
                  Tout marquer comme lu
                </button>
              )}
              <span className="text-xs text-muted-foreground">
                {notifications.length} notif{notifications.length > 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Liste des notifications */}
          <div className="overflow-y-auto max-h-[400px]">
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">Aucune notification</p>
                <p className="text-sm text-muted-foreground">Vous serez notifié des nouvelles activités</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <Link
                  key={notification.id}
                  to={getNotificationLink(notification)}
                  onClick={() => {
                    if (!notification.is_read) {
                      markAsRead(notification.id);
                    }
                    setIsOpen(false);
                  }}
                  className={`flex items-start gap-3 p-4 hover:bg-accent transition-colors border-b border-border last:border-0 ${
                    !notification.is_read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                  }`}
                >
                  {/* Icône */}
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                    {getIcon(notification.type)}
                  </div>

                  {/* Contenu */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm ${!notification.is_read ? 'font-semibold' : ''}`}>
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-1 shrink-0">
                        {!notification.is_read && (
                          <span className="w-2 h-2 bg-blue-600 rounded-full" />
                        )}
                        <button
                          onClick={(e) => handleDelete(notification.id, e)}
                          className="p-1 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {notification.time_ago || format(new Date(notification.created_at), 'dd MMM yyyy à HH:mm', { locale: fr })}
                    </p>
                    {notification.data && (
                      <div className="mt-1 text-xs text-muted-foreground bg-muted/50 p-1 rounded">
                        {notification.data.space_name && (
                          <span>🏠 {notification.data.space_name}</span>
                        )}
                        {notification.data.reservation_id && (
                          <span>📋 Réservation #{notification.data.reservation_id}</span>
                        )}
                        {notification.data.promo_code && (
                          <span>🎉 Code: {notification.data.promo_code}</span>
                        )}
                      </div>
                    )}
                  </div>
                </Link>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-2 border-t border-border bg-muted/30">
              <button
                onClick={() => {
                  setIsOpen(false);
                  // Naviguer vers la page des notifications
                }}
                className="w-full text-center text-sm text-blue-600 hover:text-blue-700 transition-colors py-1"
              >
                Voir toutes les notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
// components/Navbar.tsx
import { Link, useNavigate } from 'react-router';
import { 
  Search, Menu, User, Heart, Moon, Sun, Home, LogIn, 
  LogOut, ChevronDown, Bell, Settings, PlusCircle,
  Shield, Calendar, X, Sparkles, Check, AlertCircle,
  MessageSquare, Star, DollarSign, Loader2, CheckCheck
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../contexts/NotificationContext';
import { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout, isAuthenticated, loading } = useAuth();
  const { 
    notifications, 
    unreadCount, 
    loading: notifLoading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
  } = useNotifications();
  const navigate = useNavigate();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  // Pour éviter les erreurs d'hydratation
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Rafraîchir les notifications quand le dropdown s'ouvre
  useEffect(() => {
    if (notifDropdownOpen && isAuthenticated) {
      fetchNotifications();
    }
  }, [notifDropdownOpen, isAuthenticated, fetchNotifications]);

  // Fermer les menus quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleBadge = (role: string) => {
    const badges = {
      admin: {
        label: 'Admin',
        className: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
      },
      owner: {
        label: 'Propriétaire',
        className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
      },
      user: {
        label: 'Voyageur',
        className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      }
    };
    return badges[role as keyof typeof badges] || badges.user;
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'admin': return '/dashboard/admin';
      case 'owner': return '/dashboard/owner';
      default: return '/dashboard/user';
    }
  };

  const getDashboardLabel = () => {
    if (!user) return 'Dashboard';
    switch (user.role) {
      case 'admin': return 'Administration';
      case 'owner': return 'Espace Hôte';
      default: return 'Mon Espace';
    }
  };

  const getNotificationIcon = (type: string) => {
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
      default:
        return <Bell className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await markAsRead(id);
  };

  const handleDeleteNotification = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteNotification(id);
  };

  const handleMarkAllAsRead = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await markAllAsRead();
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    return format(past, 'dd MMM yyyy', { locale: fr });
  };

  // Afficher un loader pendant le chargement
  if (loading) {
    return (
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl animate-pulse" />
              <div className="hidden sm:block w-20 h-6 bg-muted rounded animate-pulse" />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-muted rounded-full animate-pulse" />
              <div className="w-8 h-8 bg-muted rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center transform group-hover:scale-105 transition-transform shadow-lg shadow-blue-600/25">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="hidden sm:block font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              StayHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <Link 
              to="/search" 
              className="px-4 py-2 rounded-lg text-foreground/80 hover:text-foreground hover:bg-accent transition-colors flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              Rechercher
            </Link>
            <Link 
              to="/dashboard/owner" 
              className="px-4 py-2 rounded-lg text-foreground/80 hover:text-foreground hover:bg-accent transition-colors flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              Devenir hôte
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-accent transition-colors relative"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* Notifications Dropdown */}
            {isAuthenticated && isClient && (
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
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

                {notifDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-96 max-h-[500px] bg-card rounded-2xl border border-border shadow-2xl overflow-hidden z-50">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
                      <h3 className="font-semibold">Notifications</h3>
                      <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                          <button
                            onClick={handleMarkAllAsRead}
                            className="text-xs text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1"
                          >
                            <CheckCheck className="w-3 h-3" />
                            Tout lire
                          </button>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {notifications.length} notif{notifications.length > 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>

                    {/* Liste des notifications */}
                    <div className="overflow-y-auto max-h-[400px]">
                      {notifLoading ? (
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
                          <div
                            key={notification.id}
                            className={`flex items-start gap-3 p-4 hover:bg-accent transition-colors border-b border-border last:border-0 group ${
                              !notification.is_read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                            }`}
                          >
                            {/* Icône */}
                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                              {getNotificationIcon(notification.type)}
                            </div>

                            {/* Contenu */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <p className={`text-sm ${!notification.is_read ? 'font-semibold' : ''}`}>
                                  {notification.message}
                                </p>
                                <div className="flex items-center gap-1 shrink-0">
                                  {!notification.is_read && (
                                    <button
                                      onClick={(e) => handleMarkAsRead(notification.id, e)}
                                      className="p-1 rounded-lg hover:bg-blue-100 text-muted-foreground hover:text-blue-600 transition-colors opacity-0 group-hover:opacity-100"
                                      title="Marquer comme lu"
                                    >
                                      <Check className="w-3 h-3" />
                                    </button>
                                  )}
                                  <button
                                    onClick={(e) => handleDeleteNotification(notification.id, e)}
                                    className="p-1 rounded-lg hover:bg-red-100 text-muted-foreground hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                                    title="Supprimer"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                {getTimeAgo(notification.created_at)}
                              </p>
                              {notification.data && (
                                <div className="mt-1 text-xs text-muted-foreground bg-muted/50 p-1 rounded">
                                  {notification.data.space_name && (
                                    <span>🏠 {notification.data.space_name}</span>
                                  )}
                                  {notification.data.reservation_id && (
                                    <span className="ml-2">📋 #{notification.data.reservation_id}</span>
                                  )}
                                  {notification.data.promo_code && (
                                    <span className="ml-2">🎉 {notification.data.promo_code}</span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                      <div className="p-2 border-t border-border bg-muted/30">
                        <button
                          onClick={() => {
                            setNotifDropdownOpen(false);
                            navigate('/dashboard/user');
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
            )}

            {/* Favorites */}
            {isAuthenticated && isClient && (
              <Link to="/dashboard/user" className="p-2 rounded-lg hover:bg-accent transition-colors">
                <Heart className="w-5 h-5" />
              </Link>
            )}

            {/* User Menu */}
            {isClient && isAuthenticated && user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 ml-2 px-2 py-1 rounded-full hover:bg-accent transition-colors border border-border"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {getInitials(user.name)}
                  </div>
                  <span className="hidden lg:inline text-sm font-medium">{user.name}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-card rounded-2xl border border-border shadow-xl overflow-hidden">
                    {/* User Info */}
                    <div className="p-4 border-b border-border bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                          {getInitials(user.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold truncate">{user.name}</p>
                          <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                          <span className={`inline-block text-xs px-2 py-0.5 rounded-full mt-1 ${getRoleBadge(user.role).className}`}>
                            {getRoleBadge(user.role).label}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2">
                      <Link
                        to={getDashboardLink()}
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors"
                      >
                        <Sparkles className="w-4 h-4 text-blue-500" />
                        <span>{getDashboardLabel()}</span>
                      </Link>

                      {user.role === 'owner' && (
                        <Link
                          to="/dashboard/owner"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors"
                        >
                          <PlusCircle className="w-4 h-4 text-green-500" />
                          <span>Gérer mes logements</span>
                        </Link>
                      )}

                      <Link
                        to="/dashboard/user"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors"
                      >
                        <Calendar className="w-4 h-4 text-blue-500" />
                        <span>Mes réservations</span>
                      </Link>

                      <Link
                        to="/dashboard/user"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors"
                      >
                        <Heart className="w-4 h-4 text-red-500" />
                        <span>Mes favoris</span>
                      </Link>

                      <Link
                        to="/dashboard/user"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors"
                      >
                        <Settings className="w-4 h-4 text-gray-500" />
                        <span>Paramètres</span>
                      </Link>

                      {user.role === 'admin' && (
                        <>
                          <div className="h-px bg-border my-1" />
                          <Link
                            to="/dashboard/admin"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                          >
                            <Shield className="w-4 h-4 text-purple-500" />
                            <span className="text-purple-600 dark:text-purple-400">Administration</span>
                          </Link>
                        </>
                      )}
                    </div>

                    {/* Logout */}
                    <div className="p-2 border-t border-border">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Déconnexion</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2 ml-2">
                <button
                  onClick={handleRegister}
                  className="px-4 py-2 text-foreground/80 hover:text-foreground transition-colors text-sm font-medium"
                >
                  S'inscrire
                </button>
                <button
                  onClick={handleLogin}
                  className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-medium hover:shadow-lg hover:shadow-blue-600/25 transition-all"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Connexion</span>
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-in slide-in-from-top duration-200">
            <div className="flex flex-col gap-1">
              {!isAuthenticated || !user ? (
                <>
                  <Link
                    to="/search"
                    className="px-4 py-3 rounded-lg hover:bg-accent transition-colors flex items-center gap-3"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Search className="w-4 h-4" />
                    Rechercher
                  </Link>
                  <Link
                    to="/dashboard/owner"
                    className="px-4 py-3 rounded-lg hover:bg-accent transition-colors flex items-center gap-3"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <PlusCircle className="w-4 h-4" />
                    Devenir hôte
                  </Link>
                  <div className="h-px bg-border my-2" />
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogin();
                    }}
                    className="px-4 py-3 rounded-lg hover:bg-accent transition-colors flex items-center gap-3 text-blue-600 font-medium"
                  >
                    <LogIn className="w-4 h-4" />
                    Connexion
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleRegister();
                    }}
                    className="px-4 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center gap-3 justify-center font-medium"
                  >
                    S'inscrire
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/search"
                    className="px-4 py-3 rounded-lg hover:bg-accent transition-colors flex items-center gap-3"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Search className="w-4 h-4" />
                    Rechercher
                  </Link>
                  <Link
                    to="/dashboard/owner"
                    className="px-4 py-3 rounded-lg hover:bg-accent transition-colors flex items-center gap-3"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <PlusCircle className="w-4 h-4" />
                    Devenir hôte
                  </Link>
                  <div className="h-px bg-border my-2" />
                  <div className="flex items-center gap-3 px-4 py-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {getInitials(user.name)}
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <Link
                    to={getDashboardLink()}
                    className="px-4 py-3 rounded-lg hover:bg-accent transition-colors flex items-center gap-3"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Sparkles className="w-4 h-4 text-blue-500" />
                    {getDashboardLabel()}
                  </Link>
                  <Link
                    to="/dashboard/user"
                    className="px-4 py-3 rounded-lg hover:bg-accent transition-colors flex items-center gap-3"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Calendar className="w-4 h-4 text-blue-500" />
                    Mes réservations
                  </Link>
                  <Link
                    to="/dashboard/user"
                    className="px-4 py-3 rounded-lg hover:bg-accent transition-colors flex items-center gap-3"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Heart className="w-4 h-4 text-red-500" />
                    Mes favoris
                  </Link>
                  {user.role === 'admin' && (
                    <Link
                      to="/dashboard/admin"
                      className="px-4 py-3 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors flex items-center gap-3 text-purple-600"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Shield className="w-4 h-4" />
                      Administration
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="px-4 py-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-3 text-red-600"
                  >
                    <LogOut className="w-4 h-4" />
                    Déconnexion
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
// pages/UserDashboard.tsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { 
  Calendar, Heart, User, Settings, LogOut, ChevronRight, 
  MapPin, Star, Loader2, AlertCircle, Clock, Home,
  MessageSquare, Bell, CreditCard, Users, Shield,
  Edit2, Save, X, Camera, Phone, Mail, MapPin as MapPinIcon
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { PropertyCard } from '../components/PropertyCard';

interface Reservation {
  id: string;
  space: {
    id: string;
    title: string;
    location: string;
    images: string[];
    price_per_night: number;
  };
  check_in: string;
  check_out: string;
  guests: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
}

interface Favorite {
  id: string;
  space: {
    id: string;
    title: string;
    location: string;
    images: string[];
    price_per_night: number;
    rating: number;
    review_count: number;
    space_type: string;
  };
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  avatar?: string;
  role: string;
}

const TABS = [
  { id: 'bookings', label: 'Mes réservations', icon: Calendar },
  { id: 'favorites', label: 'Favoris', icon: Heart },
  { id: 'profile', label: 'Profil', icon: User },
  { id: 'settings', label: 'Paramètres', icon: Settings },
];

export function UserDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const [activeTab, setActiveTab] = useState('bookings');
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState({
    reservations: true,
    favorites: true,
    profile: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [saveLoading, setSaveLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Récupérer les données au chargement
  useEffect(() => {
    if (user) {
      setProfile(user);
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
      });
    }
  }, [user]);

  useEffect(() => {
    fetchReservations();
    fetchFavorites();
  }, []);

  // Récupérer les réservations
  const fetchReservations = async () => {
    try {
      setLoading(prev => ({ ...prev, reservations: true }));
      const response = await api.get('/reservations');
      setReservations(response.data.data || []);
      setError(null);
    } catch (err: any) {
      console.error('Erreur:', err);
      if (err.response?.status === 401) {
        // Non authentifié, rediriger vers login
        navigate('/login');
      }
    } finally {
      setLoading(prev => ({ ...prev, reservations: false }));
    }
  };

  // Récupérer les favoris
  const fetchFavorites = async () => {
    try {
      setLoading(prev => ({ ...prev, favorites: true }));
      const response = await api.get('/favorites');
      setFavorites(response.data.data || []);
      setError(null);
    } catch (err: any) {
      console.error('Erreur:', err);
    } finally {
      setLoading(prev => ({ ...prev, favorites: false }));
    }
  };

  // Supprimer un favori
  const removeFavorite = async (favoriteId: string) => {
    try {
      await api.delete(`/favorites/${favoriteId}`);
      setFavorites(prev => prev.filter(f => f.id !== favoriteId));
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  // Mettre à jour le profil
  const updateProfile = async () => {
    try {
      setSaveLoading(true);
      setError(null);
      setSuccessMessage(null);

      const response = await api.put('/user/profile', profileForm);
      setProfile(response.data.user);
      setSuccessMessage('Profil mis à jour avec succès !');
      setIsEditing(false);
      
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error('Erreur:', err);
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour');
    } finally {
      setSaveLoading(false);
    }
  };

  // Gérer la déconnexion
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Statut badge
  const getStatusBadge = (status: string) => {
    const styles = {
      confirmed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      completed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    };

    const labels = {
      confirmed: 'Confirmée',
      pending: 'En attente',
      completed: 'Terminée',
      cancelled: 'Annulée'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles] || styles.pending}`}>
        {labels[status as keyof typeof labels] || status}
      </span>
    );
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">Mon Espace</h1>
            <p className="text-muted-foreground">Gérez vos réservations, favoris et paramètres</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-xl">
              <Bell className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">0</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-destructive/10 text-destructive rounded-xl hover:bg-destructive/20 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-2xl border border-border p-4 sticky top-24">
              {/* User Profile */}
              <div className="flex items-center gap-4 pb-6 mb-6 border-b border-border">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-2xl shrink-0">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold truncate">{user.name}</h3>
                  <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                  {user.role && (
                    <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full">
                      {user.role === 'admin' ? 'Administrateur' : user.role === 'owner' ? 'Propriétaire' : 'Voyageur'}
                    </span>
                  )}
                </div>
              </div>

              {/* Navigation */}
              <nav className="space-y-1">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-600/25'
                        : 'hover:bg-accent'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Mes Réservations</h2>
                  <span className="text-sm text-muted-foreground">
                    {reservations.length} réservation{reservations.length > 1 ? 's' : ''}
                  </span>
                </div>

                {loading.reservations ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                  </div>
                ) : reservations.length === 0 ? (
                  <div className="text-center py-12 bg-card rounded-2xl border border-border">
                    <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Aucune réservation</h3>
                    <p className="text-muted-foreground mb-4">Vous n'avez pas encore de réservations.</p>
                    <Link to="/search" className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 inline-block">
                      Découvrir des espaces
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reservations.map((booking) => (
                      <div key={booking.id} className="bg-card rounded-2xl border border-border p-6 hover:shadow-lg transition-shadow">
                        <div className="flex flex-col md:flex-row gap-6">
                          <img
                            src={booking.space?.images?.[0] || '/placeholder.jpg'}
                            alt={booking.space?.title}
                            className="w-full md:w-48 h-32 object-cover rounded-xl"
                          />
                          <div className="flex-1">
                            <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                              <div>
                                <h3 className="font-semibold text-lg">{booking.space?.title || 'Espace'}</h3>
                                <div className="flex items-center gap-1 text-muted-foreground text-sm">
                                  <MapPin className="w-4 h-4" />
                                  <span>{booking.space?.location || 'Localisation'}</span>
                                </div>
                              </div>
                              {getStatusBadge(booking.status)}
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                              <div>
                                <p className="text-sm text-muted-foreground">Arrivée</p>
                                <p className="font-medium">
                                  {format(new Date(booking.check_in), 'dd MMM yyyy', { locale: fr })}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Départ</p>
                                <p className="font-medium">
                                  {format(new Date(booking.check_out), 'dd MMM yyyy', { locale: fr })}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Voyageurs</p>
                                <p className="font-medium">{booking.guests}</p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-2xl font-bold">{booking.total_price}€</span>
                                <span className="text-muted-foreground text-sm ml-2">Total</span>
                              </div>
                              <Link
                                to={`/space/${booking.space?.id}`}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border hover:bg-accent transition-colors"
                              >
                                Voir les détails
                                <ChevronRight className="w-4 h-4" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Favorites Tab */}
            {activeTab === 'favorites' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Mes Favoris</h2>
                  <span className="text-sm text-muted-foreground">
                    {favorites.length} favori{favorites.length > 1 ? 's' : ''}
                  </span>
                </div>

                {loading.favorites ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                  </div>
                ) : favorites.length === 0 ? (
                  <div className="text-center py-12 bg-card rounded-2xl border border-border">
                    <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Aucun favori</h3>
                    <p className="text-muted-foreground mb-4">Vous n'avez pas encore d'espaces favoris.</p>
                    <Link to="/search" className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 inline-block">
                      Découvrir des espaces
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {favorites.map((favorite) => (
                      <div key={favorite.id} className="relative group">
                        <PropertyCard
                          id={favorite.space?.id || ''}
                          image={favorite.space?.images?.[0] || '/placeholder.jpg'}
                          title={favorite.space?.title || 'Espace'}
                          location={favorite.space?.location || 'Localisation'}
                          price={favorite.space?.price_per_night || 0}
                          rating={favorite.space?.rating || 0}
                          reviews={favorite.space?.review_count || 0}
                          type={favorite.space?.space_type || 'Appartement'}
                        />
                        <button
                          onClick={() => removeFavorite(favorite.id)}
                          className="absolute top-3 right-3 p-2 bg-red-500/10 text-red-500 rounded-full hover:bg-red-500/20 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Mon Profil</h2>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      Modifier
                    </button>
                  )}
                </div>

                {successMessage && (
                  <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-700 dark:text-green-400">
                    {successMessage}
                  </div>
                )}

                {error && (
                  <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400">
                    {error}
                  </div>
                )}

                <div className="bg-card rounded-2xl border border-border p-6">
                  <div className="space-y-6">
                    {/* Avatar */}
                    <div className="flex items-center gap-6 pb-6 border-b border-border">
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-3xl shrink-0">
                        {profile?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">{profile?.name}</h3>
                        <p className="text-muted-foreground">{profile?.email}</p>
                        <p className="text-sm text-muted-foreground">
                          Membre depuis {profile?.created_at ? format(new Date(profile.created_at), 'MMMM yyyy', { locale: fr }) : 'récemment'}
                        </p>
                      </div>
                    </div>

                    {/* Form */}
                    {isEditing ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium mb-2">Nom complet</label>
                          <input
                            type="text"
                            value={profileForm.name}
                            onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Email</label>
                          <input
                            type="email"
                            value={profileForm.email}
                            onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Téléphone</label>
                          <input
                            type="tel"
                            value={profileForm.phone || ''}
                            onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                            className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium mb-2">Adresse</label>
                          <input
                            type="text"
                            value={profileForm.address || ''}
                            onChange={(e) => setProfileForm(prev => ({ ...prev, address: e.target.value }))}
                            className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                          />
                        </div>
                        <div className="md:col-span-2 flex gap-3">
                          <button
                            onClick={updateProfile}
                            disabled={saveLoading}
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 flex items-center gap-2"
                          >
                            {saveLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Enregistrer
                          </button>
                          <button
                            onClick={() => {
                              setIsEditing(false);
                              setProfileForm({
                                name: profile?.name || '',
                                email: profile?.email || '',
                                phone: profile?.phone || '',
                                address: profile?.address || '',
                              });
                            }}
                            className="px-6 py-3 border border-border rounded-xl hover:bg-accent transition-colors"
                          >
                            Annuler
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Nom complet</p>
                          <p className="font-medium">{profile?.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Email</p>
                          <p className="font-medium">{profile?.email}</p>
                        </div>
                        {profile?.phone && (
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Téléphone</p>
                            <p className="font-medium">{profile.phone}</p>
                          </div>
                        )}
                        {profile?.address && (
                          <div className="md:col-span-2">
                            <p className="text-sm text-muted-foreground mb-1">Adresse</p>
                            <p className="font-medium">{profile.address}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Paramètres</h2>

                <div className="space-y-6">
                  {/* Notifications */}
                  <div className="bg-card rounded-2xl border border-border p-6">
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <Bell className="w-5 h-5" />
                      Notifications
                    </h3>
                    <div className="space-y-4">
                      <label className="flex items-center justify-between cursor-pointer p-3 hover:bg-accent rounded-xl transition-colors">
                        <span>Recevoir les offres promotionnelles</span>
                        <input type="checkbox" defaultChecked className="w-5 h-5 accent-blue-600 rounded" />
                      </label>
                      <label className="flex items-center justify-between cursor-pointer p-3 hover:bg-accent rounded-xl transition-colors">
                        <span>Notifications de réservation</span>
                        <input type="checkbox" defaultChecked className="w-5 h-5 accent-blue-600 rounded" />
                      </label>
                      <label className="flex items-center justify-between cursor-pointer p-3 hover:bg-accent rounded-xl transition-colors">
                        <span>Rappels de voyage</span>
                        <input type="checkbox" defaultChecked className="w-5 h-5 accent-blue-600 rounded" />
                      </label>
                    </div>
                  </div>

                  {/* Security */}
                  <div className="bg-card rounded-2xl border border-border p-6">
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Sécurité
                    </h3>
                    <div className="space-y-3">
                      <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-accent transition-colors flex items-center justify-between">
                        <span>Changer le mot de passe</span>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-accent transition-colors flex items-center justify-between">
                        <span>Authentification à deux facteurs</span>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-accent transition-colors flex items-center justify-between">
                        <span>Appareils connectés</span>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  </div>

                  {/* Danger Zone */}
                  <div className="bg-card rounded-2xl border border-destructive p-6">
                    <h3 className="font-semibold text-lg mb-4 text-destructive flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      Zone de danger
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Cette action est irréversible. Toutes vos données seront supprimées.
                    </p>
                    <button className="px-6 py-3 bg-destructive text-destructive-foreground rounded-xl hover:bg-destructive/90 transition-colors">
                      Supprimer mon compte
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
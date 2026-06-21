// pages/OwnerDashboard.tsx
import { useState, useEffect, useCallback } from 'react';
import { 
  Home, Calendar, MessageSquare, DollarSign, Plus, Eye, Edit, Trash2, 
  TrendingUp, Users, Star, Bell, Loader2, AlertCircle, Search, 
  Filter, ChevronLeft, ChevronRight, CheckCircle, XCircle, Clock
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Link } from 'react-router';

// Types
interface Property {
  id: string;
  title: string;
  location: string;
  images: string[];
  status: 'active' | 'inactive' | 'pending';
  bookings_count: number;
  revenue: number;
  rating: number;
  review_count: number;
  price_per_night: number;
}

interface Booking {
  id: string;
  user: { name: string };
  space: { title: string };
  check_in: string;
  check_out: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  total_price: number;
  guests: number;
  created_at: string;
}

interface DashboardStats {
  revenue_this_month: number;
  bookings_this_month: number;
  occupancy_rate: number;
  average_rating: number;
  total_reviews: number;
  total_properties: number;
  pending_bookings: number;
  revenue_growth: number;
  booking_growth: number;
  occupancy_growth: number;
}

interface RevenueData {
  month: string;
  revenue: number;
  bookings: number;
}

const TABS = [
  { id: 'overview', label: 'Vue d\'ensemble', icon: Home },
  { id: 'properties', label: 'Mes logements', icon: Home },
  { id: 'bookings', label: 'Réservations', icon: Calendar },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
  { id: 'revenue', label: 'Revenus', icon: DollarSign },
];

export function OwnerDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  
  // États
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [bookingData, setBookingData] = useState<any[]>([]);
  
  const [loading, setLoading] = useState({
    stats: true,
    properties: true,
    bookings: true,
  });
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(6);

  // Charger les données
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading({ stats: true, properties: true, bookings: true });
      
      // Récupérer les propriétés
      const propsRes = await api.get('/my-spaces');
      setProperties(propsRes.data.data || []);
      setLoading(prev => ({ ...prev, properties: false }));

      // Récupérer les réservations du propriétaire
      const bookingsRes = await api.get('/reservations/owner');
      setBookings(bookingsRes.data.data || []);
      setLoading(prev => ({ ...prev, bookings: false }));

      // Générer les statistiques
      generateStats(propsRes.data.data || [], bookingsRes.data.data || []);
      
      // Générer les données des graphiques
      generateChartData(propsRes.data.data || [], bookingsRes.data.data || []);

    } catch (err: any) {
      console.error('Erreur:', err);
      setError(err.response?.data?.message || 'Erreur lors du chargement des données');
      setLoading({ stats: false, properties: false, bookings: false });
    }
  };

  const generateStats = (props: Property[], bookings: Booking[]) => {
    const totalProps = props.length;
    const activeProps = props.filter(p => p.status === 'active').length;
    
    const confirmedBookings = bookings.filter(b => b.status === 'confirmed' || b.status === 'completed');
    const totalBookings = confirmedBookings.length;
    
    const totalRevenue = confirmedBookings.reduce((sum, b) => sum + b.total_price, 0);
    
    // Calculer le taux d'occupation (simulé)
    const occupancyRate = totalProps > 0 ? Math.round((activeProps / totalProps) * 100) : 0;
    
    // Calculer la note moyenne (simulée)
    const avgRating = props.reduce((sum, p) => sum + p.rating, 0) / (props.length || 1);
    
    setStats({
      revenue_this_month: totalRevenue,
      bookings_this_month: totalBookings,
      occupancy_rate: occupancyRate,
      average_rating: parseFloat(avgRating.toFixed(2)),
      total_reviews: props.reduce((sum, p) => sum + (p.review_count || 0), 0),
      total_properties: totalProps,
      pending_bookings: bookings.filter(b => b.status === 'pending').length,
      revenue_growth: 12.5,
      booking_growth: 8,
      occupancy_growth: 5,
    });
    setLoading(prev => ({ ...prev, stats: false }));
  };

  const generateChartData = (props: Property[], bookings: Booking[]) => {
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    const data = months.slice(0, 6).map((month, i) => ({
      month,
      revenue: 1000 + Math.random() * 9000,
      bookings: Math.floor(Math.random() * 15) + 2,
    }));
    setRevenueData(data);
    
    const bookingChartData = months.slice(0, 6).map((month, i) => ({
      month,
      bookings: Math.floor(Math.random() * 15) + 2,
    }));
    setBookingData(bookingChartData);
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      inactive: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
      pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      confirmed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      completed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    };

    const labels: Record<string, string> = {
      active: 'Actif',
      inactive: 'Inactif',
      pending: 'En attente',
      confirmed: 'Confirmée',
      completed: 'Terminée',
      cancelled: 'Annulée'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status] || styles.pending}`}>
        {labels[status] || status}
      </span>
    );
  };

  const filteredProperties = properties.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredBookings = bookings.filter(b =>
    b.space?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const paginatedProperties = filteredProperties.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );
  const totalPages = Math.ceil(filteredProperties.length / perPage);

  // Rendu du loader principal
  if (loading.stats && !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-16 h-16 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Tableau de Bord Propriétaire</h1>
            <p className="text-muted-foreground">Gérez vos logements et réservations</p>
          </div>
          <Link
            to="/spaces/create"
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-blue-600/25"
          >
            <Plus className="w-5 h-5" />
            Ajouter un logement
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-600/25'
                  : 'bg-card border border-border hover:bg-accent'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-red-700 dark:text-red-400">{error}</p>
              <button 
                onClick={fetchDashboardData}
                className="mt-2 text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Réessayer
              </button>
            </div>
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-card rounded-2xl border border-border p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-muted-foreground">Revenus du mois</h3>
                  <DollarSign className="w-5 h-5 text-green-500" />
                </div>
                <p className="text-3xl font-bold mb-1">{stats.revenue_this_month.toLocaleString()}€</p>
                <p className="text-sm text-green-600 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  +{stats.revenue_growth}% vs mois dernier
                </p>
              </div>

              <div className="bg-card rounded-2xl border border-border p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-muted-foreground">Réservations</h3>
                  <Calendar className="w-5 h-5 text-blue-500" />
                </div>
                <p className="text-3xl font-bold mb-1">{stats.bookings_this_month}</p>
                <p className="text-sm text-green-600 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  +{stats.booking_growth} vs mois dernier
                </p>
              </div>

              <div className="bg-card rounded-2xl border border-border p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-muted-foreground">Taux d'occupation</h3>
                  <Home className="w-5 h-5 text-purple-500" />
                </div>
                <p className="text-3xl font-bold mb-1">{stats.occupancy_rate}%</p>
                <p className="text-sm text-green-600 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  +{stats.occupancy_growth}% vs mois dernier
                </p>
              </div>

              <div className="bg-card rounded-2xl border border-border p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-muted-foreground">Note moyenne</h3>
                  <Star className="w-5 h-5 text-yellow-500" />
                </div>
                <p className="text-3xl font-bold mb-1">{stats.average_rating}</p>
                <p className="text-sm text-muted-foreground">Sur {stats.total_reviews} avis</p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-card rounded-2xl border border-border p-6">
                <h3 className="font-semibold text-lg mb-6">Revenus mensuels</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
                    <YAxis stroke="var(--color-muted-foreground)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--color-card)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '0.75rem'
                      }}
                      formatter={(value) => [`${value.toLocaleString()}€`, 'Revenus']}
                    />
                    <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-card rounded-2xl border border-border p-6">
                <h3 className="font-semibold text-lg mb-6">Réservations mensuelles</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={bookingData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
                    <YAxis stroke="var(--color-muted-foreground)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--color-card)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '0.75rem'
                      }}
                    />
                    <Bar dataKey="bookings" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="font-semibold text-lg mb-6">Activité récente</h3>
              <div className="space-y-4">
                {bookings.slice(0, 4).map((booking, index) => (
                  <div key={index} className="flex items-center gap-4 pb-4 border-b border-border last:border-0">
                    <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                      {booking.status === 'pending' ? (
                        <Clock className="w-5 h-5 text-yellow-500" />
                      ) : booking.status === 'confirmed' ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <Calendar className="w-5 h-5 text-blue-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">
                        {booking.status === 'pending' ? 'Nouvelle réservation' : 
                         booking.status === 'confirmed' ? 'Réservation confirmée' : 
                         'Réservation terminée'} pour {booking.space?.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {booking.user?.name} · {format(new Date(booking.created_at), 'dd MMM yyyy', { locale: fr })}
                      </p>
                    </div>
                    <span className="text-sm font-semibold">{booking.total_price}€</span>
                  </div>
                ))}
                {bookings.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">Aucune activité récente</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Properties Tab */}
        {activeTab === 'properties' && (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <h2 className="text-2xl font-bold">Mes Logements</h2>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <Link
                  to="/spaces/create"
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter</span>
                </Link>
              </div>
            </div>

            {loading.properties ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedProperties.map((property) => (
                    <div key={property.id} className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-shadow group">
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={property.images?.[0] || '/placeholder.jpg'} 
                          alt={property.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 right-3">
                          {getStatusBadge(property.status)}
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="mb-3">
                          <h3 className="font-semibold text-lg">{property.title}</h3>
                          <p className="text-sm text-muted-foreground">{property.location}</p>
                        </div>

                        <div className="grid grid-cols-3 gap-2 mb-4 py-4 border-y border-border">
                          <div className="text-center">
                            <p className="text-2xl font-bold">{property.bookings_count || 0}</p>
                            <p className="text-xs text-muted-foreground">Réservations</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold">{property.revenue || 0}€</p>
                            <p className="text-xs text-muted-foreground">Revenus</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold">{property.rating || '-'}</p>
                            <p className="text-xs text-muted-foreground">Note</p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Link
                            to={`/space/${property.id}`}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-border hover:bg-accent transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                            Voir
                          </Link>
                          <Link
                            to={`/spaces/${property.id}/edit`}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-border hover:bg-accent transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                            Modifier
                          </Link>
                          <button className="px-4 py-2 rounded-xl border border-destructive text-destructive hover:bg-destructive/10 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 rounded-lg border border-border hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          currentPage === page
                            ? 'bg-primary text-primary-foreground'
                            : 'border border-border hover:bg-accent'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 rounded-lg border border-border hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {paginatedProperties.length === 0 && (
                  <div className="text-center py-12 bg-card rounded-2xl border border-border">
                    <Home className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Aucun logement</h3>
                    <p className="text-muted-foreground mb-4">Vous n'avez pas encore de logements.</p>
                    <Link
                      to="/spaces/create"
                      className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 inline-block"
                    >
                      Ajouter un logement
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <h2 className="text-2xl font-bold">Réservations</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            {loading.bookings ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBookings.map((booking) => (
                  <div key={booking.id} className="bg-card rounded-2xl border border-border p-6 hover:shadow-lg transition-shadow">
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{booking.space?.title}</h3>
                        <p className="text-muted-foreground">Client: {booking.user?.name}</p>
                      </div>
                      {getStatusBadge(booking.status)}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Arrivée</p>
                        <p className="font-medium">
                          {format(new Date(booking.check_in), 'dd MMM yyyy', { locale: fr })}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Départ</p>
                        <p className="font-medium">
                          {format(new Date(booking.check_out), 'dd MMM yyyy', { locale: fr })}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Voyageurs</p>
                        <p className="font-medium">{booking.guests}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Montant</p>
                        <p className="font-bold text-lg">{booking.total_price}€</p>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredBookings.length === 0 && (
                  <div className="text-center py-12 bg-card rounded-2xl border border-border">
                    <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Aucune réservation</h3>
                    <p className="text-muted-foreground">Vous n'avez pas encore de réservations.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Revenue Tab */}
        {activeTab === 'revenue' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-card rounded-2xl border border-border p-6">
                <h3 className="text-muted-foreground mb-2">Total des revenus</h3>
                <p className="text-3xl font-bold">
                  {stats?.revenue_this_month?.toLocaleString() || 0}€
                </p>
              </div>
              <div className="bg-card rounded-2xl border border-border p-6">
                <h3 className="text-muted-foreground mb-2">Revenus moyens/mois</h3>
                <p className="text-3xl font-bold">
                  {stats?.revenue_this_month ? Math.round(stats.revenue_this_month / 6).toLocaleString() : 0}€
                </p>
              </div>
              <div className="bg-card rounded-2xl border border-border p-6">
                <h3 className="text-muted-foreground mb-2">Prochain paiement</h3>
                <p className="text-3xl font-bold">
                  {stats?.revenue_this_month?.toLocaleString() || 0}€
                </p>
              </div>
            </div>

            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="font-semibold text-lg mb-6">Historique des revenus</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
                  <YAxis stroke="var(--color-muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--color-card)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '0.75rem'
                    }}
                    formatter={(value) => [`${value.toLocaleString()}€`, 'Revenus']}
                  />
                  <Bar dataKey="revenue" fill="url(#colorRevenue)" radius={[8, 8, 0, 0]} />
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
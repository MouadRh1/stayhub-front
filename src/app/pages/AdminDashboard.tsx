// pages/AdminDashboard.tsx
import { useState, useEffect, useCallback } from 'react';
import { 
  Users, Home, MessageSquare, DollarSign, TrendingUp, Activity, 
  Shield, Eye, Edit, Trash2, CheckCircle, XCircle, AlertTriangle,
  Loader2, Calendar, Filter, Download, ChevronLeft, ChevronRight,
  Search, UserPlus, Building2, PieChart as PieChartIcon
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// Types
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'owner' | 'user';
  status: 'active' | 'suspended';
  bookings_count?: number;
  properties_count?: number;
  created_at: string;
}

interface Space {
  id: string;
  title: string;
  user: { name: string };
  location: string;
  status: 'pending' | 'approved' | 'rejected';
  bookings_count: number;
  revenue: number;
}

interface DashboardStats {
  total_users: number;
  total_spaces: number;
  total_reservations: number;
  pending_spaces: number;
  pending_reservations: number;
  revenue_this_month: number;
  user_growth: number;
  space_growth: number;
  booking_growth: number;
  revenue_growth: number;
}

interface ChartData {
  month: string;
  revenue: number;
  bookings: number;
}

const TABS = [
  { id: 'overview', label: 'Vue d\'ensemble', icon: Activity },
  { id: 'users', label: 'Utilisateurs', icon: Users },
  { id: 'properties', label: 'Logements', icon: Home },
  { id: 'bookings', label: 'Réservations', icon: MessageSquare },
  { id: 'analytics', label: 'Analytique', icon: TrendingUp },
];

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];

export function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  
  // États
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<ChartData[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<any[]>([]);
  
  const [loading, setLoading] = useState({
    stats: true,
    users: true,
    spaces: true,
    bookings: true,
  });
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);

  // Charger les données
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading({ stats: true, users: true, spaces: true, bookings: true });
      
      // Récupérer les statistiques
      const statsRes = await api.get('/admin/statistics');
      setStats(statsRes.data);
      setLoading(prev => ({ ...prev, stats: false }));

      // Récupérer les utilisateurs
      const usersRes = await api.get('/admin/users');
      setUsers(usersRes.data.data || []);
      setLoading(prev => ({ ...prev, users: false }));

      // Récupérer les espaces
      const spacesRes = await api.get('/admin/spaces');
      setSpaces(spacesRes.data.data || []);
      setLoading(prev => ({ ...prev, spaces: false }));

      // Récupérer les réservations
      const bookingsRes = await api.get('/admin/reservations');
      setBookings(bookingsRes.data.data || []);
      setLoading(prev => ({ ...prev, bookings: false }));

      // Générer les données des graphiques
      generateChartData();

    } catch (err: any) {
      console.error('Erreur:', err);
      setError(err.response?.data?.message || 'Erreur lors du chargement des données');
      setLoading({ stats: false, users: false, spaces: false, bookings: false });
    }
  };

  const generateChartData = () => {
    // Simuler des données de graphique
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    const data = months.slice(0, 6).map((month, i) => ({
      month,
      revenue: 10000 + Math.random() * 30000,
      bookings: 30 + Math.random() * 100,
    }));
    setRevenueData(data);

    // Types de propriétés
    setPropertyTypes([
      { name: 'Appartements', value: Math.floor(Math.random() * 200) + 100 },
      { name: 'Villas', value: Math.floor(Math.random() * 150) + 50 },
      { name: 'Maisons', value: Math.floor(Math.random() * 100) + 50 },
      { name: 'Chalets', value: Math.floor(Math.random() * 80) + 20 },
    ]);
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      suspended: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      approved: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      confirmed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      completed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };

    const labels: Record<string, string> = {
      active: 'Actif',
      suspended: 'Suspendu',
      approved: 'Approuvé',
      pending: 'En attente',
      rejected: 'Rejeté',
      confirmed: 'Confirmée',
      completed: 'Terminée',
      cancelled: 'Annulée',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status] || styles.pending}`}>
        {labels[status] || status}
      </span>
    );
  };

  const getRoleBadge = (role: string) => {
    const styles: Record<string, string> = {
      admin: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      owner: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      user: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
    };

    const labels: Record<string, string> = {
      admin: 'Administrateur',
      owner: 'Propriétaire',
      user: 'Utilisateur',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[role] || styles.user}`}>
        {labels[role] || role}
      </span>
    );
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSpaces = spaces.filter(s =>
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <h1 className="text-3xl font-bold mb-2">Tableau de Bord Administrateur</h1>
            <p className="text-muted-foreground">Gérez la plateforme et surveillez les activités</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={fetchDashboardData}
              className="px-4 py-2 rounded-xl border border-border hover:bg-accent transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Exporter</span>
            </button>
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg shadow-purple-600/25">
              <Shield className="w-5 h-5 text-white" />
            </div>
          </div>
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
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
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
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg shadow-blue-600/25">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="opacity-90">Total Utilisateurs</h3>
                  <Users className="w-6 h-6 opacity-80" />
                </div>
                <p className="text-4xl font-bold mb-2">{stats.total_users.toLocaleString()}</p>
                <p className="text-sm opacity-80 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  +{(stats.user_growth || 0).toFixed(1)}% ce mois
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-6 text-white shadow-lg shadow-purple-600/25">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="opacity-90">Total Logements</h3>
                  <Home className="w-6 h-6 opacity-80" />
                </div>
                <p className="text-4xl font-bold mb-2">{stats.total_spaces.toLocaleString()}</p>
                <p className="text-sm opacity-80 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  +{(stats.space_growth || 0).toFixed(1)}% ce mois
                </p>
              </div>

              <div className="bg-gradient-to-br from-pink-600 to-pink-700 rounded-2xl p-6 text-white shadow-lg shadow-pink-600/25">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="opacity-90">Réservations</h3>
                  <MessageSquare className="w-6 h-6 opacity-80" />
                </div>
                <p className="text-4xl font-bold mb-2">{stats.total_reservations.toLocaleString()}</p>
                <p className="text-sm opacity-80 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  +{(stats.booking_growth || 0).toFixed(1)}% ce mois
                </p>
              </div>

              <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-2xl p-6 text-white shadow-lg shadow-orange-600/25">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="opacity-90">Revenus Totaux</h3>
                  <DollarSign className="w-6 h-6 opacity-80" />
                </div>
                <p className="text-4xl font-bold mb-2">{stats.revenue_this_month.toLocaleString()}€</p>
                <p className="text-sm opacity-80 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  +{(stats.revenue_growth || 0).toFixed(1)}% ce mois
                </p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-6">
                <h3 className="font-semibold text-lg mb-6">Croissance des revenus et réservations</h3>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
                    <YAxis yAxisId="left" stroke="var(--color-muted-foreground)" />
                    <YAxis yAxisId="right" orientation="right" stroke="var(--color-muted-foreground)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--color-card)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '0.75rem'
                      }}
                    />
                    <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
                    <Line yAxisId="right" type="monotone" dataKey="bookings" stroke="#8b5cf6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-card rounded-2xl border border-border p-6">
                <h3 className="font-semibold text-lg mb-6">Types de logements</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={propertyTypes}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {propertyTypes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Alerts */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="font-semibold text-lg mb-6">Alertes et notifications</h3>
              <div className="space-y-4">
                {stats.pending_spaces > 0 && (
                  <div className="flex items-start gap-4 p-4 bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold mb-1">{stats.pending_spaces} logements en attente de validation</h4>
                      <p className="text-sm text-muted-foreground">Action requise pour approuver ou rejeter les nouveaux logements</p>
                    </div>
                  </div>
                )}
                {stats.pending_reservations > 0 && (
                  <div className="flex items-start gap-4 p-4 bg-blue-100 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                    <Calendar className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold mb-1">{stats.pending_reservations} réservations en attente</h4>
                      <p className="text-sm text-muted-foreground">Des réservations nécessitent votre confirmation</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-4 p-4 bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-1">Taux de satisfaction à {(stats.revenue_growth || 90).toFixed(0)}%</h4>
                    <p className="text-sm text-muted-foreground">Excellente performance ce mois-ci</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <h2 className="text-2xl font-bold">Utilisateurs</h2>
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
                <button className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  <span>Ajouter</span>
                </button>
              </div>
            </div>

            {loading.users ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : (
              <div className="bg-card rounded-2xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-6 py-4 text-left font-semibold">Utilisateur</th>
                        <th className="px-6 py-4 text-left font-semibold">Email</th>
                        <th className="px-6 py-4 text-left font-semibold">Rôle</th>
                        <th className="px-6 py-4 text-left font-semibold">Statut</th>
                        <th className="px-6 py-4 text-left font-semibold">Activité</th>
                        <th className="px-6 py-4 text-left font-semibold">Inscrit le</th>
                        <th className="px-6 py-4 text-left font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((u) => (
                        <tr key={u.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                {u.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <span className="font-medium">{u.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-muted-foreground">{u.email}</td>
                          <td className="px-6 py-4">{getRoleBadge(u.role)}</td>
                          <td className="px-6 py-4">{getStatusBadge(u.status)}</td>
                          <td className="px-6 py-4 text-sm">
                            {u.role === 'owner' 
                              ? `${u.properties_count || 0} logements` 
                              : `${u.bookings_count || 0} réservations`}
                          </td>
                          <td className="px-6 py-4 text-muted-foreground text-sm">
                            {format(new Date(u.created_at), 'dd MMM yyyy', { locale: fr })}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-1">
                              <button className="p-2 hover:bg-accent rounded-lg transition-colors">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-2 hover:bg-accent rounded-lg transition-colors">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredUsers.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Aucun utilisateur trouvé</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Properties Tab */}
        {activeTab === 'properties' && (
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <h2 className="text-2xl font-bold">Logements</h2>
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
                <button className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  <span>Ajouter</span>
                </button>
              </div>
            </div>

            {loading.spaces ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : (
              <div className="bg-card rounded-2xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-6 py-4 text-left font-semibold">Logement</th>
                        <th className="px-6 py-4 text-left font-semibold">Propriétaire</th>
                        <th className="px-6 py-4 text-left font-semibold">Localisation</th>
                        <th className="px-6 py-4 text-left font-semibold">Statut</th>
                        <th className="px-6 py-4 text-left font-semibold">Réservations</th>
                        <th className="px-6 py-4 text-left font-semibold">Revenus</th>
                        <th className="px-6 py-4 text-left font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSpaces.map((s) => (
                        <tr key={s.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                          <td className="px-6 py-4 font-medium">{s.title}</td>
                          <td className="px-6 py-4 text-muted-foreground">{s.user?.name || 'Inconnu'}</td>
                          <td className="px-6 py-4 text-muted-foreground">{s.location}</td>
                          <td className="px-6 py-4">{getStatusBadge(s.status)}</td>
                          <td className="px-6 py-4">{s.bookings_count || 0}</td>
                          <td className="px-6 py-4 font-semibold">{s.revenue || 0}€</td>
                          <td className="px-6 py-4">
                            <div className="flex gap-1">
                              <button className="p-2 hover:bg-accent rounded-lg transition-colors">
                                <Eye className="w-4 h-4" />
                              </button>
                              {s.status === 'pending' && (
                                <>
                                  <button className="p-2 hover:bg-green-100 dark:hover:bg-green-900/20 text-green-600 rounded-lg transition-colors">
                                    <CheckCircle className="w-4 h-4" />
                                  </button>
                                  <button className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 rounded-lg transition-colors">
                                    <XCircle className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredSpaces.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Aucun logement trouvé</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-card rounded-2xl border border-border p-6">
                <h3 className="font-semibold text-lg mb-6">Revenus mensuels</h3>
                <ResponsiveContainer width="100%" height={300}>
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
                    />
                    <Bar dataKey="revenue" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
                    <defs>
                      <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-card rounded-2xl border border-border p-6">
                <h3 className="font-semibold text-lg mb-6">Évolution des réservations</h3>
                <ResponsiveContainer width="100%" height={300}>
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
                    />
                    <Line type="monotone" dataKey="bookings" stroke="#ec4899" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-card rounded-2xl border border-border p-6">
                <h3 className="text-muted-foreground mb-2">Taux de conversion</h3>
                <p className="text-4xl font-bold mb-2">{(stats?.revenue_growth || 24.8).toFixed(1)}%</p>
                <p className="text-sm text-green-600 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  +3.2% vs mois dernier
                </p>
              </div>

              <div className="bg-card rounded-2xl border border-border p-6">
                <h3 className="text-muted-foreground mb-2">Panier moyen</h3>
                <p className="text-4xl font-bold mb-2">1,245€</p>
                <p className="text-sm text-green-600 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  +5.8% vs mois dernier
                </p>
              </div>

              <div className="bg-card rounded-2xl border border-border p-6">
                <h3 className="text-muted-foreground mb-2">Taux de satisfaction</h3>
                <p className="text-4xl font-bold mb-2">98.5%</p>
                <p className="text-sm text-green-600 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  +1.2% vs mois dernier
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
// pages/AdminDashboard.tsx
import { useState, useEffect } from 'react';
import { 
  Users, Home, MessageSquare, DollarSign, TrendingUp, Activity, 
  Shield, AlertTriangle, Loader2, Calendar, Download , CheckCircle
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { UsersManagement } from '../components/admin/UsersManagement';
import { SpacesManagement } from '../components/admin/SpacesManagement';
import { BookingsManagement } from '../components/admin/BookingsManagement';

// Types
interface DashboardStats {
  total_users: number;
  total_spaces: number;
  total_reservations: number;
  pending_spaces: number;
  pending_reservations: number;
  revenue_this_month: number;
  user_growth?: number;
  space_growth?: number;
  booking_growth?: number;
  revenue_growth?: number;
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

const DEFAULT_STATS: DashboardStats = {
  total_users: 0,
  total_spaces: 0,
  total_reservations: 0,
  pending_spaces: 0,
  pending_reservations: 0,
  revenue_this_month: 0,
  user_growth: 0,
  space_growth: 0,
  booking_growth: 0,
  revenue_growth: 0,
};

export function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  
  const [stats, setStats] = useState<DashboardStats>(DEFAULT_STATS);
  const [revenueData, setRevenueData] = useState<ChartData[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Récupérer les statistiques
      try {
        const statsRes = await api.get('/admin/statistics');
        setStats({
          ...DEFAULT_STATS,
          ...statsRes.data,
        });
      } catch (err) {
        console.error('Erreur stats:', err);
        setStats(DEFAULT_STATS);
      }

      // Générer les données des graphiques
      generateChartData();
      setError(null);
    } catch (err: any) {
      console.error('Erreur générale:', err);
      setError(err.response?.data?.message || 'Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const generateChartData = () => {
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'];
    const data = months.map(() => ({
      month: months[Math.floor(Math.random() * months.length)],
      revenue: 10000 + Math.random() * 30000,
      bookings: 30 + Math.random() * 100,
    }));
    setRevenueData(data);

    setPropertyTypes([
      { name: 'Appartements', value: Math.floor(Math.random() * 200) + 100 },
      { name: 'Villas', value: Math.floor(Math.random() * 150) + 50 },
      { name: 'Maisons', value: Math.floor(Math.random() * 100) + 50 },
      { name: 'Chalets', value: Math.floor(Math.random() * 80) + 20 },
    ]);
  };

  const safeStats = stats || DEFAULT_STATS;

  // Rendu du loader
  if (loading) {
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
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-600/25'
                    : 'bg-card border border-border hover:bg-accent'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
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

        {/* Contenu des tabs */}
        <div className="mt-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg shadow-blue-600/25">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="opacity-90">Total Utilisateurs</h3>
                    <Users className="w-6 h-6 opacity-80" />
                  </div>
                  <p className="text-4xl font-bold mb-2">{safeStats.total_users?.toLocaleString() || 0}</p>
                  <p className="text-sm opacity-80 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    +{(safeStats.user_growth || 0).toFixed(1)}% ce mois
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-6 text-white shadow-lg shadow-purple-600/25">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="opacity-90">Total Logements</h3>
                    <Home className="w-6 h-6 opacity-80" />
                  </div>
                  <p className="text-4xl font-bold mb-2">{safeStats.total_spaces?.toLocaleString() || 0}</p>
                  <p className="text-sm opacity-80 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    +{(safeStats.space_growth || 0).toFixed(1)}% ce mois
                  </p>
                </div>

                <div className="bg-gradient-to-br from-pink-600 to-pink-700 rounded-2xl p-6 text-white shadow-lg shadow-pink-600/25">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="opacity-90">Réservations</h3>
                    <MessageSquare className="w-6 h-6 opacity-80" />
                  </div>
                  <p className="text-4xl font-bold mb-2">{safeStats.total_reservations?.toLocaleString() || 0}</p>
                  <p className="text-sm opacity-80 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    +{(safeStats.booking_growth || 0).toFixed(1)}% ce mois
                  </p>
                </div>

                <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-2xl p-6 text-white shadow-lg shadow-orange-600/25">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="opacity-90">Revenus Totaux</h3>
                    <DollarSign className="w-6 h-6 opacity-80" />
                  </div>
                  <p className="text-4xl font-bold mb-2">{safeStats.revenue_this_month?.toLocaleString() || 0}€</p>
                  <p className="text-sm opacity-80 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    +{(safeStats.revenue_growth || 0).toFixed(1)}% ce mois
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
                  {safeStats.pending_spaces > 0 && (
                    <div className="flex items-start gap-4 p-4 bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold mb-1">{safeStats.pending_spaces} logements en attente de validation</h4>
                        <p className="text-sm text-muted-foreground">Action requise pour approuver ou rejeter les nouveaux logements</p>
                      </div>
                    </div>
                  )}
                  {safeStats.pending_reservations > 0 && (
                    <div className="flex items-start gap-4 p-4 bg-blue-100 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                      <Calendar className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold mb-1">{safeStats.pending_reservations} réservations en attente</h4>
                        <p className="text-sm text-muted-foreground">Des réservations nécessitent votre confirmation</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-4 p-4 bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                    <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold mb-1">Taux de satisfaction à {(safeStats.revenue_growth || 90).toFixed(0)}%</h4>
                      <p className="text-sm text-muted-foreground">Excellente performance ce mois-ci</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && <UsersManagement />}

          {/* Properties Tab */}
          {activeTab === 'properties' && <SpacesManagement />}

          {/* Bookings Tab */}
          {activeTab === 'bookings' && <BookingsManagement />}

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
                  <p className="text-4xl font-bold mb-2">{(safeStats.revenue_growth || 24.8).toFixed(1)}%</p>
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
    </div>
  );
}
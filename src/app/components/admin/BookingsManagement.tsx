// components/admin/BookingsManagement.tsx
import { useState, useEffect } from 'react';
import { 
  Calendar, Search, Eye, Loader2, 
  ChevronLeft, ChevronRight, CheckCircle, XCircle,
  Users, Home, DollarSign
} from 'lucide-react';
import { api } from '../../services/api';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Booking {
  id: string;
  space: { title: string; location: string };
  user: { name: string; email: string };
  check_in: string;
  check_out: string;
  guests: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
}

export function BookingsManagement() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, [currentPage, statusFilter]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      
      const response = await api.get(`/admin/reservations?${params.toString()}&page=${currentPage}`);
      setBookings(response.data.data || []);
      setTotalPages(response.data.last_page || 1);
      setError(null);
    } catch (err: any) {
      console.error('Erreur:', err);
      setError(err.response?.data?.message || 'Erreur lors du chargement des réservations');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
    try {
      await api.put(`/admin/reservations/${bookingId}`, { status: newStatus });
      fetchBookings();
    } catch (err) {
      console.error('Erreur:', err);
      alert('Erreur lors de la mise à jour');
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      confirmed: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      completed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };
    const labels: Record<string, string> = {
      pending: 'En attente',
      confirmed: 'Confirmée',
      completed: 'Terminée',
      cancelled: 'Annulée',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || styles.pending}`}>
        {labels[status] || status}
      </span>
    );
  };

  const filteredBookings = bookings.filter(b =>
    b.space?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.space?.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && bookings.length === 0) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold">Gestion des Réservations</h2>
          <p className="text-muted-foreground">Gérez toutes les réservations de la plateforme</p>
        </div>
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
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="confirmed">Confirmées</option>
            <option value="completed">Terminées</option>
            <option value="cancelled">Annulées</option>
          </select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-xl text-red-600">
          {error}
        </div>
      )}

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredBookings.map((b) => (
          <div key={b.id} className="bg-card rounded-2xl border border-border p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold">{b.space?.title || 'Espace'}</h3>
                <p className="text-sm text-muted-foreground">{b.space?.location || '-'}</p>
              </div>
              {getStatusBadge(b.status)}
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span>{b.user?.name || 'Inconnu'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>
                  {format(new Date(b.check_in), 'dd MMM')} - {format(new Date(b.check_out), 'dd MMM yyyy')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span>{b.guests} voyageur{b.guests > 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <span className="font-semibold">{b.total_price}€</span>
              </div>
            </div>

            <div className="flex gap-2 mt-4 pt-4 border-t border-border">
              {b.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleStatusUpdate(b.id, 'confirmed')}
                    className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Confirmer
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(b.id, 'cancelled')}
                    className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Annuler
                  </button>
                </>
              )}
              {b.status === 'confirmed' && (
                <button
                  onClick={() => handleStatusUpdate(b.id, 'completed')}
                  className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Marquer comme terminée
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredBookings.length === 0 && (
        <div className="text-center py-12 bg-card rounded-2xl border border-border">
          <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Aucune réservation trouvée</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-border hover:bg-accent transition-colors disabled:opacity-50"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm">
            Page {currentPage} sur {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-border hover:bg-accent transition-colors disabled:opacity-50"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
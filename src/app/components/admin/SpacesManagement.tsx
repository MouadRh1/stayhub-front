// components/admin/SpacesManagement.tsx
import { useState, useEffect } from 'react';
import { 
  Home, Search, Plus, Eye, Edit, Trash2, 
  CheckCircle, XCircle, Loader2, 
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { api } from '../../services/api';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Space {
  id: string;
  title: string;
  user: { name: string };
  location: string;
  status: 'pending' | 'approved' | 'rejected';
  bookings_count: number;
  revenue: number;
  created_at: string;
}

export function SpacesManagement() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchSpaces();
  }, [currentPage]);

  const fetchSpaces = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/spaces?page=${currentPage}`);
      setSpaces(response.data.data || []);
      setTotalPages(response.data.last_page || 1);
      setError(null);
    } catch (err: any) {
      console.error('Erreur:', err);
      setError(err.response?.data?.message || 'Erreur lors du chargement des logements');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (spaceId: string) => {
    try {
      await api.post(`/admin/spaces/${spaceId}/approve`);
      fetchSpaces();
    } catch (err) {
      console.error('Erreur:', err);
      alert('Erreur lors de l\'approbation');
    }
  };

  const handleReject = async (spaceId: string) => {
    try {
      await api.post(`/admin/spaces/${spaceId}/reject`);
      fetchSpaces();
    } catch (err) {
      console.error('Erreur:', err);
      alert('Erreur lors du rejet');
    }
  };

  const handleDelete = async (spaceId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce logement ? Cette action est irréversible.')) return;
    
    try {
      await api.delete(`/admin/spaces/${spaceId}`);
      fetchSpaces();
    } catch (err: any) {
      console.error('Erreur:', err);
      alert(err.response?.data?.message || 'Erreur lors de la suppression');
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      approved: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };
    const labels: Record<string, string> = {
      approved: 'Approuvé',
      pending: 'En attente',
      rejected: 'Rejeté',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || styles.pending}`}>
        {labels[status] || status}
      </span>
    );
  };

  const filteredSpaces = spaces.filter(s =>
    s.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && spaces.length === 0) {
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
          <h2 className="text-2xl font-bold">Gestion des Logements</h2>
          <p className="text-muted-foreground">Gérez tous les logements de la plateforme</p>
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
          <button className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Ajouter
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-xl text-red-600">
          {error}
        </div>
      )}

      {/* Table */}
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
                  <td className="px-6 py-4 font-medium">{s.title || '-'}</td>
                  <td className="px-6 py-4 text-muted-foreground">{s.user?.name || 'Inconnu'}</td>
                  <td className="px-6 py-4 text-muted-foreground">{s.location || '-'}</td>
                  <td className="px-6 py-4">{getStatusBadge(s.status || 'pending')}</td>
                  <td className="px-6 py-4">{s.bookings_count || 0}</td>
                  <td className="px-6 py-4 font-semibold">{s.revenue || 0}€</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1">
                      {s.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleApprove(s.id)}
                            className="p-2 hover:bg-green-100 dark:hover:bg-green-900/20 text-green-600 rounded-lg transition-colors"
                            title="Approuver"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleReject(s.id)}
                            className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 rounded-lg transition-colors"
                            title="Rejeter"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button 
                        onClick={() => handleDelete(s.id)}
                        className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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
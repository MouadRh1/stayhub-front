// components/admin/UsersManagement.tsx
import { useState, useEffect } from 'react';
import { 
  Users, Search, UserPlus, Eye, Edit, Trash2, 
  Shield, CheckCircle, XCircle, Loader2, 
  ChevronLeft, ChevronRight, Filter
} from 'lucide-react';
import { api } from '../../services/api';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

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

export function UsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/users?page=${currentPage}`);
      setUsers(response.data.data || []);
      setTotalPages(response.data.last_page || 1);
      setError(null);
    } catch (err: any) {
      console.error('Erreur:', err);
      setError(err.response?.data?.message || 'Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (userId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
      const endpoint = newStatus === 'active' 
        ? `/admin/users/${userId}/activate` 
        : `/admin/users/${userId}/suspend`;
      
      await api.post(endpoint);
      fetchUsers();
    } catch (err) {
      console.error('Erreur:', err);
      alert('Erreur lors du changement de statut');
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;
    
    try {
      await api.delete(`/admin/users/${userId}`);
      fetchUsers();
    } catch (err) {
      console.error('Erreur:', err);
      alert('Erreur lors de la suppression');
    }
  };

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadge = (role: string) => {
    const styles: Record<string, string> = {
      admin: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      owner: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      user: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
    };
    const labels: Record<string, string> = {
      admin: 'Admin',
      owner: 'Propriétaire',
      user: 'Utilisateur',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[role] || styles.user}`}>
        {labels[role] || role}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
      suspended: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };
    const labels: Record<string, string> = {
      active: 'Actif',
      suspended: 'Suspendu',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || styles.active}`}>
        {labels[status] || status}
      </span>
    );
  };

  if (loading && users.length === 0) {
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
          <h2 className="text-2xl font-bold">Gestion des Utilisateurs</h2>
          <p className="text-muted-foreground">Gérez les comptes utilisateurs de la plateforme</p>
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
            <UserPlus className="w-4 h-4" />
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
                        {u.name?.split(' ').map(n => n[0]).join('') || 'U'}
                      </div>
                      <span className="font-medium">{u.name || 'Inconnu'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{u.email || '-'}</td>
                  <td className="px-6 py-4">{getRoleBadge(u.role || 'user')}</td>
                  <td className="px-6 py-4">{getStatusBadge(u.status || 'active')}</td>
                  <td className="px-6 py-4 text-sm">
                    {u.role === 'owner' 
                      ? `${u.properties_count || 0} logements` 
                      : `${u.bookings_count || 0} réservations`}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground text-sm">
                    {u.created_at ? format(new Date(u.created_at), 'dd MMM yyyy', { locale: fr }) : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1">
                      <button 
                        onClick={() => handleStatusToggle(u.id, u.status)}
                        className="p-2 hover:bg-accent rounded-lg transition-colors"
                        title={u.status === 'active' ? 'Suspendre' : 'Activer'}
                      >
                        {u.status === 'active' ? 
                          <XCircle className="w-4 h-4 text-red-500" /> : 
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        }
                      </button>
                      <button 
                        onClick={() => handleDelete(u.id)}
                        className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors"
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
        {filteredUsers.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Aucun utilisateur trouvé</p>
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
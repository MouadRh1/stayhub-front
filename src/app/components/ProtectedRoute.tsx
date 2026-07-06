// components/ProtectedRoute.tsx
import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { Loader2 } from 'lucide-react';

export function ProtectedRoute() {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Affichage du loader pendant le chargement
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  // Si l'utilisateur n'est pas authentifié, rediriger vers la page de login
  // avec l'URL actuelle pour une redirection après connexion
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Si l'utilisateur est authentifié, afficher la page demandée
  return <Outlet />;
}
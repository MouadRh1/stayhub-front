// contexts/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  avatar?: string;
  role: 'user' | 'owner' | 'admin';
  status: 'active' | 'suspended';
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; errors?: any }>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await api.get('/user');
      setUser(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement de l\'utilisateur:', error);
      localStorage.removeItem('access_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
  try {
    console.log('📤 Envoi login...');
    const response = await api.post('/login', { email, password });
    console.log('📥 Réponse brute:', response);
    console.log('📥 Response data:', response.data);
    console.log('📥 Access token:', response.data?.access_token);
    console.log('📥 User:', response.data?.user);
    
    const { access_token, user } = response.data;
    
    if (!access_token) {
      console.error('❌ Aucun token reçu dans la réponse');
      return { 
        success: false, 
        error: 'Aucun token reçu du serveur' 
      };
    }
    
    localStorage.setItem('access_token', access_token);
    console.log('💾 Token sauvegardé:', localStorage.getItem('access_token'));
    
    setUser(user);
    console.log('👤 Utilisateur défini:', user);
    
    return { success: true };
  } catch (error: any) {
    console.error('❌ Erreur login:', error);
    console.error('❌ Response:', error.response?.data);
    console.error('❌ Status:', error.response?.status);
    return { 
      success: false, 
      error: error.response?.data?.message || 'Email ou mot de passe incorrect'
    };
  }
};

  const register = async (data: RegisterData) => {
    try {
      const response = await api.post('/register', data);
      const { access_token, user } = response.data;
      localStorage.setItem('access_token', access_token);
      setUser(user);
      return { success: true };
    } catch (error: any) {
      console.error('Erreur d\'inscription:', error);
      return { 
        success: false, 
        errors: error.response?.data?.errors || { general: ['Erreur lors de l\'inscription'] }
      };
    }
  };

  const logout = async () => {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      localStorage.removeItem('access_token');
      setUser(null);
      // Forcer la mise à jour du state
      setUser(null);
    }
  };

  const updateUser = async (data: Partial<User>) => {
    try {
      const response = await api.put('/user/profile', data);
      setUser(response.data.user);
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
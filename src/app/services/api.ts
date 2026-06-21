// services/api.ts
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // Important pour les requêtes avec session
  withCredentials: true,
});

// Intercepteur pour le token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur pour les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Ne pas rediriger pour les erreurs 401 du chatbot
    const isChatbotRequest = error.config?.url?.includes('/chatbot/');
    
    if (error.response?.status === 401 && !isChatbotRequest) {
      localStorage.removeItem('access_token');
      // Éviter les redirections multiples
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ==================== API AUTH ====================
export const authApi = {
  register: (data: any) => api.post('/register', data),
  login: (email: string, password: string) => api.post('/login', { email, password }),
  logout: () => api.post('/logout'),
  getUser: () => api.get('/user'),
  updateProfile: (data: any) => api.put('/user/profile', data),
};

// ==================== API SPACES ====================
export const spaceApi = {
  getAll: (params?: any) => api.get('/spaces', { params }),
  getPopular: () => api.get('/spaces/popular'),
  getTrendingDestinations: () => api.get('/spaces/trending-destinations'),
  getById: (id: string) => api.get(`/spaces/${id}`),
  create: (data: FormData) => api.post('/spaces', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  update: (id: string, data: FormData) => api.post(`/spaces/${id}?_method=PUT`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id: string) => api.delete(`/spaces/${id}`),
  getMySpaces: () => api.get('/my-spaces'),
  uploadImages: (id: string, data: FormData) => api.post(`/spaces/${id}/images`, data),
  deleteImage: (id: string) => api.delete(`/spaces/images/${id}`),
};

// ==================== API RESERVATIONS ====================
export const reservationApi = {
  getAll: (params?: any) => api.get('/reservations', { params }),
  getOwnerReservations: () => api.get('/reservations/owner'),
  getById: (id: string) => api.get(`/reservations/${id}`),
  create: (data: any) => api.post('/reservations', data),
  update: (id: string, data: any) => api.put(`/reservations/${id}`, data),
  cancel: (id: string) => api.post(`/reservations/${id}/cancel`),
};

// ==================== API FAVORITES ====================
export const favoriteApi = {
  getAll: () => api.get('/favorites'),
  toggle: (spaceId: string) => api.post(`/favorites/${spaceId}/toggle`),
  check: (spaceId: string) => api.get(`/favorites/${spaceId}/check`),
  getIds: () => api.get('/favorites/ids'),
  getSpaces: () => api.get('/favorites/spaces'),
  getStats: () => api.get('/favorites/stats'),
  delete: (id: string) => api.delete(`/favorites/${id}`),
  clear: () => api.delete('/favorites/clear'),
};

// ==================== API REVIEWS ====================
export const reviewApi = {
  create: (data: any) => api.post('/reviews', data),
  getById: (id: string) => api.get(`/reviews/${id}`),
  getSpaceReviews: (spaceId: string) => api.get(`/spaces/${spaceId}/reviews`),
  respond: (id: string, data: any) => api.put(`/reviews/${id}/respond`, data),
  getMyReviews: () => api.get('/my-reviews'),
};

// ==================== API CHATBOT ====================
export const chatbotApi = {
  /**
   * Démarrer une nouvelle conversation
   */
  start: () => api.post('/chatbot/start'),
  
  /**
   * Envoyer un message
   * @param sessionId - ID de session
   * @param message - Message de l'utilisateur
   */
  sendMessage: (sessionId: string, message: string) => 
    api.post('/chatbot/message', { 
      session_id: sessionId, 
      message 
    }),
  
  /**
   * Récupérer une conversation
   * @param sessionId - ID de session
   */
  getConversation: (sessionId: string) => 
    api.get(`/chatbot/conversation/${sessionId}`),
  
  /**
   * Fermer une conversation
   * @param sessionId - ID de session
   */
  closeConversation: (sessionId: string) => 
    api.post(`/chatbot/close/${sessionId}`),
  
  /**
   * Obtenir les suggestions
   */
  getSuggestions: () => api.get('/chatbot/suggestions'),
  
  /**
   * Obtenir les conversations de l'utilisateur
   */
  getMyConversations: () => api.get('/chatbot/my-conversations'),
  
  /**
   * Supprimer une conversation
   * @param sessionId - ID de session
   */
  deleteConversation: (sessionId: string) => 
    api.delete(`/chatbot/conversation/${sessionId}`),
  
  /**
   * Obtenir les statistiques (admin)
   */
  getStats: () => api.get('/chatbot/stats'),
};

// ==================== API NOTIFICATIONS ====================
export const notificationApi = {
  getAll: () => api.get('/notifications'),
  getLatest: () => api.get('/notifications/latest'),
  markAsRead: (id: string) => api.post(`/notifications/${id}/read`),
  markAllAsRead: () => api.post('/notifications/read-all'),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  delete: (id: string) => api.delete(`/notifications/${id}`),
  clearRead: () => api.delete('/notifications/clear-read'),
  clearAll: () => api.delete('/notifications/clear-all'),
};

// ==================== API ADMIN ====================
export const adminApi = {
  getUsers: () => api.get('/admin/users'),
  getSpaces: () => api.get('/admin/spaces'),
  getReservations: () => api.get('/admin/reservations'),
  getStatistics: () => api.get('/admin/statistics'),
  approveSpace: (id: string) => api.post(`/admin/spaces/${id}/approve`),
  rejectSpace: (id: string) => api.post(`/admin/spaces/${id}/reject`),
  suspendUser: (id: string) => api.post(`/admin/users/${id}/suspend`),
  activateUser: (id: string) => api.post(`/admin/users/${id}/activate`),
};

// Export par défaut pour la compatibilité
export default api;
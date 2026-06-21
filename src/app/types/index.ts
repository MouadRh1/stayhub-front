// src/types/index.ts

export interface Space {
  id: string;
  title: string;
  description: string;
  location: string;
  latitude?: number;
  longitude?: number;
  price_per_night: number;
  space_type: 'appartement' | 'villa' | 'maison' | 'chalet' | 'studio' | 'loft' | 'penthouse' | 'bureau' | 'salle';
  bedrooms: number;
  bathrooms: number;
  max_guests: number;
  amenities: string[];
  images: string[];
  rating: number;
  review_count: number;
  status: 'pending' | 'approved' | 'rejected' | 'inactive';
  user_id: string;
  created_at: string;
  updated_at: string;
  user?: User;
  reviews?: Review[];
  reservations?: Reservation[];
}

export interface Reservation {
  id: string;
  space_id: string;
  user_id: string;
  check_in: string;
  check_out: string;
  guests: number;
  total_price: number;
  service_fee: number;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
  space?: Space;
  user?: User;
}

export interface Review {
  id: string;
  reservation_id: string;
  space_id: string;
  user_id: string;
  rating: number;
  comment: string;
  is_verified: boolean;
  response?: string;
  response_date?: string;
  created_at: string;
  user?: User;
  space?: Space;
}

export interface User {
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

export interface Favorite {
  id: string;
  user_id: string;
  space_id: string;
  created_at: string;
  updated_at: string;
  space?: Space;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  message: string;
  data?: any;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export interface ChatbotMessage {
  id: string;
  conversation_id: string;
  sender: 'user' | 'bot';
  message: string;
  response?: string;
  metadata?: any;
  created_at: string;
}
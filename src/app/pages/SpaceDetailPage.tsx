// pages/SpaceDetailPage.tsx
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { 
  Star, MapPin, Wifi, Car, Waves, Utensils, Wind, 
  Heart, Share2, ChevronLeft, ChevronRight, Users, 
  BedDouble, Bath, Home, Loader2, AlertCircle 
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface SpaceImage {
  id: string;
  image_path: string;
  is_primary: boolean;
  order: number;
}

interface Space {
  id: string;
  title: string;
  description: string;
  location: string;
  latitude: number;
  longitude: number;
  price_per_night: number;
  space_type: string;
  bedrooms: number;
  bathrooms: number;
  max_guests: number;
  amenities: string[];
  rating: number;
  review_count: number;
  status: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  images: SpaceImage[];
  reviews: {
    id: string;
    rating: number;
    comment: string;
    created_at: string;
    user: {
      id: string;
      name: string;
      avatar: string;
    };
  }[];
}

const AMENITY_ICONS: { [key: string]: any } = {
  'WiFi': Wifi,
  'Piscine': Waves,
  'Parking': Car,
  'Cuisine': Utensils,
  'Climatisation': Wind,
  'Jacuzzi': Waves,
  'Barbecue': Home,
  'Cheminée': Home,
  'Sauna': Wind,
  'Salle de sport': Users,
  'Balcon': Home,
  'Terrasse': Home,
  'Lave-linge': Home,
  'Télévision': Home,
};

export function SpaceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [space, setSpace] = useState<Space | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Récupérer les données
  useEffect(() => {
    if (id) {
      fetchSpaceDetails();
    }
  }, [id]);

  // Vérifier les favoris quand l'utilisateur change
  useEffect(() => {
    if (user && id) {
      checkFavorite();
    }
  }, [user, id]);

  // Récupérer les détails de l'espace
  const fetchSpaceDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/spaces/${id}`);
      console.log('Space data:', response.data);
      setSpace(response.data);
    } catch (err: any) {
      console.error('Erreur:', err);
      if (err.response?.status === 404) {
        setError('Espace non trouvé');
      } else {
        setError(err.response?.data?.message || 'Erreur lors du chargement des détails');
      }
    } finally {
      setLoading(false);
    }
  };

  // Vérifier si l'espace est en favori
  const checkFavorite = async () => {
    try {
      const response = await api.get(`/favorites/${id}/check`);
      setIsFavorite(response.data.is_favorite);
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  // Ajouter/Retirer des favoris
  const toggleFavorite = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const response = await api.post(`/favorites/${id}/toggle`);
      setIsFavorite(response.data.is_favorite);
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  // Réserver - Rediriger vers la page de réservation
  const handleBooking = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!checkIn || !checkOut) {
      alert('Veuillez sélectionner les dates');
      return;
    }

    // Rediriger vers la page de réservation avec les paramètres
    navigate(`/reservation/${id}`, {
      state: {
        checkIn,
        checkOut,
        guests,
      }
    });
  };

  // Navigation des images
  const nextImage = () => {
    if (space?.images?.length) {
      setCurrentImageIndex((prev) => (prev + 1) % space.images.length);
    }
  };

  const prevImage = () => {
    if (space?.images?.length) {
      setCurrentImageIndex((prev) => (prev - 1 + space.images.length) % space.images.length);
    }
  };

  // Calcul du nombre de nuits
  const calculateNights = () => {
    if (checkIn && checkOut) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    }
    return 0;
  };

  const nights = calculateNights();
  const subtotal = space ? space.price_per_night * nights : 0;
  const serviceFee = subtotal * 0.10;
  const totalPrice = subtotal + serviceFee;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-16 h-16 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !space) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">{error || 'Espace non trouvé'}</h2>
        <p className="text-muted-foreground mb-4">L'espace que vous recherchez n'existe pas ou a été supprimé.</p>
        <Link to="/search" className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
          Voir les autres espaces
        </Link>
      </div>
    );
  }

  const images = space.images || [];
  const amenities = space.amenities || [];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link to="/search" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors">
            <ChevronLeft className="w-4 h-4" />
            Retour aux résultats
          </Link>

          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{space.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium text-foreground">{space.rating || 'Nouveau'}</span>
                  {space.review_count > 0 && (
                    <span>({space.review_count} avis)</span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{space.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Home className="w-4 h-4" />
                  <span className="capitalize">{space.space_type}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleFavorite}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border hover:bg-accent transition-colors"
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                <span className="hidden sm:inline">{isFavorite ? 'Retirer' : 'Sauvegarder'}</span>
              </button>
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ 
                      title: space.title, 
                      url: window.location.href 
                    });
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border hover:bg-accent transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Partager</span>
              </button>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="relative mb-8 rounded-2xl overflow-hidden bg-muted">
          {images.length > 0 ? (
            <div className="relative aspect-video">
              <img
                src={images[currentImageIndex]?.image_path || '/placeholder.jpg'}
                alt={space.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.jpg';
                }}
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="aspect-video flex items-center justify-center bg-muted">
              <p className="text-muted-foreground">Aucune image disponible</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Host Info */}
            <div className="flex items-center justify-between pb-6 border-b border-border">
              <div>
                <h2 className="text-2xl font-semibold mb-1">
                  Hébergé par {space.user?.name || 'Hôte'}
                </h2>
                <p className="text-muted-foreground">
                  {space.max_guests} voyageurs · {space.bedrooms} chambres · {space.bathrooms} salles de bain
                </p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-xl">
                {space.user?.name?.charAt(0).toUpperCase() || 'H'}
              </div>
            </div>

            {/* Description */}
            <div className="py-6 border-b border-border">
              <h3 className="font-semibold text-xl mb-4">À propos de ce logement</h3>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {space.description}
              </p>
            </div>

            {/* Amenities */}
            {amenities.length > 0 && (
              <div className="py-6 border-b border-border">
                <h3 className="font-semibold text-xl mb-4">Équipements</h3>
                <div className="grid grid-cols-2 gap-4">
                  {amenities.map((amenity, index) => {
                    const Icon = AMENITY_ICONS[amenity] || Home;
                    return (
                      <div key={index} className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-muted-foreground" />
                        <span>{amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Reviews */}
            {space.reviews && space.reviews.length > 0 && (
              <div className="py-6">
                <div className="flex items-center gap-2 mb-6">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <h3 className="font-semibold text-xl">
                    {space.rating} · {space.review_count} avis
                  </h3>
                </div>

                <div className="space-y-6">
                  {space.reviews.slice(0, 3).map((review) => (
                    <div key={review.id} className="border-b border-border pb-6 last:border-0">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {review.user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <h4 className="font-semibold">{review.user?.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(review.created_at), 'dd MMMM yyyy', { locale: fr })}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1 mb-2">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-muted-foreground">{review.comment}</p>
                    </div>
                  ))}
                </div>

                {space.reviews.length > 3 && (
                  <button className="mt-4 px-6 py-2 border border-border rounded-xl hover:bg-accent transition-colors">
                    Voir tous les avis ({space.review_count})
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-card rounded-2xl border border-border p-6 shadow-xl">
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-3xl font-bold">{space.price_per_night}€</span>
                  <span className="text-muted-foreground">/ nuit</span>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Date d'arrivée</label>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      min={format(new Date(), 'yyyy-MM-dd')}
                      className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Date de départ</label>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      min={checkIn || format(new Date(), 'yyyy-MM-dd')}
                      className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Nombre de voyageurs</label>
                    <input
                      type="number"
                      min="1"
                      max={space.max_guests}
                      value={guests}
                      onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
                      className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Maximum {space.max_guests} voyageurs
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleBooking}
                  disabled={bookingLoading || !checkIn || !checkOut}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {bookingLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                  ) : (
                    'Réserver maintenant'
                  )}
                </button>

                <p className="text-center text-sm text-muted-foreground mt-4">
                  Vous ne serez pas débité pour le moment
                </p>

                <div className="space-y-2 pt-4 border-t border-border mt-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {space.price_per_night}€ × {nights || 0} nuits
                    </span>
                    <span>{subtotal.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Frais de service (10%)</span>
                    <span>{serviceFee.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-border font-semibold">
                    <span>Total</span>
                    <span className="text-blue-600">{totalPrice.toFixed(2)}€</span>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="mt-6 bg-card rounded-2xl border border-border p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Emplacement
                </h3>
                <div className="w-full h-48 bg-muted rounded-xl flex items-center justify-center">
                  <p className="text-muted-foreground">Carte interactive</p>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  {space.location}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
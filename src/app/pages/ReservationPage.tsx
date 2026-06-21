// pages/ReservationPage.tsx
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { 
  Calendar, Clock, Users, MapPin, Star, Home, 
  ChevronLeft, Loader2, AlertCircle, CheckCircle,
  CreditCard, Shield, Mail, Phone, User,
  ArrowRight, CalendarDays, BedDouble, Bath, Wifi,
  Car, Waves, Utensils, Wind, Heart, Share2
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { format, differenceInDays, addDays, isAfter, isBefore } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Space {
  id: string;
  title: string;
  description: string;
  location: string;
  price_per_night: number;
  space_type: string;
  bedrooms: number;
  bathrooms: number;
  max_guests: number;
  amenities: string[];
  rating: number;
  review_count: number;
  images: { image_path: string }[];
  user: { name: string };
}

interface ReservationData {
  space_id: string;
  check_in: string;
  check_out: string;
  guests: number;
  total_price: number;
  service_fee: number;
}

export function ReservationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [space, setSpace] = useState<Space | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Réservation
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [specialRequests, setSpecialRequests] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  
  // États
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  
  // Calculs
  const [nights, setNights] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [serviceFee, setServiceFee] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [availableDates, setAvailableDates] = useState<Date[]>([]);

  useEffect(() => {
    if (id) {
      fetchSpaceDetails();
      if (user) {
        checkFavorite();
      }
    }
  }, [id, user]);

  useEffect(() => {
    if (checkIn && checkOut) {
      calculatePrice();
    }
  }, [checkIn, checkOut, guests, space]);

  const fetchSpaceDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/spaces/${id}`);
      setSpace(response.data);
      // Simuler des dates disponibles
      generateAvailableDates();
    } catch (err: any) {
      console.error('Erreur:', err);
      setError(err.response?.data?.message || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const checkFavorite = async () => {
    try {
      const response = await api.get(`/favorites/${id}/check`);
      setIsFavorite(response.data.is_favorite);
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

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

  const generateAvailableDates = () => {
    const dates: Date[] = [];
    const start = new Date();
    for (let i = 1; i <= 30; i++) {
      const date = addDays(start, i);
      // Simuler des disponibilités (tous les jours sauf quelques uns)
      if (i % 7 !== 3 && i % 7 !== 5) {
        dates.push(date);
      }
    }
    setAvailableDates(dates);
  };

  const calculatePrice = () => {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nightsCount = differenceInDays(checkOutDate, checkInDate);
    
    if (nightsCount > 0 && space) {
      const subtotalAmount = space.price_per_night * nightsCount;
      const serviceFeeAmount = subtotalAmount * 0.10;
      const totalAmount = subtotalAmount + serviceFeeAmount;
      
      setNights(nightsCount);
      setSubtotal(subtotalAmount);
      setServiceFee(serviceFeeAmount);
      setTotalPrice(totalAmount);
    }
  };

  const isDateAvailable = (date: Date) => {
    return availableDates.some(d => 
      d.getDate() === date.getDate() && 
      d.getMonth() === date.getMonth() && 
      d.getFullYear() === date.getFullYear()
    );
  };

  const handleBooking = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!checkIn || !checkOut) {
      setBookingError('Veuillez sélectionner les dates');
      return;
    }

    if (guests < 1) {
      setBookingError('Veuillez indiquer le nombre de voyageurs');
      return;
    }

    if (space && guests > space.max_guests) {
      setBookingError(`Maximum ${space.max_guests} voyageurs`);
      return;
    }

    try {
      setBookingLoading(true);
      setBookingError(null);
      
      const reservationData: ReservationData = {
        space_id: id!,
        check_in: checkIn,
        check_out: checkOut,
        guests: guests,
        total_price: totalPrice,
        service_fee: serviceFee,
      };

      await api.post('/reservations', reservationData);
      setBookingSuccess(true);
      
      // Rediriger après 2 secondes
      setTimeout(() => {
        navigate('/dashboard/user');
      }, 2000);
      
    } catch (err: any) {
      console.error('Erreur:', err);
      setBookingError(err.response?.data?.message || 'Erreur lors de la réservation');
    } finally {
      setBookingLoading(false);
    }
  };

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
        <Link to="/search" className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700">
          Voir les espaces
        </Link>
      </div>
    );
  }

  if (bookingSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-green-50 dark:bg-green-900/20 p-8 rounded-2xl border border-green-200 dark:border-green-800 max-w-md w-full text-center">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Réservation confirmée !</h2>
          <p className="text-muted-foreground mb-4">
            Votre réservation pour {space.title} a été confirmée avec succès.
          </p>
          <p className="text-sm text-muted-foreground">
            Vous serez redirigé vers votre tableau de bord...
          </p>
          <Loader2 className="w-6 h-6 animate-spin text-blue-600 mx-auto mt-4" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link to={`/space/${id}`} className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors">
            <ChevronLeft className="w-4 h-4" />
            Retour à l'espace
          </Link>

          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold mb-1">Confirmer votre réservation</h1>
              <p className="text-muted-foreground">Vérifiez les détails et confirmez</p>
            </div>
            <button
              onClick={toggleFavorite}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border hover:bg-accent transition-colors"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
              <span>{isFavorite ? 'Retirer' : 'Sauvegarder'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Space Summary */}
            <div className="bg-card rounded-2xl border border-border p-6 mb-6">
              <div className="flex gap-4">
                <img
                  src={space.images?.[0]?.image_path || '/placeholder.jpg'}
                  alt={space.title}
                  className="w-32 h-32 object-cover rounded-xl"
                />
                <div>
                  <h3 className="font-semibold text-lg mb-1">{space.title}</h3>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                    <MapPin className="w-4 h-4" />
                    <span>{space.location}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{space.rating}</span>
                      <span className="text-muted-foreground">({space.review_count} avis)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Home className="w-4 h-4" />
                      <span className="capitalize">{space.space_type}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dates Selection */}
            <div className="bg-card rounded-2xl border border-border p-6 mb-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Sélectionnez vos dates
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
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
              </div>

              {checkIn && checkOut && nights > 0 && (
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Durée du séjour</span>
                    <span className="font-semibold">{nights} nuits</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm text-muted-foreground">Dates</span>
                    <span className="font-medium">
                      {format(new Date(checkIn), 'dd MMM', { locale: fr })} - {format(new Date(checkOut), 'dd MMM yyyy', { locale: fr })}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Guests */}
            <div className="bg-card rounded-2xl border border-border p-6 mb-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Voyageurs
              </h3>
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
                <p className="text-sm text-muted-foreground mt-2">
                  Maximum {space.max_guests} voyageurs
                </p>
              </div>
            </div>

            {/* Special Requests */}
            <div className="bg-card rounded-2xl border border-border p-6 mb-6">
              <h3 className="font-semibold text-lg mb-4">Demandes spéciales</h3>
              <textarea
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="Vous avez des demandes particulières ? (optionnel)"
                className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-ring min-h-[100px]"
              />
            </div>

            {/* Payment Method */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Mode de paiement
              </h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 border rounded-xl cursor-pointer hover:bg-accent transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 accent-blue-600"
                  />
                  <CreditCard className="w-5 h-5" />
                  <span>Carte bancaire</span>
                </label>
                <label className="flex items-center gap-3 p-4 border rounded-xl cursor-pointer hover:bg-accent transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="paypal"
                    checked={paymentMethod === 'paypal'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 accent-blue-600"
                  />
                  <span className="font-semibold text-blue-600">PayPal</span>
                </label>
              </div>
            </div>
          </div>

          {/* Summary Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-card rounded-2xl border border-border p-6 shadow-xl">
                <h3 className="font-semibold text-lg mb-4">Résumé</h3>

                {bookingError && (
                  <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 text-sm">
                    {bookingError}
                  </div>
                )}

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{space.price_per_night}€ × {nights || 0} nuits</span>
                    <span>{subtotal.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Frais de service (10%)</span>
                    <span>{serviceFee.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Voyageurs</span>
                    <span>{guests}</span>
                  </div>
                  <div className="pt-3 border-t border-border">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span className="text-blue-600">{totalPrice.toFixed(2)}€</span>
                    </div>
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
                    'Confirmer la réservation'
                  )}
                </button>

                <p className="text-center text-sm text-muted-foreground mt-4 flex items-center justify-center gap-1">
                  <Shield className="w-4 h-4" />
                  Paiement sécurisé
                </p>
              </div>

              {/* Host Info */}
              <div className="mt-6 bg-card rounded-2xl border border-border p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {space.user?.name?.charAt(0).toUpperCase() || 'H'}
                  </div>
                  <div>
                    <p className="font-medium">Hébergé par {space.user?.name}</p>
                    <p className="text-sm text-muted-foreground">Répond généralement en 1h</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
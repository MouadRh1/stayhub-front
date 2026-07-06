// pages/ReservationDetailsPage.tsx
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import {
  Calendar, Clock, Users, MapPin, Star, Home,
  ChevronLeft, Loader2, AlertCircle, CheckCircle, XCircle,
  CreditCard, Shield, Mail, Phone, User as UserIcon,
  BedDouble, Bath, Wifi, Car, Waves, Utensils, Wind,
  Download, MessageCircle, Copy, Check, ChevronDown, ChevronUp,
  Receipt, CalendarCheck, CalendarX, PartyPopper, Building2,
  ImageIcon, ArrowLeft
} from 'lucide-react';
import { api } from '../services/api';
import { format, differenceInDays } from 'date-fns';
import { fr } from 'date-fns/locale';

// ---------- Types ----------
interface SpaceImage {
  image_path: string;
}

interface Host {
  id: string;
  name: string;
  avatar?: string | null;
  response_time?: string;
}

interface ReservationSpace {
  id: string;
  title: string;
  description?: string;
  location: string;
  address?: string;
  price_per_night: number;
  space_type: string;
  bedrooms: number;
  bathrooms: number;
  max_guests: number;
  amenities: string[];
  rating: number;
  review_count: number;
  images?: SpaceImage[];
  featured_image?: string | null;
  user?: Host;
}

interface ReservationDetails {
  id: string;
  reference?: string;
  space: ReservationSpace;
  check_in: string;
  check_out: string;
  guests: number;
  subtotal?: number;
  service_fee: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  payment_method?: 'card' | 'paypal' | string;
  special_requests?: string | null;
  created_at: string;
}

// ---------- Helpers image (mêmes conventions que le reste de l'app) ----------
const getImageUrl = (path: string | null | undefined): string => {
  if (!path) return '/placeholder.jpg';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (path.startsWith('/storage/')) return path;
  if (path.startsWith('storage/')) return '/' + path;
  const baseUrl = import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace('/api', '')
    : 'http://localhost:8000';
  return `${baseUrl}/storage/${path}`;
};

const getPlaceholderImage = (title: string): string => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(title)}&background=6366f1&color=fff&size=400`;
};

// Laravel renvoie souvent les champs decimal/numeric sous forme de string ("25.00")
// -> on force la conversion pour éviter les crashs sur .toFixed()
const toNumber = (value: unknown): number => {
  const n = typeof value === 'string' ? parseFloat(value) : Number(value);
  return Number.isFinite(n) ? n : 0;
};

// ---------- Config statique ----------
const STATUS_CONFIG: Record<string, { label: string; badge: string; dot: string }> = {
  pending: {
    label: 'En attente de confirmation',
    badge: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    dot: 'bg-yellow-500',
  },
  confirmed: {
    label: 'Réservation confirmée',
    badge: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    dot: 'bg-green-500',
  },
  completed: {
    label: 'Séjour terminé',
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    dot: 'bg-blue-500',
  },
  cancelled: {
    label: 'Réservation annulée',
    badge: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    dot: 'bg-red-500',
  },
};

const JOURNEY_STEPS = [
  { key: 'pending', label: 'Réservation créée', icon: Receipt },
  { key: 'confirmed', label: 'Confirmée par l\'hôte', icon: CalendarCheck },
  { key: 'completed', label: 'Séjour terminé', icon: PartyPopper },
];

const AMENITY_ICONS: Record<string, any> = {
  'WiFi': Wifi,
  'Parking': Car,
  'Piscine': Waves,
  'Cuisine': Utensils,
  'Climatisation': Wind,
};

export function ReservationDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [reservation, setReservation] = useState<ReservationDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeImage, setActiveImage] = useState(0);
  const [policyOpen, setPolicyOpen] = useState(false);
  const [cancelPanelOpen, setCancelPanelOpen] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (id) fetchReservation();
  }, [id]);

  const fetchReservation = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/reservations/${id}`);
      setReservation(response.data.data || response.data);
    } catch (err: any) {
      console.error('Erreur:', err);
      setError(err.response?.data?.message || 'Impossible de charger cette réservation');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!reservation) return;
    try {
      setCancelLoading(true);
      setCancelError(null);
      await api.patch(`/reservations/${reservation.id}/cancel`);
      setReservation(prev => prev ? { ...prev, status: 'cancelled' } : prev);
      setCancelPanelOpen(false);
    } catch (err: any) {
      console.error('Erreur:', err);
      setCancelError(err.response?.data?.message || 'Impossible d\'annuler la réservation');
    } finally {
      setCancelLoading(false);
    }
  };

  const copyReference = () => {
    if (!reservation) return;
    const ref = reservation.reference || reservation.id;
    navigator.clipboard.writeText(String(ref));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ---------- États de chargement / erreur ----------
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-16 h-16 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !reservation) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">{error || 'Réservation introuvable'}</h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          Cette réservation n'existe pas ou vous n'avez pas accès à ses détails.
        </p>
        <Link to="/dashboard/user" className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
          Retour à mon espace
        </Link>
      </div>
    );
  }

  const space = reservation.space;
  const gallery: string[] =
    space.images && space.images.length > 0
      ? space.images.map(img => img.image_path)
      : space.featured_image
      ? [space.featured_image]
      : [];
  const placeholderImage = getPlaceholderImage(space.title);
  const heroUrl = gallery.length > 0 ? getImageUrl(gallery[activeImage]) : placeholderImage;

  const nights = differenceInDays(new Date(reservation.check_out), new Date(reservation.check_in));
  const pricePerNight = toNumber(space.price_per_night);
  const serviceFee = toNumber(reservation.service_fee);
  const totalPrice = toNumber(reservation.total_price);
  const subtotal = reservation.subtotal !== undefined ? toNumber(reservation.subtotal) : totalPrice - serviceFee;
  const statusInfo = STATUS_CONFIG[reservation.status] || STATUS_CONFIG.pending;
  const currentStepIndex = JOURNEY_STEPS.findIndex(s => s.key === reservation.status);
  const isCancelled = reservation.status === 'cancelled';
  const canCancel = !isCancelled && reservation.status !== 'completed';
  const reference = reservation.reference || `RES-${String(reservation.id).slice(-8).toUpperCase()}`;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back link */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Retour
        </button>

        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">Votre réservation</h1>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.badge}`}>
                {statusInfo.label}
              </span>
            </div>
            <button
              onClick={copyReference}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
            >
              <span className="font-mono">Réf. {reference}</span>
              {copied ? (
                <Check className="w-3.5 h-3.5 text-green-500" />
              ) : (
                <Copy className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border hover:bg-accent transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Télécharger le reçu</span>
            </button>
          </div>
        </div>

        {/* Journey / Timeline */}
        {!isCancelled ? (
          <div className="bg-card rounded-2xl border border-border p-6 mb-8">
            <div className="flex items-center">
              {JOURNEY_STEPS.map((step, index) => {
                const Icon = step.icon;
                const isDone = index <= currentStepIndex;
                const isLast = index === JOURNEY_STEPS.length - 1;
                return (
                  <div key={step.key} className={`flex items-center ${isLast ? '' : 'flex-1'}`}>
                    <div className="flex flex-col items-center gap-2 shrink-0">
                      <div
                        className={`w-11 h-11 rounded-full flex items-center justify-center transition-colors ${
                          isDone
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-600/25'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`text-xs text-center max-w-[100px] ${isDone ? 'font-medium' : 'text-muted-foreground'}`}>
                        {step.label}
                      </span>
                    </div>
                    {!isLast && (
                      <div className={`flex-1 h-0.5 mx-2 rounded-full ${index < currentStepIndex ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-muted'}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 mb-8">
            <CalendarX className="w-8 h-8 text-red-500 shrink-0" />
            <div>
              <p className="font-semibold text-red-700 dark:text-red-400">Cette réservation a été annulée</p>
              <p className="text-sm text-red-600/80 dark:text-red-400/70">Aucun montant ne sera prélevé pour ce séjour.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Gallery */}
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              <div className="relative h-72 md:h-96 bg-gradient-to-br from-blue-100 to-purple-100">
                <img
                  src={heroUrl}
                  alt={space.title}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.src = placeholderImage; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h2 className="text-2xl font-bold mb-1">{space.title}</h2>
                  <div className="flex items-center gap-1.5 text-sm opacity-90">
                    <MapPin className="w-4 h-4" />
                    <span>{space.location}</span>
                  </div>
                </div>
                {gallery.length === 0 && (
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/50 text-white text-xs px-2.5 py-1 rounded-lg backdrop-blur-sm">
                    <ImageIcon className="w-3.5 h-3.5" />
                    Aucune photo
                  </div>
                )}
              </div>
              {gallery.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto">
                  {gallery.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImage(index)}
                      className={`shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                        activeImage === index ? 'border-blue-600' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={getImageUrl(img)}
                        alt={`${space.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.currentTarget.src = placeholderImage; }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Détails du séjour */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="font-semibold text-lg mb-5 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                Détails du séjour
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                <div className="p-4 rounded-xl bg-accent/50 border border-border">
                  <p className="text-xs text-muted-foreground mb-1">Arrivée</p>
                  <p className="font-semibold">{format(new Date(reservation.check_in), 'dd MMM yyyy', { locale: fr })}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">à partir de 15h00</p>
                </div>
                <div className="p-4 rounded-xl bg-accent/50 border border-border">
                  <p className="text-xs text-muted-foreground mb-1">Départ</p>
                  <p className="font-semibold">{format(new Date(reservation.check_out), 'dd MMM yyyy', { locale: fr })}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">avant 11h00</p>
                </div>
                <div className="p-4 rounded-xl bg-accent/50 border border-border">
                  <p className="text-xs text-muted-foreground mb-1">Durée</p>
                  <p className="font-semibold">{nights} nuit{nights > 1 ? 's' : ''}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                    <Users className="w-3 h-3" /> {reservation.guests} voyageur{reservation.guests > 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {reservation.special_requests && (
                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/30">
                  <p className="text-sm font-medium mb-1">Demande spéciale</p>
                  <p className="text-sm text-muted-foreground">{reservation.special_requests}</p>
                </div>
              )}
            </div>

            {/* À propos du logement */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="font-semibold text-lg mb-5 flex items-center gap-2">
                <Home className="w-5 h-5 text-purple-500" />
                À propos du logement
              </h3>

              <div className="flex items-center gap-4 flex-wrap mb-5 text-sm">
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/50">
                  <Building2 className="w-4 h-4" /> <span className="capitalize">{space.space_type}</span>
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/50">
                  <BedDouble className="w-4 h-4" /> {space.bedrooms} chambre{space.bedrooms > 1 ? 's' : ''}
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/50">
                  <Bath className="w-4 h-4" /> {space.bathrooms} sdb
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/50">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /> {space.rating || '—'}
                  <span className="text-muted-foreground">({space.review_count} avis)</span>
                </span>
              </div>

              {space.description && (
                <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{space.description}</p>
              )}

              {space.amenities && space.amenities.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-3">Équipements</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {space.amenities.map((amenity) => {
                      const Icon = AMENITY_ICONS[amenity] || CheckCircle;
                      return (
                        <div key={amenity} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Icon className="w-4 h-4 shrink-0" />
                          <span>{amenity}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <Link
                to={`/space/${space.id}`}
                className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 mt-5 font-medium"
              >
                Voir la page complète du logement
                <ChevronLeft className="w-3.5 h-3.5 rotate-180" />
              </Link>
            </div>

            {/* Politique d'annulation */}
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              <button
                onClick={() => setPolicyOpen(!policyOpen)}
                className="w-full flex items-center justify-between p-6"
              >
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-500" />
                  Politique d'annulation
                </h3>
                {policyOpen ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
              </button>
              {policyOpen && (
                <div className="px-6 pb-6 text-sm text-muted-foreground space-y-2">
                  <p>Annulation gratuite jusqu'à 48h avant l'arrivée. Passé ce délai, la première nuit est facturée.</p>
                  <p>En cas d'annulation par l'hôte, le remboursement intégral est effectué automatiquement sous 5 jours ouvrés.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Price breakdown */}
              <div className="bg-card rounded-2xl border border-border p-6 shadow-xl">
                <h3 className="font-semibold text-lg mb-4">Récapitulatif du prix</h3>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{pricePerNight.toFixed(2)}€ × {nights} nuit{nights > 1 ? 's' : ''}</span>
                    <span>{subtotal.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Frais de service</span>
                    <span>{serviceFee.toFixed(2)}€</span>
                  </div>
                  <div className="pt-3 border-t border-border flex justify-between font-semibold text-lg">
                    <span>Total {isCancelled ? 'annulé' : 'payé'}</span>
                    <span className={isCancelled ? 'line-through text-muted-foreground' : 'text-blue-600'}>
                      {totalPrice.toFixed(2)}€
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t border-border">
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>
                    Payé par {reservation.payment_method === 'paypal' ? 'PayPal' : 'carte bancaire'} ·{' '}
                    {format(new Date(reservation.created_at), 'dd MMM yyyy', { locale: fr })}
                  </span>
                </div>
              </div>

              {/* Host */}
              {space.user && (
                <div className="bg-card rounded-2xl border border-border p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold shrink-0">
                      {space.user.name?.charAt(0).toUpperCase() || 'H'}
                    </div>
                    <div>
                      <p className="font-medium">Hébergé par {space.user.name}</p>
                      <p className="text-xs text-muted-foreground">{space.user.response_time || 'Répond généralement en 1h'}</p>
                    </div>
                  </div>
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border hover:bg-accent transition-colors text-sm font-medium">
                    <MessageCircle className="w-4 h-4" />
                    Contacter l'hôte
                  </button>
                </div>
              )}

              {/* Actions */}
              {canCancel && (
                <div className="bg-card rounded-2xl border border-border p-5">
                  {!cancelPanelOpen ? (
                    <button
                      onClick={() => setCancelPanelOpen(true)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-destructive text-destructive hover:bg-destructive/10 transition-colors text-sm font-medium"
                    >
                      <XCircle className="w-4 h-4" />
                      Annuler la réservation
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm font-medium">Confirmer l'annulation ?</p>
                      <p className="text-xs text-muted-foreground">Cette action est irréversible. Consultez la politique d'annulation ci-dessus.</p>
                      {cancelError && (
                        <p className="text-xs text-red-600">{cancelError}</p>
                      )}
                      <div className="flex gap-2">
                        <button
                          onClick={handleCancel}
                          disabled={cancelLoading}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors text-sm font-medium disabled:opacity-50"
                        >
                          {cancelLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirmer'}
                        </button>
                        <button
                          onClick={() => setCancelPanelOpen(false)}
                          className="flex-1 px-4 py-2.5 rounded-xl border border-border hover:bg-accent transition-colors text-sm font-medium"
                        >
                          Retour
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Support */}
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-5 text-white">
                <p className="font-medium mb-1">Besoin d'aide ?</p>
                <p className="text-sm opacity-90 mb-4">Notre équipe support est disponible 7j/7 pour toute question sur cette réservation.</p>
                <div className="flex items-center gap-2 text-sm mb-2 opacity-90">
                  <Mail className="w-4 h-4" /> support@exemple.com
                </div>
                <div className="flex items-center gap-2 text-sm opacity-90">
                  <Phone className="w-4 h-4" /> +212 5XX XX XX XX
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
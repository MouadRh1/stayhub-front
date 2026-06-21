import { useState } from 'react';
import { useParams, Link } from 'react-router';
import { Star, MapPin, Wifi, Car, Waves, Utensils, Wind, Heart, Share2, ChevronLeft, ChevronRight, Users, BedDouble, Bath, Home } from 'lucide-react';
import { ImageWithFallback } from '../components/ImageWithFallback';

const PROPERTY_IMAGES = [
  'https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?w=1200',
  'https://images.unsplash.com/photo-1578898886225-c7c894047899?w=1200',
  'https://images.unsplash.com/photo-1605346434674-a440ca4dc4c0?w=1200',
  'https://images.unsplash.com/photo-1590490359854-dfba19688d70?w=1200',
  'https://images.unsplash.com/photo-1515362778563-6a8d0e44bc0b?w=1200'
];

const AMENITIES = [
  { icon: Wifi, label: 'WiFi Haut Débit' },
  { icon: Car, label: 'Parking Gratuit' },
  { icon: Waves, label: 'Piscine Privée' },
  { icon: Utensils, label: 'Cuisine Équipée' },
  { icon: Wind, label: 'Climatisation' },
  { icon: BedDouble, label: '3 Chambres' },
  { icon: Bath, label: '2 Salles de Bain' },
  { icon: Users, label: '6 Voyageurs' }
];

const REVIEWS = [
  {
    name: 'Sophie Martin',
    avatar: 'SM',
    rating: 5,
    date: '15 Mai 2026',
    comment: 'Logement exceptionnel ! Exactement comme sur les photos. L\'hôte était très accueillant et réactif. La piscine est magnifique et la vue imprenable.'
  },
  {
    name: 'Thomas Dubois',
    avatar: 'TD',
    rating: 5,
    date: '3 Mai 2026',
    comment: 'Séjour parfait en famille. Le logement est spacieux, propre et très bien équipé. L\'emplacement est idéal pour visiter la région.'
  },
  {
    name: 'Marie Laurent',
    avatar: 'ML',
    rating: 4,
    date: '28 Avril 2026',
    comment: 'Très bel endroit, calme et reposant. Quelques petits détails à améliorer mais dans l\'ensemble excellent séjour.'
  }
];

export function PropertyDetailPage() {
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % PROPERTY_IMAGES.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + PROPERTY_IMAGES.length) % PROPERTY_IMAGES.length);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link to="/search" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4">
            <ChevronLeft className="w-4 h-4" />
            Retour aux résultats
          </Link>

          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Villa Moderne avec Piscine Privée</h1>
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium text-foreground">4.9</span>
                  <span>(124 avis)</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>Cannes, France</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border hover:bg-accent transition-colors"
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                <span className="hidden sm:inline">Sauvegarder</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border hover:bg-accent transition-colors">
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline">Partager</span>
              </button>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-8 rounded-2xl overflow-hidden">
          <div className="md:col-span-2 md:row-span-2 relative group">
            <ImageWithFallback
              src={PROPERTY_IMAGES[currentImageIndex]}
              alt="Main property"
              className="w-full h-full object-cover min-h-[300px] md:min-h-[500px]"
            />
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          {PROPERTY_IMAGES.slice(1, 5).map((img, index) => (
            <div key={index} className="relative group cursor-pointer" onClick={() => setCurrentImageIndex(index + 1)}>
              <ImageWithFallback
                src={img}
                alt={`Property ${index + 1}`}
                className="w-full h-full object-cover min-h-[150px] md:min-h-[245px]"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Host Info */}
            <div className="flex items-center justify-between pb-6 border-b border-border">
              <div>
                <h2 className="text-2xl font-semibold mb-1">Villa entière hébergée par Marie</h2>
                <p className="text-muted-foreground">6 voyageurs · 3 chambres · 2 salles de bain</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-xl">
                ML
              </div>
            </div>

            {/* Description */}
            <div className="py-6 border-b border-border">
              <h3 className="font-semibold text-xl mb-4">À propos de ce logement</h3>
              <p className="text-muted-foreground leading-relaxed">
                Magnifique villa moderne située dans un quartier résidentiel calme de Cannes.
                Profitez d'une piscine privée chauffée, d'une terrasse spacieuse avec vue mer et
                d'un jardin méditerranéen. La villa est parfaite pour les familles ou les groupes
                d'amis souhaitant découvrir la Côte d'Azur dans un cadre luxueux et apaisant.
                <br /><br />
                À seulement 10 minutes des plages de la Croisette et 15 minutes du Palais des Festivals,
                vous bénéficierez d'un emplacement idéal pour explorer Cannes et ses environs tout en
                profitant du calme d'un quartier résidentiel.
              </p>
            </div>

            {/* Amenities */}
            <div className="py-6 border-b border-border">
              <h3 className="font-semibold text-xl mb-4">Équipements</h3>
              <div className="grid grid-cols-2 gap-4">
                {AMENITIES.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <amenity.icon className="w-5 h-5 text-muted-foreground" />
                    <span>{amenity.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="py-6">
              <div className="flex items-center gap-2 mb-6">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <h3 className="font-semibold text-xl">4.9 · {REVIEWS.length} avis</h3>
              </div>

              <div className="space-y-6">
                {REVIEWS.map((review, index) => (
                  <div key={index} className="border-b border-border pb-6 last:border-0">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {review.avatar}
                      </div>
                      <div>
                        <h4 className="font-semibold">{review.name}</h4>
                        <p className="text-sm text-muted-foreground">{review.date}</p>
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

              <button className="mt-6 px-6 py-3 border border-border rounded-xl hover:bg-accent transition-colors">
                Voir tous les avis
              </button>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-card rounded-2xl border border-border p-6 shadow-xl">
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-3xl font-bold">450€</span>
                  <span className="text-muted-foreground">/ nuit</span>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Date d'arrivée</label>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Date de départ</label>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Nombre de voyageurs</label>
                    <input
                      type="number"
                      min="1"
                      max="6"
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      className="w-full px-4 py-3 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>

                <button className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all mb-4">
                  Réserver maintenant
                </button>

                <p className="text-center text-sm text-muted-foreground mb-4">
                  Vous ne serez pas débité pour le moment
                </p>

                <div className="space-y-2 pt-4 border-t border-border">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">450€ × 5 nuits</span>
                    <span>2,250€</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Frais de service</span>
                    <span>225€</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-border font-semibold">
                    <span>Total</span>
                    <span>2,475€</span>
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
                  Cannes, Alpes-Maritimes, France
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

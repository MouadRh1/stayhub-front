// pages/HomePage.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { ChevronRight, Loader2 } from 'lucide-react';
import { SearchBar } from '../components/SearchBar';
import { PropertyCard } from '../components/PropertyCard';
import { HeroSection } from '../components/home/HeroSection';
import { FeaturesSection } from '../components/home/FeaturesSection';
import { TestimonialsSection } from '../components/home/TestimonialsSection';
import { FAQSection } from '../components/home/FAQSection';
import { CTASection } from '../components/home/CTASection';
import { api } from '../services/api';

// Types
interface Space {
  id: string;
  title: string;
  description: string;
  location: string;
  price_per_night: number;
  space_type: string;
  rating: number;
  review_count: number;
  images: string[];
}

interface Destination {
  name: string;
  image?: string;
  spaces_count: number;
}

// Map des images par défaut pour les destinations
const DESTINATION_IMAGES: Record<string, string> = {
  'Paris': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600',
  'Nice': 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600',
  'Cannes': 'https://images.unsplash.com/photo-1550945773-5d9a0e58368f?w=600',
  'Chamonix': 'https://images.unsplash.com/photo-1521193089947-39e2b0ec6a9a?w=600',
  'Lyon': 'https://images.unsplash.com/photo-1521271691028-65ad0f8ad2c7?w=600',
  'Marseille': 'https://images.unsplash.com/photo-1533928298208-27ff66555d8d?w=600',
  'Bordeaux': 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600',
  'Monaco': 'https://images.unsplash.com/photo-1526540757070-cf746f925a09?w=600',
  'Saint-Tropez': 'https://images.unsplash.com/photo-1534676958213-867c86443044?w=600',
  'Provence': 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600',
};

export function HomePage() {
  const [popularSpaces, setPopularSpaces] = useState<Space[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState({
    spaces: true,
    destinations: true,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPopularSpaces();
    fetchDestinations();
  }, []);

  const fetchPopularSpaces = async () => {
    try {
      setLoading(prev => ({ ...prev, spaces: true }));
      const response = await api.get('/spaces/popular');
      console.log('Popular spaces response:', response.data);
      
      // Vérifier le format des données
      let data = response.data;
      if (!Array.isArray(data)) {
        data = data.data || [];
      }
      
      setPopularSpaces(data);
      setError(null);
    } catch (err: any) {
      console.error('Erreur détaillée:', err);
      console.error('Response:', err.response);
      console.error('Data:', err.response?.data);
      
      // Message d'erreur plus précis
      const errorMessage = err.response?.data?.message || err.message || 'Impossible de charger les logements populaires';
      setError(errorMessage);
      
      // Ne pas bloquer l'affichage des destinations si les espaces populaires échouent
      setPopularSpaces([]);
    } finally {
      setLoading(prev => ({ ...prev, spaces: false }));
    }
  };

  const fetchDestinations = async () => {
    try {
      setLoading(prev => ({ ...prev, destinations: true }));
      const response = await api.get('/spaces/trending-destinations');
      console.log('Destinations response:', response.data);
      
      // Vérifier le format des données
      let data = response.data;
      if (!Array.isArray(data)) {
        data = data.data || [];
      }
      
      // Ajouter les images si manquantes
      data = data.map((dest: Destination) => ({
        ...dest,
        image: dest.image || DESTINATION_IMAGES[dest.name] || `https://picsum.photos/seed/${dest.name}/600/400`
      }));
      
      setDestinations(data);
      setError(null);
    } catch (err) {
      console.error('Erreur:', err);
      setError('Impossible de charger les destinations');
      setDestinations([]);
    } finally {
      setLoading(prev => ({ ...prev, destinations: false }));
    }
  };

  // Fonction pour obtenir une image de destination
  const getDestinationImage = (name: string): string => {
    return DESTINATION_IMAGES[name] || `https://picsum.photos/seed/${name}/600/400`;
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Popular Properties */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Logements Populaires</h2>
            <p className="text-muted-foreground">Les favoris de nos voyageurs</p>
          </div>
          <Link to="/search" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors">
            Voir tout
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading.spaces ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
          </div>
        ) : error && popularSpaces.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{error}</p>
            <button 
              onClick={fetchPopularSpaces}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              Réessayer
            </button>
          </div>
        ) : popularSpaces.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Aucun logement populaire disponible</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularSpaces.slice(0, 4).map((space) => (
              <PropertyCard
                key={space.id}
                id={space.id}
                image={space.images?.[0] || '/placeholder.jpg'}
                title={space.title}
                location={space.location}
                price={space.price_per_night}
                rating={space.rating || 0}
                reviews={space.review_count || 0}
                type={space.space_type}
              />
            ))}
          </div>
        )}
      </section>

      {/* Trending Destinations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Destinations Tendances</h2>
          <p className="text-muted-foreground">Découvrez les destinations les plus populaires du moment</p>
        </div>

        {loading.destinations ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
          </div>
        ) : error && destinations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{error}</p>
          </div>
        ) : destinations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Aucune destination disponible</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {destinations.map((destination, index) => (
              <Link
                key={index}
                to={`/search?location=${encodeURIComponent(destination.name)}`}
                className="group relative h-80 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                <img
                  src={destination.image || getDestinationImage(destination.name)}
                  alt={destination.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = `https://picsum.photos/seed/${destination.name}/600/400`;
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                  <h3 className="text-white text-2xl font-bold mb-1 group-hover:text-blue-400 transition-colors">
                    {destination.name}
                  </h3>
                  <p className="text-white/80 text-sm">
                    {destination.spaces_count} logement{destination.spaces_count > 1 ? 's' : ''}
                  </p>
                  <div className="mt-3 inline-flex items-center gap-1 text-white/60 text-sm group-hover:text-white transition-colors">
                    Découvrir
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Features */}
      <FeaturesSection />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* FAQ */}
      <FAQSection />

      {/* CTA */}
      <CTASection />
    </div>
  );
}
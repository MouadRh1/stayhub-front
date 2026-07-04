// pages/SearchPage.tsx
import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router';
import { PropertyCard } from '../components/PropertyCard';
import { SearchBar } from '../components/SearchBar';
import { 
  SlidersHorizontal, Grid, List, MapIcon, 
  Loader2, AlertCircle, ChevronLeft, ChevronRight,
  Search, Filter
} from 'lucide-react';
import { api } from '../services/api';

interface Space {
  id: string;
  title: string;
  description: string;
  location: string;
  price_per_night: number;
  space_type: string;
  rating: number;
  review_count: number;
  featured_image: string | null; // Changé de images à featured_image
  max_guests: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
}

// Fonction pour construire l'URL de l'image (identique à OwnerDashboard)
const getImageUrl = (path: string | null): string => {
  if (!path) return '/placeholder.jpg';
  
  // Si c'est une URL complète (Unsplash, etc.)
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Si le chemin commence déjà par /storage/
  if (path.startsWith('/storage/')) {
    return path;
  }
  
  // Si le chemin commence par storage/ (sans slash)
  if (path.startsWith('storage/')) {
    return '/' + path;
  }
  
  // Si le chemin commence par /uploads/
  if (path.startsWith('/uploads/')) {
    const baseUrl = import.meta.env.VITE_API_URL 
      ? import.meta.env.VITE_API_URL.replace('/api', '') 
      : 'http://localhost:8000';
    return `${baseUrl}${path}`;
  }
  
  // Construction de l'URL pour les images locales
  const baseUrl = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace('/api', '') 
    : 'http://localhost:8000';
  
  return `${baseUrl}/storage/${path}`;
};

// Helper pour le placeholder d'image
const getPlaceholderImage = (title: string): string => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(title)}&background=6366f1&color=fff&size=200`;
};

interface Filters {
  type: string;
  priceRange: string;
  amenities: string[];
  guests: number | null;
  bedrooms: number | null;
  minPrice: number | null;
  maxPrice: number | null;
}

const SPACE_TYPES = ['Tous', 'appartement', 'villa', 'maison', 'chalet', 'studio', 'loft', 'penthouse'];
const PRICE_RANGES = [
  { label: 'Tous les prix', min: null, max: null },
  { label: '< 100€', min: 0, max: 100 },
  { label: '100€ - 200€', min: 100, max: 200 },
  { label: '200€ - 400€', min: 200, max: 400 },
  { label: '> 400€', min: 400, max: null },
];
const AMENITIES_LIST = ['WiFi', 'Piscine', 'Parking', 'Cuisine', 'Climatisation', 'Jacuzzi', 'Sauna', 'Balcon'];

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // États des espaces
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  
  // États UI
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showMap, setShowMap] = useState(false);
  
  // Filtres
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Filters>({
    type: 'Tous',
    priceRange: 'Tous les prix',
    amenities: [],
    guests: null,
    bedrooms: null,
    minPrice: null,
    maxPrice: null,
  });
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Récupérer les paramètres de recherche depuis l'URL
  useEffect(() => {
    const query = searchParams.get('q') || '';
    const type = searchParams.get('type') || 'Tous';
    const guestsParam = searchParams.get('guests');
    const minPriceParam = searchParams.get('min_price');
    const maxPriceParam = searchParams.get('max_price');

    setSearchQuery(query);
    setFilters(prev => ({
      ...prev,
      type: type !== 'Tous' ? type : 'Tous',
      guests: guestsParam ? parseInt(guestsParam) : null,
      minPrice: minPriceParam ? parseFloat(minPriceParam) : null,
      maxPrice: maxPriceParam ? parseFloat(maxPriceParam) : null,
    }));
  }, [searchParams]);

  // Charger les espaces
  const fetchSpaces = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params: any = {
        page: currentPage,
        per_page: 12,
        sort_by: sortBy,
        sort_order: sortOrder,
      };

      // Ajouter les filtres
      if (searchQuery) params.search = searchQuery;
      if (filters.type !== 'Tous') params.space_type = filters.type;
      if (filters.minPrice !== null) params.min_price = filters.minPrice;
      if (filters.maxPrice !== null) params.max_price = filters.maxPrice;
      if (filters.guests) params.guests = filters.guests;
      if (filters.bedrooms) params.bedrooms = filters.bedrooms;
      if (filters.amenities.length > 0) {
        params.amenities = filters.amenities.join(',');
      }

      const response = await api.get('/spaces', { params });
      
      setSpaces(response.data.data || []);
      setTotal(response.data.total || 0);
      setLastPage(response.data.last_page || 1);
      setError(null);
    } catch (err: any) {
      console.error('Erreur:', err);
      setError(err.response?.data?.message || 'Erreur lors du chargement des espaces');
      setSpaces([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, filters, sortBy, sortOrder]);

  useEffect(() => {
    fetchSpaces();
  }, [fetchSpaces]);

  // Gérer le changement de page
  const handlePageChange = (page: number) => {
    if (page < 1 || page > lastPage) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Gérer la recherche
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
    const params = new URLSearchParams(searchParams);
    if (value) params.set('q', value);
    else params.delete('q');
    setSearchParams(params);
  };

  // Gérer l'application des filtres
  const applyFilters = () => {
    const priceRange = PRICE_RANGES.find(r => r.label === filters.priceRange);
    setFilters(prev => ({
      ...prev,
      minPrice: priceRange?.min ?? null,
      maxPrice: priceRange?.max ?? null,
    }));
    setCurrentPage(1);
    setShowFilters(false);
    
    // Mettre à jour l'URL
    const params = new URLSearchParams(searchParams);
    if (filters.type !== 'Tous') params.set('type', filters.type);
    else params.delete('type');
    if (filters.guests) params.set('guests', String(filters.guests));
    else params.delete('guests');
    if (filters.minPrice !== null) params.set('min_price', String(filters.minPrice));
    else params.delete('min_price');
    if (filters.maxPrice !== null) params.set('max_price', String(filters.maxPrice));
    else params.delete('max_price');
    setSearchParams(params);
  };

  // Réinitialiser les filtres
  const resetFilters = () => {
    setFilters({
      type: 'Tous',
      priceRange: 'Tous les prix',
      amenities: [],
      guests: null,
      bedrooms: null,
      minPrice: null,
      maxPrice: null,
    });
    setSearchQuery('');
    setCurrentPage(1);
    setShowFilters(false);
    
    // Réinitialiser l'URL
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    setSearchParams(params);
  };

  // Toggle amenity
  const toggleAmenity = (amenity: string) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  // Nombre de filtres actifs
  const activeFiltersCount = () => {
    let count = 0;
    if (filters.type !== 'Tous') count++;
    if (filters.priceRange !== 'Tous les prix') count++;
    if (filters.amenities.length > 0) count++;
    if (filters.guests) count++;
    if (filters.bedrooms) count++;
    if (searchQuery) count++;
    return count;
  };

  // Rendu du loader
  if (loading && currentPage === 1) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-16 h-16 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Search Bar */}
      <div className="sticky top-16 z-40 bg-background border-b border-border py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SearchBar  
            initialValue={searchQuery}
            onSearch={handleSearch}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4 flex-wrap">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border hover:bg-accent transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filtres</span>
              {activeFiltersCount() > 0 && (
                <span className="w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                  {activeFiltersCount()}
                </span>
              )}
            </button>

            <div className="hidden lg:flex items-center gap-2 flex-wrap">
              {SPACE_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setFilters(prev => ({ ...prev, type }));
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2 rounded-xl text-sm transition-colors whitespace-nowrap ${
                    filters.type === type
                      ? 'bg-primary text-primary-foreground'
                      : 'border border-border hover:bg-accent'
                  }`}
                >
                  {type === 'Tous' ? 'Tous' : type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-ring text-sm"
            >
              <option value="created_at">Plus récents</option>
              <option value="price_per_night">Prix croissant</option>
              <option value="rating">Note</option>
              <option value="review_count">Popularité</option>
            </select>

            <button
              onClick={() => setShowMap(!showMap)}
              className={`px-4 py-2 rounded-xl border border-border hover:bg-accent transition-colors flex items-center gap-2 ${
                showMap ? 'bg-accent' : ''
              }`}
            >
              <MapIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Carte</span>
            </button>

            <div className="flex items-center gap-1 border border-border rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-accent' : 'hover:bg-accent/50'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-accent' : 'hover:bg-accent/50'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="bg-card rounded-2xl border border-border p-6 mb-6 animate-in slide-in-from-top duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Filtres avancés</h3>
              <button
                onClick={resetFilters}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Réinitialiser tout
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Type */}
              <div>
                <label className="block font-semibold mb-3">Type de logement</label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {SPACE_TYPES.map((type) => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="propertyType"
                        checked={filters.type === type}
                        onChange={() => setFilters(prev => ({ ...prev, type }))}
                        className="w-4 h-4 accent-blue-600"
                      />
                      <span>{type === 'Tous' ? 'Tous' : type.charAt(0).toUpperCase() + type.slice(1)}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Prix */}
              <div>
                <label className="block font-semibold mb-3">Gamme de prix</label>
                <div className="space-y-2">
                  {PRICE_RANGES.map((range) => (
                    <label key={range.label} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="priceRange"
                        checked={filters.priceRange === range.label}
                        onChange={() => setFilters(prev => ({ ...prev, priceRange: range.label }))}
                        className="w-4 h-4 accent-blue-600"
                      />
                      <span>{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Équipements */}
              <div>
                <label className="block font-semibold mb-3">Équipements</label>
                <div className="space-y-2">
                  {AMENITIES_LIST.map((amenity) => (
                    <label key={amenity} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.amenities.includes(amenity)}
                        onChange={() => toggleAmenity(amenity)}
                        className="w-4 h-4 accent-blue-600 rounded"
                      />
                      <span>{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Capacité */}
              <div>
                <label className="block font-semibold mb-3">Capacité</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  placeholder="Nombre de voyageurs"
                  value={filters.guests || ''}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    guests: e.target.value ? parseInt(e.target.value) : null 
                  }))}
                  className="w-full px-4 py-2 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* Chambres */}
              <div>
                <label className="block font-semibold mb-3">Chambres</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  placeholder="Nombre de chambres"
                  value={filters.bedrooms || ''}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    bedrooms: e.target.value ? parseInt(e.target.value) : null 
                  }))}
                  className="w-full px-4 py-2 bg-input-background rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-4 border-t border-border">
              <button
                onClick={applyFilters}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-colors"
              >
                Appliquer les filtres
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="px-6 py-2 border border-border rounded-xl hover:bg-accent transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        <div className="flex gap-6">
          {/* Properties List */}
          <div className={showMap ? 'w-1/2' : 'w-full'}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-muted-foreground">
                {total} logement{total > 1 ? 's' : ''} disponibles
              </p>
              {loading && currentPage > 1 && (
                <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
              )}
            </div>

            {error ? (
              <div className="text-center py-12 bg-card rounded-2xl border border-border">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Erreur</h3>
                <p className="text-muted-foreground mb-4">{error}</p>
                <button
                  onClick={fetchSpaces}
                  className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Réessayer
                </button>
              </div>
            ) : spaces.length === 0 ? (
              <div className="text-center py-12 bg-card rounded-2xl border border-border">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Aucun résultat</h3>
                <p className="text-muted-foreground mb-4">
                  Aucun logement ne correspond à vos critères de recherche.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={resetFilters}
                    className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    Réinitialiser les filtres
                  </button>
                  <Link
                    to="/"
                    className="px-6 py-2 border border-border rounded-xl hover:bg-accent transition-colors"
                  >
                    Retour à l'accueil
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <div className={viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 gap-6' 
                  : 'space-y-6'
                }>
                  {spaces.map((space) => {
                    const imageUrl = getImageUrl(space.featured_image);
                    const placeholderImage = getPlaceholderImage(space.title);
                    
                    return (
                      <PropertyCard
                        key={space.id}
                        id={space.id}
                        image={imageUrl}
                        title={space.title}
                        location={space.location}
                        price={space.price_per_night}
                        rating={space.rating || 0}
                        reviews={space.review_count || 0}
                        type={space.space_type}
                      />
                    );
                  })}
                </div>

                {/* Pagination */}
                {lastPage > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 rounded-lg border border-border hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    {Array.from({ length: Math.min(5, lastPage) }, (_, i) => {
                      let pageNum;
                      if (lastPage <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= lastPage - 2) {
                        pageNum = lastPage - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-4 py-2 rounded-lg transition-colors ${
                            currentPage === pageNum
                              ? 'bg-primary text-primary-foreground'
                              : 'border border-border hover:bg-accent'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === lastPage}
                      className="px-4 py-2 rounded-lg border border-border hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Map */}
          {showMap && (
            <div className="w-1/2 sticky top-32 h-[calc(100vh-12rem)]">
              <div className="w-full h-full bg-muted rounded-2xl border border-border flex items-center justify-center">
                <div className="text-center">
                  <MapIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Carte interactive</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {spaces.length} logements affichés
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
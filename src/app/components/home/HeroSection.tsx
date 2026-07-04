// components/home/HeroSection.tsx
import { SearchBar } from '../SearchBar';
import bgVideo from '../../assets/bg-travel.mp4';

// Fonction pour obtenir l'URL de l'image (identique aux autres composants)
const getImageUrl = (path: string | null): string => {
  if (!path) return '/images/placeholder-space.jpg';
  
  // Si c'est déjà une URL complète
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Si le chemin commence par /uploads/
  if (path.startsWith('/uploads/')) {
    const baseUrl = import.meta.env.VITE_API_URL 
      ? import.meta.env.VITE_API_URL.replace('/api', '') 
      : 'http://localhost:8000';
    return `${baseUrl}${path}`;
  }
  
  // Si le chemin commence par /storage/
  if (path.startsWith('/storage/')) {
    const baseUrl = import.meta.env.VITE_API_URL 
      ? import.meta.env.VITE_API_URL.replace('/api', '') 
      : 'http://localhost:8000';
    return `${baseUrl}${path}`;
  }
  
  // Si le chemin commence par storage/ (sans slash)
  if (path.startsWith('storage/')) {
    const baseUrl = import.meta.env.VITE_API_URL 
      ? import.meta.env.VITE_API_URL.replace('/api', '') 
      : 'http://localhost:8000';
    return `${baseUrl}/${path}`;
  }
  
  // Construction de l'URL pour les images locales
  const baseUrl = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace('/api', '') 
    : 'http://localhost:8000';
  
  // Si le chemin commence par spaces/
  if (path.startsWith('spaces/')) {
    return `${baseUrl}/storage/${path}`;
  }
  
  return `${baseUrl}/storage/${path}`;
};

export function HeroSection() {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Overlay sombre */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60 z-10" />
      
      {/* Vidéo en arrière-plan */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        poster={getImageUrl('https://images.unsplash.com/photo-1672841828478-2fad29c8fa25?w=1920')}
      >
        <source src={bgVideo} type="video/mp4" />
        {/* Fallback image si la vidéo ne se charge pas */}
        <img
          src={getImageUrl('https://images.unsplash.com/photo-1672841828478-2fad29c8fa25?w=1920')}
          alt="Hero background"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </video>

      {/* Contenu */}
      <div className="relative z-20 max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 animate-fade-in">
          Trouvez votre <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            logement idéal
          </span>
        </h1>
        
        <p className="text-white/80 text-base sm:text-lg md:text-xl mb-8 md:mb-10 max-w-2xl mx-auto animate-fade-in-up">
          Des milliers de logements dans le monde entier. Réservez en toute confiance.
        </p>

        <div className="max-w-4xl mx-auto animate-fade-in-up animation-delay-200">
          <SearchBar />
        </div>

        {/* Statistiques */}
        <div className="mt-12 grid grid-cols-3 gap-8 max-w-lg mx-auto">
          <div className="text-white">
            <p className="text-3xl font-bold">10k+</p>
            <p className="text-white/60 text-sm">Logements</p>
          </div>
          <div className="text-white">
            <p className="text-3xl font-bold">4.9★</p>
            <p className="text-white/60 text-sm">Note moyenne</p>
          </div>
          <div className="text-white">
            <p className="text-3xl font-bold">24/7</p>
            <p className="text-white/60 text-sm">Support</p>
          </div>
        </div>

        {/* Indicateur de scroll */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-20">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-scroll-indicator" />
          </div>
        </div>
      </div>
    </section>
  );
}
// components/home/HeroSection.tsx
import { SearchBar } from '../SearchBar';

export function HeroSection() {
  return (
    <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30 z-10" />
      <img
        src="https://images.unsplash.com/photo-1672841828478-2fad29c8fa25?w=1920"
        alt="Hero"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="relative z-20 max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-white text-5xl md:text-6xl font-bold mb-6">
          Trouvez votre logement idéal
        </h1>
        <p className="text-white/90 text-xl mb-10">
          Des milliers de logements dans le monde entier. Réservez en toute confiance.
        </p>

        <div className="max-w-4xl mx-auto">
          <SearchBar />
        </div>
      </div>
    </section>
  );
}
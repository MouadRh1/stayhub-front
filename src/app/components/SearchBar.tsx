// components/SearchBar.tsx
import { Search, MapPin, Calendar, Users, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { format } from 'date-fns';

interface SearchBarProps {
  initialValue?: string;
  onSearch?: (value: string) => void;
  compact?: boolean;
}

export function SearchBar({ initialValue = '', onSearch, compact = false }: SearchBarProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [destination, setDestination] = useState(initialValue || searchParams.get('destination') || '');
  const [checkIn, setCheckIn] = useState(searchParams.get('checkIn') || '');
  const [checkOut, setCheckOut] = useState(searchParams.get('checkOut') || '');
  const [guests, setGuests] = useState(searchParams.get('guests') || '2');
  const [isFocused, setIsFocused] = useState(false);

  // Mettre à jour destination quand initialValue change
  useEffect(() => {
    if (initialValue) {
      setDestination(initialValue);
    }
  }, [initialValue]);

  // Récupérer les paramètres depuis l'URL
  useEffect(() => {
    const dest = searchParams.get('destination');
    const ci = searchParams.get('checkIn');
    const co = searchParams.get('checkOut');
    const g = searchParams.get('guests');
    
    if (dest) setDestination(dest);
    if (ci) setCheckIn(ci);
    if (co) setCheckOut(co);
    if (g) setGuests(g);
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (onSearch) {
      onSearch(destination);
    } else {
      const urlParams = new URLSearchParams();
      if (destination) urlParams.set('destination', destination);
      if (checkIn) urlParams.set('checkIn', checkIn);
      if (checkOut) urlParams.set('checkOut', checkOut);
      if (guests && parseInt(guests) > 0) urlParams.set('guests', guests);
      navigate(`/search?${urlParams.toString()}`);
    }
  };

  const clearFilters = () => {
    setDestination('');
    setCheckIn('');
    setCheckOut('');
    setGuests('2');
  };

  const today = format(new Date(), 'yyyy-MM-dd');
  const minCheckOut = checkIn || today;

  if (compact) {
    return (
      <form onSubmit={handleSearch} className="w-full">
        <div className="flex items-center gap-2 bg-card rounded-xl border border-border p-2 shadow-lg">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher une destination..."
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-transparent border-none outline-none text-sm"
            />
          </div>
          {destination && (
            <button
              type="button"
              onClick={() => setDestination('')}
              className="p-1 rounded-full hover:bg-accent transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-colors whitespace-nowrap"
          >
            Rechercher
          </button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className={`bg-card rounded-2xl shadow-2xl border border-border p-2 grid grid-cols-1 md:grid-cols-4 gap-2 transition-all duration-300 ${
        isFocused ? 'ring-2 ring-blue-500/50 shadow-2xl' : ''
      }`}>
        {/* Destination */}
        <div className="relative px-4 py-3 rounded-xl hover:bg-accent/50 transition-colors group">
          <label className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <MapPin className="w-4 h-4" />
            Destination
          </label>
          <input
            type="text"
            placeholder="Où allez-vous ?"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
          />
          {destination && (
            <button
              type="button"
              onClick={() => setDestination('')}
              className="absolute right-4 top-1/2 translate-y-1/2 p-1 rounded-full hover:bg-accent transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Check-in */}
        <div className="px-4 py-3 rounded-xl hover:bg-accent/50 transition-colors">
          <label className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Calendar className="w-4 h-4" />
            Arrivée
          </label>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            min={today}
            className="w-full bg-transparent border-none outline-none text-foreground cursor-pointer"
          />
        </div>

        {/* Check-out */}
        <div className="px-4 py-3 rounded-xl hover:bg-accent/50 transition-colors">
          <label className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Calendar className="w-4 h-4" />
            Départ
          </label>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            min={minCheckOut}
            className="w-full bg-transparent border-none outline-none text-foreground cursor-pointer"
          />
        </div>

        {/* Guests & Submit */}
        <div className="flex items-center gap-2">
          <div className="flex-1 px-4 py-3 rounded-xl hover:bg-accent/50 transition-colors">
            <label className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Users className="w-4 h-4" />
              Voyageurs
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-foreground"
            />
          </div>

          <button
            type="submit"
            className="h-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all flex items-center justify-center gap-2 shrink-0 min-h-[56px]"
          >
            <Search className="w-5 h-5" />
            <span className="hidden lg:inline">Rechercher</span>
          </button>
        </div>
      </div>

      {/* Filtres actifs */}
      {(destination || checkIn || checkOut || (guests && parseInt(guests) > 0)) && (
        <div className="flex flex-wrap items-center gap-2 mt-3">
          <span className="text-sm text-muted-foreground">Filtres actifs :</span>
          {destination && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm">
              <MapPin className="w-3 h-3" />
              {destination}
              <button
                type="button"
                onClick={() => setDestination('')}
                className="hover:text-blue-900 dark:hover:text-blue-100"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {checkIn && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm">
              <Calendar className="w-3 h-3" />
              {format(new Date(checkIn), 'dd/MM/yyyy')}
              <button
                type="button"
                onClick={() => setCheckIn('')}
                className="hover:text-green-900 dark:hover:text-green-100"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {checkOut && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm">
              <Calendar className="w-3 h-3" />
              {format(new Date(checkOut), 'dd/MM/yyyy')}
              <button
                type="button"
                onClick={() => setCheckOut('')}
                className="hover:text-green-900 dark:hover:text-green-100"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {guests && parseInt(guests) > 0 && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm">
              <Users className="w-3 h-3" />
              {guests} voyageur{parseInt(guests) > 1 ? 's' : ''}
              <button
                type="button"
                onClick={() => setGuests('2')}
                className="hover:text-purple-900 dark:hover:text-purple-100"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          <button
            type="button"
            onClick={clearFilters}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors underline"
          >
            Tout effacer
          </button>
        </div>
      )}
    </form>
  );
}
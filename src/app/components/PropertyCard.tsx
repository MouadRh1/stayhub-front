// components/PropertyCard.tsx

import { Star, MapPin } from 'lucide-react';
import { Link } from 'react-router';

interface PropertyCardProps {
  id: string;
  image: string;
  title: string;
  location: string;
  price: number;
  rating: number;
  reviews: number;
  type: string;
}

export function PropertyCard({ id, image, title, location, price, rating, reviews, type }: PropertyCardProps) {
  return (
    <Link to={`/space/${id}`} className="group">
      <div className="bg-card rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-shadow">
        <div className="relative h-48 overflow-hidden">
          <img
            src={image || 'https://via.placeholder.com/400x300?text=No+Image'}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 bg-black/70 text-white text-xs rounded-full">
              {type}
            </span>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-lg mb-1 line-clamp-1">{title}</h3>
          
          <div className="flex items-center gap-1 text-muted-foreground text-sm mb-2">
            <MapPin className="w-4 h-4" />
            <span>{location}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{rating.toFixed(1)}</span>
              </div>
              <span className="text-muted-foreground text-sm">({reviews})</span>
            </div>

            <div>
              <span className="font-bold text-lg">{price}€</span>
              <span className="text-muted-foreground text-sm">/nuit</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
// components/home/TestimonialsSection.tsx
import { useState, useEffect } from 'react';
import { Star, Loader2 } from 'lucide-react';

interface Testimonial {
  name: string;
  avatar: string;
  rating: number;
  comment: string;
  location: string;
}

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    name: 'Marie Laurent',
    avatar: 'ML',
    rating: 5,
    comment: 'Une expérience exceptionnelle ! La réservation était simple et le logement correspondait parfaitement aux photos.',
    location: 'Paris, France'
  },
  {
    name: 'Thomas Dubois',
    avatar: 'TD',
    rating: 5,
    comment: 'Service client réactif et logements de qualité. Je recommande vivement cette plateforme.',
    location: 'Lyon, France'
  },
  {
    name: 'Sophie Martin',
    avatar: 'SM',
    rating: 5,
    comment: 'Meilleure plateforme de réservation que j\'ai utilisée. Interface intuitive et choix incroyable.',
    location: 'Marseille, France'
  }
];

export function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(DEFAULT_TESTIMONIALS);
  const [loading, setLoading] = useState(false);

  // Si vous voulez charger depuis l'API, décommentez ceci
  // useEffect(() => {
  //   fetchTestimonials();
  // }, []);

  // const fetchTestimonials = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await api.get('/testimonials');
  //     setTestimonials(response.data);
  //   } catch (error) {
  //     console.error('Erreur:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-center py-12">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-2">Ce Que Disent Nos Clients</h2>
        <p className="text-muted-foreground">Des milliers de voyageurs satisfaits</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="bg-card rounded-2xl p-6 border border-border hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                {testimonial.avatar}
              </div>
              <div>
                <h4 className="font-semibold">{testimonial.name}</h4>
                <p className="text-sm text-muted-foreground">{testimonial.location}</p>
              </div>
            </div>

            <div className="flex gap-1 mb-3">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>

            <p className="text-muted-foreground">{testimonial.comment}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
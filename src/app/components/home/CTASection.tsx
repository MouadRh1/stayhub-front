// components/home/CTASection.tsx
import { Link } from 'react-router';

export function CTASection() {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-white text-4xl font-bold mb-4">Prêt à Commencer Votre Aventure ?</h2>
        <p className="text-white/90 text-lg mb-8">
          Rejoignez des millions de voyageurs qui font confiance à StayHub
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/search"
            className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl"
          >
            Trouver un logement
          </Link>
          <Link
            to="/dashboard/owner"
            className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-semibold hover:bg-white/10 transition-colors"
          >
            Devenir hôte
          </Link>
        </div>
      </div>
    </section>
  );
}
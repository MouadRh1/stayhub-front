// components/home/FeaturesSection.tsx
import { Shield, Award, HeadphonesIcon, TrendingUp } from 'lucide-react';

interface Feature {
  icon: any;
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    icon: Shield,
    title: 'Paiement Sécurisé',
    description: 'Vos transactions sont protégées avec un cryptage de niveau bancaire'
  },
  {
    icon: Award,
    title: 'Qualité Garantie',
    description: 'Tous nos logements sont vérifiés et certifiés par notre équipe'
  },
  {
    icon: HeadphonesIcon,
    title: 'Support 24/7',
    description: 'Notre équipe est disponible à tout moment pour vous aider'
  },
  {
    icon: TrendingUp,
    title: 'Meilleurs Prix',
    description: 'Garantie du meilleur prix ou remboursement de la différence'
  }
];

export function FeaturesSection() {
  return (
    <section className="bg-muted/30 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Pourquoi Choisir StayHub ?</h2>
          <p className="text-muted-foreground">Une expérience de réservation exceptionnelle</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {FEATURES.map((feature, index) => (
            <div key={index} className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
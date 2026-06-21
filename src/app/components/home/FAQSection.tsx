// components/home/FAQSection.tsx
import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

interface FAQ {
  question: string;
  answer: string;
}

const FAQ_DATA: FAQ[] = [
  {
    question: 'Comment réserver un logement sur StayHub ?',
    answer: 'Recherchez votre destination, sélectionnez vos dates et le nombre de voyageurs. Parcourez les résultats, choisissez votre logement idéal et cliquez sur "Réserver". Vous recevrez une confirmation instantanée par email.'
  },
  {
    question: 'Quelle est la politique d\'annulation ?',
    answer: 'La politique d\'annulation varie selon les propriétaires. Vous trouverez les détails sur la page de chaque logement. Généralement, une annulation gratuite est possible jusqu\'à 48h avant l\'arrivée.'
  },
  {
    question: 'Comment devenir hôte sur StayHub ?',
    answer: 'Cliquez sur "Devenir hôte" dans le menu principal, créez votre annonce en ajoutant photos et descriptions, définissez vos tarifs et disponibilités. Notre équipe vérifiera votre annonce sous 24h.'
  },
  {
    question: 'Les paiements sont-ils sécurisés ?',
    answer: 'Oui, tous les paiements sont sécurisés avec un cryptage de niveau bancaire. Nous utilisons les protocoles de sécurité les plus avancés pour protéger vos données financières.'
  },
  {
    question: 'Que faire en cas de problème pendant mon séjour ?',
    answer: 'Notre support client est disponible 24/7. Contactez-nous via le chat en ligne, par email ou téléphone. Nous résolvons 95% des problèmes en moins de 2 heures.'
  },
  {
    question: 'Y a-t-il des frais de service ?',
    answer: 'Oui, des frais de service de 10% sont appliqués sur chaque réservation. Ces frais couvrent le support client 24/7, l\'assurance et la maintenance de la plateforme.'
  }
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-2">Questions Fréquentes</h2>
        <p className="text-muted-foreground">Tout ce que vous devez savoir sur StayHub</p>
      </div>

      <div className="space-y-4">
        {FAQ_DATA.map((faq, index) => (
          <div key={index} className="bg-card rounded-2xl border border-border overflow-hidden transition-all">
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex items-center justify-between p-6 text-left hover:bg-accent/50 transition-colors"
            >
              <h3 className="font-semibold pr-4">{faq.question}</h3>
              {openIndex === index ? (
                <Minus className="w-5 h-5 shrink-0 text-blue-600" />
              ) : (
                <Plus className="w-5 h-5 shrink-0 text-muted-foreground" />
              )}
            </button>
            {openIndex === index && (
              <div className="px-6 pb-6 animate-in slide-in-from-top duration-200">
                <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
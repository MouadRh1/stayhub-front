import { Link } from 'react-router';
import { Home, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/30 border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-xl">StayHub</span>
            </Link>
            <p className="text-muted-foreground text-sm mb-4">
              Trouvez votre logement idéal partout dans le monde
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-full bg-accent hover:bg-accent/80 flex items-center justify-center transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-accent hover:bg-accent/80 flex items-center justify-center transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-accent hover:bg-accent/80 flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-accent hover:bg-accent/80 flex items-center justify-center transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Entreprise</h3>
            <ul className="space-y-2">
              <li><Link to="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">À propos</Link></li>
              <li><Link to="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Carrières</Link></li>
              <li><Link to="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Presse</Link></li>
              <li><Link to="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Blog</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link to="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Centre d'aide</Link></li>
              <li><Link to="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Contact</Link></li>
              <li><Link to="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Politique d'annulation</Link></li>
              <li><Link to="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Sécurité</Link></li>
            </ul>
          </div>

          {/* Hosting */}
          <div>
            <h3 className="font-semibold mb-4">Hébergement</h3>
            <ul className="space-y-2">
              <li><Link to="/dashboard/owner" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Devenir hôte</Link></li>
              <li><Link to="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Guide d'hébergement</Link></li>
              <li><Link to="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Assurance</Link></li>
              <li><Link to="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Ressources</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © {currentYear} StayHub. Tous droits réservés.
          </p>
          <div className="flex gap-6">
            <Link to="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
              Conditions d'utilisation
            </Link>
            <Link to="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
              Confidentialité
            </Link>
            <Link to="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
              Plan du site
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

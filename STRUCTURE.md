# 📁 Structure du Projet StayHub

```
/workspaces/default/code/
├── 📄 package.json                 # Dépendances et scripts
├── 📄 PLATEFORME.md               # Documentation complète
├── 📄 STRUCTURE.md                # Ce fichier
├── 📁 src/
│   ├── 📁 app/
│   │   ├── 📄 App.tsx             # Composant racine avec RouterProvider
│   │   ├── 📄 routes.tsx          # Configuration React Router
│   │   │
│   │   ├── 📁 components/         # Composants réutilisables
│   │   │   ├── 📄 Navbar.tsx                  # Navigation principale + auth modal
│   │   │   ├── 📄 Footer.tsx                  # Footer avec liens
│   │   │   ├── 📄 SearchBar.tsx               # Barre de recherche avancée
│   │   │   ├── 📄 PropertyCard.tsx            # Card de logement
│   │   │   ├── 📄 ImageWithFallback.tsx       # Image avec fallback
│   │   │   ├── 📄 AuthModal.tsx               # Modal login/register
│   │   │   ├── 📄 LoadingSpinner.tsx          # Spinner de chargement
│   │   │   ├── 📄 StatCard.tsx                # Card de statistique
│   │   │   ├── 📄 Badge.tsx                   # Badge avec variants
│   │   │   └── 📁 ui/                         # Composants UI shadcn
│   │   │
│   │   ├── 📁 contexts/           # Contextes React
│   │   │   └── 📄 ThemeContext.tsx            # Gestion du thème dark/light
│   │   │
│   │   ├── 📁 layouts/            # Layouts de pages
│   │   │   └── 📄 RootLayout.tsx              # Layout principal (navbar + outlet + footer)
│   │   │
│   │   └── 📁 pages/              # Pages de l'application
│   │       ├── 📄 HomePage.tsx                # Page d'accueil
│   │       ├── 📄 SearchPage.tsx              # Page de recherche
│   │       ├── 📄 PropertyDetailPage.tsx      # Détail d'un logement
│   │       ├── 📄 UserDashboard.tsx           # Dashboard utilisateur
│   │       ├── 📄 OwnerDashboard.tsx          # Dashboard propriétaire
│   │       ├── 📄 AdminDashboard.tsx          # Dashboard administrateur
│   │       └── 📄 NotFoundPage.tsx            # Page 404
│   │
│   └── 📁 styles/                 # Feuilles de style
│       ├── 📄 index.css                       # Point d'entrée CSS
│       ├── 📄 theme.css                       # Variables de thème
│       ├── 📄 animations.css                  # Animations personnalisées
│       └── 📄 fonts.css                       # Imports de polices
│
└── 📁 node_modules/               # Dépendances installées

```

---

## 🗺️ Routes de l'Application

| Route | Composant | Description |
|-------|-----------|-------------|
| `/` | `HomePage` | Page d'accueil avec hero, recherche, logements |
| `/search` | `SearchPage` | Recherche avec filtres et carte |
| `/property/:id` | `PropertyDetailPage` | Détails d'un logement spécifique |
| `/dashboard/user` | `UserDashboard` | Espace utilisateur (réservations, favoris) |
| `/dashboard/owner` | `OwnerDashboard` | Espace propriétaire (gestion logements) |
| `/dashboard/admin` | `AdminDashboard` | Espace admin (analytics, modération) |
| `*` | `NotFoundPage` | Page 404 pour routes inexistantes |

---

## 🧩 Hiérarchie des Composants

### HomePage
```
HomePage
├── Navbar
│   ├── AuthModal
│   └── ThemeToggle
├── HeroSection
│   └── SearchBar
├── PopularProperties
│   └── PropertyCard × 4
├── TrendingDestinations
├── Features
├── Testimonials
├── FAQSection
├── CTASection
└── Footer
```

### SearchPage
```
SearchPage
├── Navbar
├── StickySearchBar
├── FiltersBar
│   └── AdvancedFilters (collapsible)
├── ViewToggle (grid/list)
├── ResultsGrid/List
│   └── PropertyCard × 8
├── MapView (optional)
├── Pagination
└── Footer
```

### PropertyDetailPage
```
PropertyDetailPage
├── Navbar
├── BackNavigation
├── ImageGallery
│   ├── MainImage
│   └── ThumbnailGrid × 4
├── PropertyInfo
│   ├── HostInfo
│   ├── Description
│   ├── Amenities
│   └── Reviews
├── BookingCard (sticky)
│   ├── DatePicker
│   ├── GuestsSelector
│   ├── PriceCalculator
│   └── BookButton
├── LocationMap
└── Footer
```

### UserDashboard
```
UserDashboard
├── Navbar
├── Sidebar
│   ├── UserProfile
│   └── NavigationTabs
└── MainContent
    ├── BookingsTab
    │   └── BookingCard × N
    ├── FavoritesTab
    │   └── PropertyCard × N
    ├── ProfileTab
    │   └── ProfileForm
    └── SettingsTab
        ├── NotificationSettings
        ├── PrivacySettings
        └── SecuritySettings
```

### OwnerDashboard
```
OwnerDashboard
├── Navbar
├── HeaderWithCTA
├── TabNavigation
└── TabContent
    ├── OverviewTab
    │   ├── StatCard × 4
    │   ├── RevenueChart
    │   ├── BookingsChart
    │   └── ActivityFeed
    ├── PropertiesTab
    │   └── PropertyManagementCard × N
    ├── BookingsTab
    │   └── BookingsList
    └── RevenueTab
        ├── RevenueSummary
        └── RevenueChart
```

### AdminDashboard
```
AdminDashboard
├── Navbar
├── HeaderWithActions
├── TabNavigation
└── TabContent
    ├── OverviewTab
    │   ├── StatCard × 4
    │   ├── GrowthChart
    │   ├── PieChart
    │   └── AlertsSection
    ├── UsersTab
    │   └── UsersTable
    ├── PropertiesTab
    │   └── PropertiesTable
    └── AnalyticsTab
        ├── RevenueChart
        ├── BookingsChart
        └── KPICards
```

---

## 🎨 Composants par Catégorie

### Navigation & Layout (4)
- `Navbar` - Navigation principale
- `Footer` - Pied de page
- `RootLayout` - Wrapper de base
- `Sidebar` - Navigation latérale (dashboards)

### Cartes & Affichage (4)
- `PropertyCard` - Affichage logement
- `StatCard` - Carte de statistique
- `BookingCard` - Carte de réservation
- `ReviewCard` - Carte d'avis

### Formulaires & Inputs (3)
- `SearchBar` - Recherche avancée
- `AuthModal` - Login/Register
- `DatePicker` - Sélection de dates

### Feedback & État (3)
- `LoadingSpinner` - Chargement
- `Badge` - Badges de statut
- `Alert` - Messages d'alerte

### Médias (1)
- `ImageWithFallback` - Images avec fallback

### Graphiques (via Recharts) (3)
- `LineChart` - Graphique en ligne
- `BarChart` - Graphique en barres
- `PieChart` - Graphique circulaire

---

## 📦 Dépendances Principales

### Core
- `react` 18.3.1 - Bibliothèque UI
- `react-dom` 18.3.1 - Rendu DOM
- `react-router` 7.13.0 - Routing

### Styling
- `tailwindcss` 4.1.12 - Framework CSS
- `@tailwindcss/vite` 4.1.12 - Plugin Vite
- `class-variance-authority` - Variants CSS
- `clsx` - Utilitaire classes
- `tailwind-merge` - Merge classes

### UI Components
- `@radix-ui/*` - Composants UI primitives
- `lucide-react` 0.487.0 - Icônes
- `motion` 12.23.24 - Animations

### Charts & Data
- `recharts` 2.15.2 - Graphiques
- `date-fns` 3.6.0 - Manipulation dates

### Forms
- `react-hook-form` 7.55.0 - Gestion formulaires
- `react-day-picker` - Sélecteur de dates

### Utilities
- `sonner` 2.0.3 - Toast notifications
- `next-themes` 0.4.6 - Thème dark/light

---

## 🔧 Configuration

### Tailwind Config
- Mode: JIT (Just-In-Time)
- Dark mode: class-based
- Thème personnalisé dans `theme.css`
- Variables CSS custom

### Vite Config
- React plugin
- Tailwind plugin
- Build optimisé

---

## 📊 Statistiques du Projet

- **Pages** : 7
- **Composants** : 15+ réutilisables
- **Routes** : 7
- **Contextes** : 1 (Theme)
- **Graphiques** : 6+
- **Animations** : 10+ custom
- **Lignes de code** : ~4000+
- **Fichiers** : 25+

---

## 🎯 Points Clés d'Architecture

### Séparation des Responsabilités
- **Pages** : Logique métier et composition
- **Components** : Réutilisables et agnostiques
- **Layouts** : Structure commune
- **Contexts** : État global

### Atomic Design Partiel
- **Atoms** : Badge, Button, Input
- **Molecules** : SearchBar, StatCard
- **Organisms** : Navbar, Footer
- **Templates** : RootLayout
- **Pages** : HomePage, SearchPage, etc.

### Performance
- Lazy loading des images
- Code splitting par route
- Memoization des composants lourds
- Optimisation des re-renders

### Accessibilité
- ARIA labels
- Navigation au clavier
- Contraste respecté
- Focus visible

---

## 🚀 Évolution de la Structure

### V1.0 (Actuel)
- Structure de base
- Pages principales
- Composants essentiels

### V1.1 (Futur)
```
src/
├── app/
├── lib/           # Utilitaires et helpers
├── hooks/         # Custom hooks
├── types/         # Types TypeScript
├── constants/     # Constantes
└── utils/         # Fonctions utilitaires
```

### V2.0 (Vision)
```
src/
├── features/      # Feature-based architecture
│   ├── auth/
│   ├── booking/
│   ├── search/
│   └── property/
├── shared/        # Code partagé
└── core/          # Core business logic
```

---

**Dernière mise à jour** : Juin 2026
**Version** : 1.0.0

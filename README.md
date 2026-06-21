# 🏠 StayHub - Plateforme de Réservation de Logements

<div align="center">

![StayHub Banner](https://images.unsplash.com/photo-1672841828478-2fad29c8fa25?w=1200&h=300&fit=crop)

**Une plateforme moderne de réservation de logements inspirée d'Airbnb, Booking et Expedia**

[![React](https://img.shields.io/badge/React-18.3.1-blue?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.12-38bdf8?logo=tailwind-css)](https://tailwindcss.com)
[![React Router](https://img.shields.io/badge/React_Router-7.13-red?logo=react-router)](https://reactrouter.com)

[Démo Live](#) • [Documentation](./PLATEFORME.md) • [Guide Rapide](./QUICKSTART.md) • [Structure](./STRUCTURE.md)

</div>

---

## ✨ Aperçu

StayHub est une plateforme complète de réservation de logements avec un design **premium et professionnel** pour 2026. Elle offre une expérience utilisateur **haut de gamme** comparable aux leaders du marché, tout en proposant des fonctionnalités avancées pour **utilisateurs**, **propriétaires** et **administrateurs**.

### 🎯 Caractéristiques Principales

- 🎨 **Design Premium** - Interface moderne, minimaliste et élégante
- 🌓 **Mode Sombre** - Thème clair/sombre avec persistance
- 📱 **100% Responsive** - Desktop, Tablet, Mobile
- ⚡ **Performances** - Optimisé pour la vitesse
- 🎭 **Animations** - Micro-interactions fluides
- 📊 **Analytics** - Tableaux de bord avec graphiques
- 🔐 **Multi-rôles** - Utilisateur, Propriétaire, Admin
- 🔍 **Recherche Avancée** - Filtres puissants

---

## 📸 Captures d'Écran

### Page d'Accueil
> Hero immersif, barre de recherche avancée, logements populaires, destinations tendances

### Page Recherche
> Filtres avancés, vue grille/liste, carte interactive, 8+ logements

### Détail Logement
> Galerie photos, description, équipements, avis, réservation sticky

### Dashboards
> Utilisateur (4 onglets), Propriétaire (5 onglets), Admin (5 onglets) avec graphiques

---

## 🚀 Démarrage Rapide

### Prérequis

Aucun prérequis ! La plateforme est déjà configurée dans **Figma Make**.

### Navigation

```
🏠 Page d'Accueil       → /
🔍 Recherche            → /search
🏡 Détail Logement      → /property/:id
👤 Dashboard User       → /dashboard/user
🏘️ Dashboard Owner      → /dashboard/owner
👨‍💼 Dashboard Admin      → /dashboard/admin
```

### Guide Complet

📖 Consultez [QUICKSTART.md](./QUICKSTART.md) pour un guide détaillé de toutes les fonctionnalités.

---

## 🎨 Design System

### Palette de Couleurs

#### Light Mode
```css
--background: #ffffff
--foreground: oklch(0.145 0 0)
--primary: #030213
--accent: linear-gradient(#3b82f6 → #8b5cf6)
```

#### Dark Mode
```css
--background: oklch(0.145 0 0)
--foreground: oklch(0.985 0 0)
--primary: oklch(0.985 0 0)
```

### Typographie
- **Police** : Système (SF Pro, Segoe UI, Roboto)
- **Échelle** : 14px → 60px
- **Poids** : 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

### Composants
- **Coins arrondis** : 10px (rounded-xl), 16px (rounded-2xl)
- **Ombres** : Douces et subtiles
- **Spacing** : Scale Tailwind (4px, 8px, 16px, 24px, 32px...)

---

## 📁 Structure du Projet

```
src/
├── app/
│   ├── components/      # Composants réutilisables
│   ├── contexts/        # Contextes React
│   ├── layouts/         # Layouts de pages
│   ├── pages/           # Pages de l'application
│   ├── App.tsx          # Composant racine
│   └── routes.tsx       # Configuration routing
└── styles/              # Feuilles de style
    ├── theme.css        # Variables de thème
    ├── animations.css   # Animations custom
    └── index.css        # Point d'entrée CSS
```

📖 Voir [STRUCTURE.md](./STRUCTURE.md) pour l'arborescence complète.

---

## 🧩 Pages & Fonctionnalités

### 🏠 Page d'Accueil
- Hero section immersive
- Barre de recherche avancée (destination, dates, voyageurs)
- 4 logements populaires
- 4 destinations tendances
- 4 avantages de la plateforme
- 3 témoignages clients
- FAQ interactive (6 questions)
- Call-to-action section
- Footer complet

### 🔍 Page Recherche
- Barre de recherche sticky
- Filtres avancés (type, prix, équipements)
- Toggle vue grille/liste
- Carte interactive (optionnel)
- 8 logements par page
- Pagination moderne

### 🏡 Page Détail Logement
- Galerie 5 photos avec navigation
- Informations hôte
- Description détaillée
- 8 équipements avec icônes
- Carte de localisation
- 3 avis clients
- **Card réservation sticky** :
  - Sélection dates
  - Nombre de voyageurs
  - Calcul prix automatique
  - Bouton réserver

### 👤 Dashboard Utilisateur
**4 onglets :**
1. Mes Réservations (confirmées, en attente, terminées)
2. Favoris (logements sauvegardés)
3. Profil (infos personnelles)
4. Paramètres (notifications, confidentialité, sécurité)

### 🏘️ Dashboard Propriétaire
**5 onglets :**
1. Vue d'ensemble (stats + graphiques)
2. Mes Logements (gestion complète)
3. Réservations reçues
4. Messages
5. Revenus (analytics détaillé)

### 👨‍💼 Dashboard Administrateur
**5 onglets :**
1. Vue d'ensemble (KPIs + alertes)
2. Utilisateurs (tableau complet)
3. Logements (validation)
4. Réservations globales
5. Analytique (graphiques avancés)

---

## 🛠️ Technologies

### Core
- **React** 18.3.1 - Bibliothèque UI
- **TypeScript** - Typage statique
- **React Router** 7.13.0 - Routing (Data mode)
- **Vite** 6.3.5 - Build tool

### Styling
- **Tailwind CSS** 4.1.12 - Framework CSS
- **CVA** - Class Variance Authority
- **Tailwind Merge** - Merge classes

### UI Components
- **Radix UI** - Primitives accessibles
- **Lucide React** - Icônes modernes
- **Motion** - Animations

### Data & Charts
- **Recharts** - Graphiques interactifs
- **Date-fns** - Manipulation dates
- **React Hook Form** - Gestion formulaires

### Utilities
- **Sonner** - Toast notifications
- **Next Themes** - Thème dark/light

---

## 📊 Statistiques

- **7 pages** complètes
- **15+ composants** réutilisables
- **7 routes** configurées
- **6+ graphiques** interactifs
- **10+ animations** custom
- **~4000 lignes** de code
- **25+ fichiers** TypeScript/TSX

---

## 🎯 Fonctionnalités Avancées

### Authentification
- Modal login/register
- Social auth (Google, Facebook)
- Mot de passe masqué/visible
- Validation formulaires

### Recherche & Filtres
- Recherche multi-critères
- Filtres type, prix, équipements
- Vue grille/liste toggle
- Carte interactive
- Pagination

### Réservation
- Sélection dates (date picker)
- Calcul prix automatique
- Frais de service inclus
- Card sticky qui suit le scroll

### Multi-rôles
- **Utilisateur** : réservations, favoris
- **Propriétaire** : gestion logements, revenus
- **Admin** : modération, analytics

### Dark Mode
- Toggle dans navbar
- Persistance localStorage
- Transitions fluides
- Variables CSS

---

## 🎨 Expérience Utilisateur

### Design Principles
- **Clarté** - Interface intuitive
- **Cohérence** - Design system unifié
- **Feedback** - Réactions visuelles
- **Performance** - Chargement rapide
- **Accessibilité** - Pour tous

### Micro-interactions
- Hover effects sur cartes
- Transitions fluides
- Loading states
- Animations entrée/sortie
- Focus visibles

### Responsive
- **Mobile** : < 768px
- **Tablet** : 768px - 1024px
- **Desktop** : > 1024px

---

## 📚 Documentation

- 📖 [**PLATEFORME.md**](./PLATEFORME.md) - Documentation exhaustive
- 🚀 [**QUICKSTART.md**](./QUICKSTART.md) - Guide de démarrage
- 📁 [**STRUCTURE.md**](./STRUCTURE.md) - Architecture du projet

---

## 🔮 Roadmap

### Version 1.1
- [ ] Système de paiement (Stripe)
- [ ] Messagerie temps réel
- [ ] Notifications push
- [ ] Calendrier interactif

### Version 2.0
- [ ] Carte Mapbox interactive
- [ ] Multi-langue (i18n)
- [ ] PWA (Progressive Web App)
- [ ] Export PDF réservations

### Version 3.0
- [ ] Programme de fidélité
- [ ] Système de parrainage
- [ ] Chat support temps réel
- [ ] API publique

---

## 🤝 Contribution

Ce projet est un exemple de design UI/UX créé dans **Figma Make**. 

Pour toute suggestion ou amélioration :
1. Consultez la documentation
2. Testez les fonctionnalités
3. Proposez des améliorations

---

## 📄 Licence

Ce projet est un exemple de démonstration créé avec Figma Make.

---

## 👨‍💻 Développement

### Commandes (si exécuté hors Figma Make)

```bash
# Installation
pnpm install

# Développement
pnpm dev

# Build (Note: ne fonctionne pas dans Figma Make)
pnpm build
```

**Note** : Dans Figma Make, l'application est automatiquement en mode développement.

---

## 🙏 Remerciements

- **Unsplash** - Images haute qualité
- **Lucide** - Icônes modernes
- **Radix UI** - Composants accessibles
- **Recharts** - Graphiques interactifs
- **Tailwind CSS** - Framework CSS

---

## 📞 Support

Pour toute question :
- 📖 Consultez la [documentation](./PLATEFORME.md)
- 🚀 Suivez le [guide rapide](./QUICKSTART.md)
- 📁 Explorez la [structure](./STRUCTURE.md)

---

<div align="center">

**Développé avec ❤️ par Claude Code**

*Version 1.0.0 - Juin 2026*

🏠 **StayHub** - Votre prochaine destination commence ici

</div>

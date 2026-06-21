# StayHub - Plateforme de Réservation de Logements

## 🎨 Design & UX

### Style Visuel
- **Design Premium & Professionnel** avec interface moderne 2026
- **Minimaliste et Élégant** pour une expérience haut de gamme
- **Responsive** : Desktop, Tablet et Mobile
- **Palette de couleurs** : Blanc, noir, gris avec accents bleu-violet
- **Typographie** : Moderne et lisible avec hiérarchie claire
- **Effets visuels** : Ombres douces, coins arrondis, transitions fluides
- **Mode sombre** avec persistance localStorage

---

## 📄 Pages de la Plateforme

### 🏠 Page d'Accueil (`/`)
**Sections principales :**
- **Navbar fixe** avec logo, recherche, connexion/inscription (modal)
- **Hero immersif** avec image de voyage haute qualité
- **Barre de recherche avancée** (destination, dates, voyageurs)
- **Logements populaires** (4 cartes avec images, prix, notes)
- **Destinations tendances** (4 destinations avec nombre de logements)
- **Avantages** (4 features avec icônes)
- **Témoignages clients** (3 avis avec avatars et notes)
- **FAQ interactive** (6 questions avec accordéons)
- **Section CTA** avec boutons d'action
- **Footer complet** avec liens et réseaux sociaux

### 🔍 Page Recherche (`/search`)
**Fonctionnalités :**
- Barre de recherche sticky en haut
- Filtres avancés (type, prix, équipements)
- Boutons de filtrage rapide
- Vue grille/liste toggle
- Carte interactive (toggle)
- 8 logements affichés avec PropertyCard
- Pagination moderne
- Prix, note, localisation visibles

### 🏡 Page Détail Logement (`/property/:id`)
**Éléments clés :**
- Galerie photos interactive (5 images, navigation)
- Navigation retour aux résultats
- Informations hôte avec avatar
- Description détaillée du logement
- 8 équipements avec icônes
- 3 avis clients avec notes
- Carte de localisation
- **Card de réservation sticky** :
  - Prix par nuit
  - Sélection dates (arrivée/départ)
  - Nombre de voyageurs
  - Calcul du total
  - Bouton "Réserver maintenant"
- Boutons favoris et partage

### 👤 Dashboard Utilisateur (`/dashboard/user`)
**4 onglets avec navigation latérale :**

1. **Mes Réservations**
   - Liste des réservations (confirmées, en attente, terminées)
   - Informations : dates, prix, statut
   - Lien vers détails du logement

2. **Favoris**
   - Grille de logements sauvegardés
   - Cards PropertyCard réutilisables

3. **Profil**
   - Avatar avec upload
   - Formulaire : prénom, nom, email, téléphone, adresse
   - Bouton sauvegarder

4. **Paramètres**
   - Notifications (3 toggles)
   - Confidentialité (2 toggles)
   - Sécurité (3 options)
   - Zone danger (suppression compte)

### 🏘️ Dashboard Propriétaire (`/dashboard/owner`)
**5 onglets :**

1. **Vue d'ensemble**
   - 4 cards statistiques (revenus, réservations, occupation, note)
   - 2 graphiques (revenus + réservations mensuels)
   - Activité récente (4 événements)

2. **Mes Logements**
   - Grille de 3 logements avec :
     - Image, nom, localisation, statut
     - Stats : réservations, revenus, note
     - Actions : voir, modifier, supprimer

3. **Réservations**
   - Liste des réservations reçues
   - Statuts colorés (confirmée, en attente, terminée)
   - Dates et montants

4. **Messages**
   - Interface de messagerie (à développer)

5. **Revenus**
   - Total revenus et moyenne mensuelle
   - Graphique revenus historique
   - Prochain paiement

### 👨‍💼 Dashboard Administrateur (`/dashboard/admin`)
**5 onglets avec gestion complète :**

1. **Vue d'ensemble**
   - 4 stats cards colorées (utilisateurs, logements, réservations, revenus)
   - 2 graphiques (croissance + types de logements en pie chart)
   - Alertes système (3 types : warning, error, success)

2. **Utilisateurs**
   - Tableau complet avec :
     - Avatar, nom, email, rôle, statut
     - Date inscription
     - Actions : voir, modifier, supprimer

3. **Logements**
   - Tableau de gestion avec :
     - Nom, propriétaire, localisation, statut
     - Réservations et revenus
     - Validation (approuver/rejeter)

4. **Réservations**
   - Liste globale des réservations

5. **Analytique**
   - 2 graphiques (revenus + réservations)
   - 3 KPIs (conversion, panier moyen, satisfaction)

### ❌ Page 404 (`*`)
- Design élégant avec gradient "404"
- Message d'erreur clair
- Boutons : Retour accueil + Rechercher

---

## 🧩 Composants Réutilisables

### Navigation & Layout
- **Navbar** : Logo, recherche, dark mode, auth modal, menu mobile
- **Footer** : 4 colonnes, réseaux sociaux, liens
- **RootLayout** : Wrapper avec navbar + outlet + footer

### UI Components
- **PropertyCard** : Image, titre, localisation, prix, note, favoris
- **SearchBar** : 4 champs (destination, dates, voyageurs) + bouton
- **ImageWithFallback** : Image avec fallback si erreur
- **AuthModal** : Login/Register avec social auth
- **LoadingSpinner** : Spinner animé
- **StatCard** : Card de statistique avec gradient
- **Badge** : 5 variants (default, success, warning, error, info)

### Contextes
- **ThemeContext** : Gestion dark/light mode avec localStorage

---

## 📊 Graphiques & Visualisations

**Bibliothèque** : Recharts

**Types utilisés** :
- **LineChart** : Évolution revenus et réservations
- **BarChart** : Revenus mensuels propriétaire/admin
- **PieChart** : Répartition types de logements

**Personnalisations** :
- Couleurs adaptées au thème (light/dark)
- Tooltips stylisés
- Grilles personnalisées
- Gradients sur les bars

---

## 🎯 Fonctionnalités Clés

### Authentification
- Modal avec onglets Login/Register
- Validation visuelle (focus states)
- Social auth (Google, Facebook)
- Mot de passe masqué/visible
- Se souvenir de moi

### Recherche & Filtres
- Recherche par destination
- Filtres : type, prix, équipements
- Vue grille/liste
- Carte interactive toggle
- Pagination

### Réservation
- Sélection dates avec inputs
- Calcul automatique du total
- Affichage frais de service
- Card sticky qui suit le scroll

### Gestion Multi-rôles
- **Utilisateur** : réservations, favoris, profil
- **Propriétaire** : logements, calendrier, revenus
- **Admin** : validation, analytics, modération

### Dark Mode
- Toggle dans navbar
- Persistance localStorage
- Variables CSS pour couleurs
- Transitions fluides

---

## 🖼️ Images & Assets

**Source** : Unsplash API
**Catégories utilisées** :
- Chambres d'hôtel luxueuses
- Plages tropicales
- Appartements modernes avec vue
- Villas et chalets

**Optimisations** :
- Lazy loading
- Fallback en cas d'erreur
- Responsive (différentes tailles)

---

## 🎨 Palette de Couleurs

### Light Mode
- **Background** : `#ffffff`
- **Foreground** : `oklch(0.145 0 0)`
- **Primary** : `#030213`
- **Accent** : Dégradé `#3b82f6` → `#8b5cf6`
- **Muted** : `#ececf0`
- **Border** : `rgba(0, 0, 0, 0.1)`

### Dark Mode
- **Background** : `oklch(0.145 0 0)`
- **Foreground** : `oklch(0.985 0 0)`
- **Primary** : `oklch(0.985 0 0)`
- **Muted** : `oklch(0.269 0 0)`

### Gradients
- Bleu → Violet : `from-blue-600 to-purple-600`
- Stats cards : Personnalisés par type

---

## 🚀 Technologies

- **React 18.3.1**
- **React Router 7.13.0** (Data mode)
- **Tailwind CSS 4.1.12**
- **Recharts 2.15.2** (graphiques)
- **Lucide React 0.487.0** (icônes)
- **Motion 12.23.24** (animations)
- **TypeScript** (typage)

---

## 📱 Responsive Design

### Breakpoints
- **Mobile** : < 768px
- **Tablet** : 768px - 1024px
- **Desktop** : > 1024px

### Adaptations
- Navigation mobile avec menu hamburger
- Grilles responsive (1 → 2 → 4 colonnes)
- Typographie adaptative
- Images responsive
- Modals fullscreen sur mobile

---

## ✨ Micro-interactions

- Hover sur cards : scale + shadow
- Boutons : transitions de couleur
- Images : scale au hover
- Inputs : focus ring animé
- Accordéons FAQ : slide down/up
- Favoris : animation coeur
- Navigation : active states
- Modals : fade + zoom in

---

## 🔐 Sécurité & Bonnes Pratiques

- Validation côté client
- Messages d'erreur clairs
- États de chargement
- Gestion des erreurs 404
- Fallbacks pour images
- Accessibilité (ARIA labels)
- SEO-friendly structure
- Performance optimisée

---

## 📈 Métriques & Analytics

### Dashboard Propriétaire
- Revenus du mois
- Nombre de réservations
- Taux d'occupation
- Note moyenne
- Graphiques d'évolution

### Dashboard Admin
- Total utilisateurs
- Total logements
- Total réservations
- Revenus globaux
- Taux de conversion
- Panier moyen
- Taux de satisfaction

---

## 🎯 Expérience Utilisateur

### Points Forts
1. **Navigation intuitive** avec fil d'Ariane
2. **Recherche puissante** avec filtres avancés
3. **Réservation simplifiée** en 3 clics
4. **Dashboards complets** pour chaque rôle
5. **Design cohérent** sur toutes les pages
6. **Feedback visuel** sur toutes les actions
7. **Performance** optimale avec lazy loading
8. **Accessibilité** respectée (contraste, tailles)

### Parcours Utilisateur Typique
1. Arrivée sur home → Hero immersif
2. Recherche destination + dates
3. Parcours résultats avec filtres
4. Consultation détail logement
5. Réservation avec dates
6. Gestion dans dashboard

---

## 🔮 Évolutions Futures

- Système de paiement intégré (Stripe)
- Messagerie temps réel (WebSocket)
- Notifications push
- Calendrier interactif avec indisponibilités
- Carte Mapbox interactive
- Multi-langue (i18n)
- PWA pour installation mobile
- Export PDF des réservations
- Système de parrainage
- Programme de fidélité

---

## 📞 Support & Contact

**Support 24/7** disponible via :
- Chat en ligne
- Email
- Téléphone
- FAQ interactive

---

**Développé avec ❤️ par Claude Code**
**Version 1.0.0 - Juin 2026**

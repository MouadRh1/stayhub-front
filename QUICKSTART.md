# 🚀 Guide de Démarrage Rapide - StayHub

## ✨ Bienvenue sur StayHub !

Cette plateforme de réservation de logements moderne est inspirée d'Airbnb, Booking et Expedia avec un design premium 2026.

---

## 📋 Prérequis

Aucun ! La plateforme est déjà configurée et prête à l'emploi dans Figma Make.

---

## 🎯 Navigation dans la Plateforme

### 🏠 Page d'Accueil - `/`
**Accès** : Cliquez sur le logo "StayHub" ou le bouton "Accueil"

**Que faire ici :**
1. Admirez le hero immersif avec image haute qualité
2. Utilisez la barre de recherche pour trouver un logement
   - Entrez une destination
   - Sélectionnez vos dates
   - Choisissez le nombre de voyageurs
   - Cliquez sur "Rechercher"
3. Explorez les 4 logements populaires
4. Découvrez les destinations tendances
5. Lisez les témoignages clients
6. Consultez la FAQ interactive (cliquez pour déplier)

**Boutons d'action :**
- "Trouver un logement" → Va à la recherche
- "Devenir hôte" → Ouvre le dashboard propriétaire

---

### 🔍 Page Recherche - `/search`
**Accès** : Via la recherche de la home ou le menu "Rechercher"

**Fonctionnalités :**
1. **Filtrer les résultats** :
   - Cliquez sur "Filtres" pour ouvrir les filtres avancés
   - Sélectionnez le type de logement
   - Choisissez votre gamme de prix
   - Cochez les équipements souhaités

2. **Changer la vue** :
   - Icône grille (Grid) : affichage en cartes
   - Icône liste (List) : affichage en liste

3. **Afficher la carte** :
   - Cliquez sur "Carte" pour voir les emplacements
   - Vue côte à côte : liste + carte

4. **Parcourir** :
   - Utilisez la pagination en bas de page
   - 8 logements par page

---

### 🏡 Page Détail Logement - `/property/:id`
**Accès** : Cliquez sur n'importe quelle carte de logement

**Que voir :**
1. **Galerie photos** :
   - Grande image principale
   - 4 miniatures sur le côté
   - Cliquez sur les flèches pour naviguer

2. **Informations** :
   - Description complète
   - 8 équipements avec icônes
   - Carte de localisation
   - 3 avis clients

3. **Réserver** (card à droite) :
   - Sélectionnez date d'arrivée
   - Sélectionnez date de départ
   - Choisissez le nombre de voyageurs
   - Voir le calcul du prix automatique
   - Cliquez sur "Réserver maintenant"

4. **Actions** :
   - Cœur : ajouter aux favoris
   - Partager : partager le logement
   - "Retour aux résultats" : retour à la recherche

---

### 👤 Dashboard Utilisateur - `/dashboard/user`
**Accès** : Menu principal → Icône utilisateur

**4 onglets disponibles :**

#### 1️⃣ Mes Réservations
- Voir toutes vos réservations (confirmées, en attente, terminées)
- Chaque réservation affiche :
  - Photo du logement
  - Nom et localisation
  - Dates d'arrivée/départ
  - Prix total
  - Statut coloré
- Cliquez sur "Voir les détails" pour plus d'infos

#### 2️⃣ Favoris
- Tous vos logements sauvegardés
- Même format que les recherches
- Cliquez pour voir les détails

#### 3️⃣ Profil
- Photo de profil (avatar avec initiales)
- Modifier vos informations :
  - Prénom et nom
  - Email
  - Téléphone
  - Adresse
- Cliquez sur "Enregistrer les modifications"

#### 4️⃣ Paramètres
- **Notifications** :
  - Offres promotionnelles
  - Notifications de réservation
  - Rappels de voyage
- **Confidentialité** :
  - Profil public
  - Afficher les avis
- **Sécurité** :
  - Changer le mot de passe
  - Authentification 2FA
  - Gérer les appareils
- **Danger** : Supprimer le compte

---

### 🏘️ Dashboard Propriétaire - `/dashboard/owner`
**Accès** : Menu "Devenir hôte" ou bouton dans la home

**5 onglets disponibles :**

#### 1️⃣ Vue d'ensemble
- **4 statistiques** :
  - Revenus du mois (avec tendance %)
  - Nombre de réservations
  - Taux d'occupation
  - Note moyenne
- **2 graphiques** :
  - Revenus mensuels (ligne)
  - Réservations mensuelles (barres)
- **Activité récente** : 4 derniers événements

#### 2️⃣ Mes Logements
- Grille de tous vos logements
- Chaque carte affiche :
  - Photo
  - Nom et localisation
  - Statut (actif/inactif)
  - Nombre de réservations
  - Revenus générés
  - Note moyenne
- **Actions** :
  - Œil : voir
  - Crayon : modifier
  - Poubelle : supprimer
- Bouton "Ajouter un logement" en haut

#### 3️⃣ Réservations
- Toutes les réservations reçues
- Statuts : confirmée, en attente, terminée
- Dates et montants visibles

#### 4️⃣ Messages
- Interface de messagerie (à implémenter)

#### 5️⃣ Revenus
- **Résumé** :
  - Total des revenus
  - Moyenne mensuelle
  - Prochain paiement
- **Graphique** : Historique complet

---

### 👨‍💼 Dashboard Administrateur - `/dashboard/admin`
**Accès** : `/dashboard/admin` (accès admin requis)

**5 onglets disponibles :**

#### 1️⃣ Vue d'ensemble
- **4 cards colorées** :
  - Total utilisateurs (bleu)
  - Total logements (violet)
  - Total réservations (rose)
  - Revenus globaux (orange)
- **Graphiques** :
  - Croissance revenus + réservations (ligne double)
  - Types de logements (pie chart)
- **Alertes** :
  - Logements en attente
  - Signalements de fraude
  - Taux de satisfaction

#### 2️⃣ Utilisateurs
- **Tableau complet** :
  - Avatar, nom, email
  - Rôle (admin/propriétaire/utilisateur)
  - Statut (actif/suspendu)
  - Activité (réservations ou logements)
  - Date d'inscription
- **Actions** : voir, modifier, supprimer

#### 3️⃣ Logements
- **Tableau de gestion** :
  - Nom du logement
  - Propriétaire
  - Localisation
  - Statut (approuvé/en attente/rejeté)
  - Réservations et revenus
- **Actions** :
  - Voir détails
  - Approuver (✓)
  - Rejeter (✗)

#### 4️⃣ Réservations
- Vue globale de toutes les réservations

#### 5️⃣ Analytique
- **2 graphiques** :
  - Revenus mensuels (barres)
  - Évolution réservations (ligne)
- **3 KPIs** :
  - Taux de conversion
  - Panier moyen
  - Taux de satisfaction

---

## 🎨 Fonctionnalités Communes

### 🌓 Mode Sombre
**Comment l'activer :**
1. Cliquez sur l'icône lune/soleil dans la navbar (en haut à droite)
2. Le mode est automatiquement sauvegardé
3. Persiste entre les sessions

**Où c'est disponible :** Partout !

---

### 🔐 Connexion / Inscription
**Comment accéder :**
1. Cliquez sur "S'inscrire" ou "Connexion" dans la navbar
2. Modal s'ouvre avec 2 onglets

**Inscription :**
- Nom complet
- Email
- Mot de passe
- Bouton "Créer mon compte"
- Options : Google, Facebook

**Connexion :**
- Email
- Mot de passe
- "Se souvenir de moi"
- "Mot de passe oublié"
- Bouton "Se connecter"

**Basculer :** Cliquez sur "S'inscrire" / "Se connecter" en bas du modal

---

### ❤️ Favoris
**Comment sauvegarder un logement :**
1. Sur une carte de logement, cliquez sur le cœur (coin supérieur droit)
2. Le cœur devient rouge
3. Retrouvez-le dans "Dashboard Utilisateur" → Onglet "Favoris"

---

### 🔍 Recherche Avancée
**Depuis n'importe où :**
1. Utilisez la barre de recherche dans la navbar ou sur la home
2. Remplissez les champs :
   - **Destination** : Où allez-vous ?
   - **Arrivée** : Date d'arrivée
   - **Départ** : Date de départ
   - **Voyageurs** : Nombre de personnes
3. Cliquez sur "Rechercher" (icône loupe)

---

## 🎯 Parcours Utilisateur Recommandés

### 🏖️ Réserver un logement (Utilisateur)
1. **Home** → Utilisez la recherche avec vos critères
2. **Recherche** → Parcourez les résultats, filtrez si besoin
3. **Détail** → Consultez photos, avis, équipements
4. **Réservation** → Sélectionnez dates, voyageurs
5. **Confirmation** → Cliquez "Réserver maintenant"
6. **Dashboard** → Retrouvez votre réservation dans "Mes Réservations"

### 🏠 Gérer ses logements (Propriétaire)
1. **Home** → Cliquez "Devenir hôte"
2. **Dashboard Owner** → Vue d'ensemble de vos stats
3. **Mes Logements** → Consultez vos logements
4. **Ajouter** → Cliquez "Ajouter un logement"
5. **Réservations** → Suivez les réservations reçues
6. **Revenus** → Analysez vos performances

### 👨‍💼 Modérer la plateforme (Admin)
1. **Admin Dashboard** → Vue d'ensemble globale
2. **Alertes** → Traitez les logements en attente
3. **Utilisateurs** → Gérez les comptes
4. **Logements** → Approuvez/Rejetez les nouvelles annonces
5. **Analytique** → Suivez les métriques business

---

## 🎨 Expérience Premium

### ✨ Animations
- **Hover** : Toutes les cartes s'élèvent légèrement
- **Transitions** : Fluides entre les pages
- **Accordéons** : FAQ s'ouvre/ferme en douceur
- **Chargement** : Spinner élégant
- **Modals** : Fade + zoom in

### 🎭 Design
- **Cards** : Coins arrondis (rounded-2xl)
- **Ombres** : Douces et subtiles
- **Dégradés** : Bleu → Violet pour les CTA
- **Icônes** : Lucide React, modernes et cohérentes
- **Typographie** : Hiérarchie claire, lisible

### 📱 Responsive
- **Mobile** : Menu hamburger, stack vertical
- **Tablet** : Grilles 2 colonnes
- **Desktop** : Grilles 4 colonnes, layouts optimaux

---

## 🐛 Dépannage

### La page ne charge pas
→ Vérifiez que vous êtes dans Figma Make et que l'aperçu est activé

### Les images ne s'affichent pas
→ Normal, elles viennent d'Unsplash et peuvent prendre quelques secondes

### Les graphiques sont vides
→ C'est normal, ce sont des données de démonstration

### Je ne vois pas le mode sombre
→ Cliquez sur l'icône lune/soleil en haut à droite de la navbar

---

## 📚 Documentation Complète

Pour plus de détails techniques :
- **PLATEFORME.md** - Documentation exhaustive des fonctionnalités
- **STRUCTURE.md** - Architecture et organisation du code

---

## 🎉 Prêt à Explorer !

Vous avez maintenant toutes les clés pour naviguer dans StayHub. 

**Commencez par :**
1. Activer le mode sombre 🌓
2. Explorer la home avec le hero immersif
3. Faire une recherche de logement
4. Consulter un détail de logement
5. Tester les différents dashboards

**Bon voyage sur StayHub ! ✈️🏖️**

---

*Développé avec ❤️ dans Figma Make*
*Version 1.0.0 - Juin 2026*

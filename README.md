# 🎵 Hirako — Plateforme musicale

Une plateforme d'écoute musicale moderne inspirée de Spotify, construite avec React.

## Fonctionnalités

- 🎧 **Lecteur audio complet** — lecture/pause, précédent/suivant, seek, volume
- 🔀 **Aléatoire & Répétition** — shuffle, repeat one/all
- ❤️ **Titres aimés** — sauvegardez vos morceaux préférés
- 📁 **Import local** — importez MP3, WAV, FLAC, OGG, AAC, M4A
- 🔍 **Recherche** — recherche locale + Spotify
- 🎵 **Intégration Spotify** — connexion OAuth PKCE, aperçus 30s, tops titres
- 📱 **Responsive** — optimisé mobile et desktop

## Installation

```bash
# Cloner ou extraire le projet
cd hirako

# Installer les dépendances
npm install

# Copier la config
cp .env.example .env

# Démarrer
npm start
```

## Configurer Spotify

1. Allez sur [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Créez une nouvelle application
3. Ajoutez `http://localhost:3000` dans **Redirect URIs**
4. Copiez votre **Client ID** dans `.env`
5. Redémarrez avec `npm start`

> **Note** : L'API Spotify gratuite ne permet que des **aperçus de 30 secondes**.
> Pour l'écoute complète, il faut Spotify Premium + Spotify Web Playback SDK.

## Déploiement mobile

```bash
npm run build
# Déployer le dossier /build sur Vercel, Netlify, etc.
# Sur le Dashboard Spotify, ajoutez l'URL de production en Redirect URI
```

## Structure

```
src/
├── components/
│   ├── Sidebar.js         — Navigation latérale
│   ├── Player.js          — Barre de lecture fixe
│   └── TrackComponents.js — TrackCard, TrackRow, TrackGrid
├── context/
│   └── PlayerContext.js   — État global du lecteur
├── hooks/
│   └── useSpotify.js      — Intégration API Spotify (PKCE)
├── pages/
│   ├── Home.js            — Page d'accueil
│   ├── Search.js          — Recherche
│   ├── Library.js         — Bibliothèque
│   ├── Liked.js           — Titres aimés
│   └── Import.js          — Import de fichiers locaux
├── styles/
│   ├── global.css         — Variables CSS & reset
│   ├── App.css            — Layout principal
│   ├── Sidebar.css        — Sidebar styles
│   ├── Player.css         — Player styles
│   ├── TrackComponents.css— Cartes et lignes de pistes
│   ├── Home.css           — Page accueil styles
│   ├── Search.css         — Page recherche styles
│   └── Import.css         — Page import styles
└── utils/
    └── demoData.js        — Titres et playlists demo
```

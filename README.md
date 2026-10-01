# Duozy

Easy to Meet, Easy to Chat, Easy to Play.

Social, chat, cari teman, dan main game dalam satu aplikasi.

## Tech Stack

- **React 19** + **TypeScript**
- **Vite 6** (SPA)
- **Tailwind CSS 4**
- **Zustand** (local state + localStorage persistence)
- **Firebase** (Auth, Firestore, Storage — ready to connect)
- **Firebase Hosting** (deploy target)

## Quick Start

```bash
# Install
npm install

# Development
npm run dev

# Production build → dist/
npm run build

# Preview production build
npm run preview
```

## Firebase Setup

1. Create a project in [Firebase Console](https://console.firebase.google.com/).
2. Enable **Authentication** (Email/Password and optionally Google).
3. Create a **Firestore** database.
4. (Optional) Enable **Storage**.
5. Copy your web app config into `.env` (see `.env.example`).
6. Update `.firebaserc` with your project ID.
7. Deploy rules:

```bash
firebase deploy --only firestore:rules
```

8. Build and deploy hosting:

```bash
npm run build
firebase deploy --only hosting
```

## Project Structure

```
duozy/
├── public/                 # Static assets (avatars, game images, favicon)
├── src/
│   ├── components/duozy/   # All UI screens & shared bits (design preserved)
│   ├── lib/
│   │   ├── duozy/          # Data, store, game engines
│   │   ├── firebase.ts     # Firebase init (placeholders)
│   │   └── utils.ts
│   ├── styles.css          # Tailwind + Duozy theme
│   └── main.tsx
├── firebase.json
├── firestore.rules
├── .firebaserc
├── .env.example
└── package.json
```

## Current Behaviour

- All screens (Splash, Onboarding, Home, Chat, Dating, Games, Ludo, Ular Tangga, Profile, etc.) work with **localStorage** + Zustand.
- Design, colors, animations, assets, and navigation are **unchanged**.
- Firebase is wired but not yet driving the UI. When you add real config, you can gradually replace local data with Auth + Firestore listeners.

## Deploy to Firebase Hosting

```bash
npm install -g firebase-tools   # once
firebase login
# edit .firebaserc → set your project ID
npm run build
firebase deploy --only hosting
```

The rewrite rule in `firebase.json` ensures React (client-side) routing works on refresh.

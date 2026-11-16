# CampusFix – Smart Campus Issue Reporting System

A B.Tech CSE mini-project: a complete web application that lets students report campus facility issues (electricity, plumbing, internet, etc.) via QR codes and gives administrators a live dashboard to manage and resolve them.

## Features

- **Landing page** with hero, feature highlights, "how it works" and footer.
- **Student complaint portal** with form validation and a unique complaint ID generated on submission.
- **QR code system** — one QR per campus location (Classroom 204, Computer Lab, Library, Cafeteria, Block A Washroom). Scanning opens the report form with the location pre-filled. Admins can download QR codes as PNG.
- **Complaint tracking** — students enter their complaint ID to see details and current status (Pending / In Progress / Resolved).
- **Admin dashboard** (protected login) with stat cards, location-wise bar chart, recent complaints, searchable/filterable table, and inline status updates.

## Tech Stack

- React + Vite + TypeScript
- Tailwind CSS + Lucide icons
- React Router (HashRouter, so QR links work from any host)
- Firebase Authentication + Firestore
- `qrcode` library for QR generation

## Getting Started

```bash
npm install
npm run dev
```

Open the local URL shown in the terminal.

## Firebase Setup (required)

The app uses Firebase Authentication for admin login and Firestore for complaint storage. Until you add your config, the app shows a "Firebase not configured" banner and data features will not work.

### Step 1 — Paste your Firebase config

Open **`src/lib/firebase.ts`** and replace the placeholder values in the `firebaseConfig` object with your project's web config:

```js
const firebaseConfig = {
  apiKey: 'PASTE apiKey',              // ← replace
  authDomain: 'PASTE authDomain',       // ← replace
  projectId: 'PASTE projectId',         // ← replace
  storageBucket: 'PASTE storageBucket', // ← replace
  messagingSenderId: 'PASTE messagingSenderId', // ← replace
  appId: 'PASTE appId',                 // ← replace
};
```

Where to find it: **Firebase Console → Project Settings → General → Your apps → Web app**. If you haven't added a web app yet, click the `</>` icon and register one.

### Step 2 — Enable Authentication

1. Firebase Console → **Authentication → Get started**.
2. **Sign-in method** tab → enable **Email/Password**.
3. **Users** tab → **Add user** → create the admin account (e.g. `admin@campusfix.edu` + a strong password).

This account is what you use on the Admin Login page. No admin passwords are stored in the code.

### Step 3 — Create Firestore database

1. Firebase Console → **Firestore Database → Create database**.
2. Start in **production mode** (rules below lock it down).
3. Choose a location near you.

### Step 4 — Collection

Complaints are stored in a single collection:

- **Collection name:** `complaints`
- Each document ID is the complaint ID (e.g. `CF-AB12CD`).
- Document fields: `studentName` (string), `studentEmail` (string), `location` (string), `category` (string), `priority` (string), `description` (string), `status` (string: `Pending` / `In Progress` / `Resolved`), `createdAt` (server timestamp), `isDemo` (boolean).

You do **not** need to create documents manually — they are created when students submit complaints.

### Step 5 — Firestore Security Rules

Firebase Console → **Firestore Database → Rules**. Replace with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /complaints/{complaintId} {
      // Students can create complaints (no auth required for reporting)
      allow create: if true;
      // Only authenticated admin can read or update status
      allow read: if request.auth != null;
      allow update: if request.auth != null;
      allow delete: if false;
    }
  }
}
```

- **create** is public so students can report without logging in.
- **read / update** require auth, so only the admin account can view the dashboard or change statuses.
- **delete** is blocked to protect complaint history.

### Step 6 — Run

```bash
npm run dev
```

The "Firebase not configured" banner disappears once your config is in place.

## QR Code Usage

1. Go to the **QR Codes** page.
2. Switch to **Admin view**.
3. Download individual QR codes or all at once.
4. Print and place each QR near its matching location.
5. Students scan with their phone — the report form opens with the location pre-selected.

QR URLs use the hash router so they work on any static host (no server rewrites needed).

## Build & Deploy

```bash
npm run build
```

Output is in `dist/` and can be deployed to any static host (Netlify, Vercel, Firebase Hosting, GitHub Pages).

## Project Structure

```
src/
  components/      Navbar, Footer, Logo, ConfigBanner
  lib/             firebase, dataService, authService, types, format
  pages/           LandingPage, ReportPage, TrackPage, QrCodesPage,
                   AdminLoginPage, AdminDashboardPage
  App.tsx          Routing
```

## Notes

- Admin access is protected by Firebase Authentication — no credentials are hardcoded.
- Complaint IDs are generated client-side (`CF-XXXXXX`) and used as the Firestore document ID, so tracking reads a single document by ID.

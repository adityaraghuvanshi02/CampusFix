import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

// ============================================================
//  Firebase web app configuration for project: campusfix-61017
//  Source: Firebase Console → Project Settings → General → Web app
// ============================================================
const firebaseConfig = {
  apiKey: 'AIzaSyAK1GkMW_g5X9c3KuNZV9qmPyPA5N7k3h8',
  authDomain: 'campusfix-61017.firebaseapp.com',
  projectId: 'campusfix-61017',
  storageBucket: 'campusfix-61017.firebasestorage.app',
  messagingSenderId: '567451240935',
  appId: '1:567451240935:web:1c8a3273bc6a5b1e905542',
};

// Detect whether the placeholder values have been replaced.
export const isFirebaseConfigured = !Object.values(firebaseConfig).some(
  (v) => typeof v !== 'string' || v.startsWith('PASTE ') || v.trim() === '',
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

if (isFirebaseConfigured) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
}

export { app, auth, db };

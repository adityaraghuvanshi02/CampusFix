import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import { auth } from './firebase';

function friendlyAuthError(err: unknown): string {
  const code = (err as { code?: string })?.code ?? '';
  const map: Record<string, string> = {
    'auth/invalid-email': 'That email address is not valid.',
    'auth/user-disabled': 'This admin account has been disabled.',
    'auth/user-not-found': 'No admin account found with those credentials.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/invalid-credential': 'Invalid email or password.',
    'auth/too-many-requests': 'Too many attempts. Try again in a few minutes.',
    'auth/network-request-failed': 'Network error. Check your connection and retry.',
    'auth/configuration-not-found': 'Email/Password sign-in is not enabled in your Firebase project.',
  };
  return map[code] ?? 'Sign-in failed. Please check your credentials.';
}

export async function adminLogin(email: string, password: string): Promise<User> {
  if (!auth) throw new Error('Firebase Auth is not connected. Add your Firebase config.');
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return cred.user;
  } catch (err) {
    throw new Error(friendlyAuthError(err));
  }
}

export async function adminLogout(): Promise<void> {
  if (!auth) throw new Error('Firebase Auth is not connected.');
  await signOut(auth);
}

export function onAdminAuthChange(cb: (user: User | null) => void): () => void {
  if (!auth) {
    cb(null);
    return () => {};
  }
  return onAuthStateChanged(auth, cb);
}

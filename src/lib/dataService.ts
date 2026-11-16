import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  query,
  orderBy,
  setDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Complaint, ComplaintStatus } from './types';

function generateId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let id = 'CF-';
  for (let i = 0; i < 6; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}

function toComplaint(id: string, data: Record<string, unknown>): Complaint {
  return {
    id,
    studentName: String(data.studentName ?? ''),
    studentEmail: String(data.studentEmail ?? ''),
    location: String(data.location ?? ''),
    category: data.category as Complaint['category'],
    priority: data.priority as Complaint['priority'],
    description: String(data.description ?? ''),
    status: (data.status as ComplaintStatus) ?? 'Pending',
    createdAt:
      data.createdAt instanceof Timestamp
        ? data.createdAt.toMillis()
        : typeof data.createdAt === 'number'
        ? data.createdAt
        : Date.now(),
    isDemo: Boolean(data.isDemo ?? false),
  };
}

export async function fetchComplaints(): Promise<Complaint[]> {
  if (!db) throw new Error('Firestore is not connected. Add your Firebase config.');
  const q = query(collection(db, 'complaints'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => toComplaint(d.id, d.data()));
}

export async function createComplaint(
  input: Omit<Complaint, 'id' | 'status' | 'createdAt' | 'isDemo'>,
): Promise<Complaint> {
  if (!db) throw new Error('Firestore is not connected. Add your Firebase config.');
  const id = generateId();
  const status: ComplaintStatus = 'Pending';
  await setDoc(doc(db, 'complaints', id), {
    complaintId: id,
    ...input,
    status,
    createdAt: serverTimestamp(),
    isDemo: false,
  });
  return { id, ...input, status, createdAt: Date.now(), isDemo: false };
}

export async function updateComplaintStatus(
  id: string,
  status: ComplaintStatus,
): Promise<void> {
  if (!db) throw new Error('Firestore is not connected. Add your Firebase config.');
  await updateDoc(doc(db, 'complaints', id), { status });
}

export async function getComplaintById(id: string): Promise<Complaint | null> {
  if (!db) throw new Error('Firestore is not connected. Add your Firebase config.');
  const ref = doc(db, 'complaints', id.trim());
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return toComplaint(snap.id, snap.data() as Record<string, unknown>);
}

export { generateId };

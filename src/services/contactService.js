import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';

const messagesCol = collection(db, 'messages');

function getCreatedAtMs(message) {
  const createdAt = message?.createdAt;
  if (!createdAt) return 0;
  if (typeof createdAt?.toMillis === 'function') return createdAt.toMillis();
  if (typeof createdAt === 'number') return createdAt;
  return 0;
}

export async function createContactMessage(payload) {
  const data = {
    name: String(payload?.name || '').trim(),
    email: String(payload?.email || '').trim(),
    phone: String(payload?.phone || '').trim(),
    message: String(payload?.message || '').trim(),
    createdAt: serverTimestamp(),
  };
  await addDoc(messagesCol, data);
}

export async function getAllContactMessages() {
  const q = query(messagesCol);
  const snap = await getDocs(q);
  const messages = snap.docs.map((docItem) => ({ id: docItem.id, ...docItem.data() }));
  messages.sort((a, b) => getCreatedAtMs(b) - getCreatedAtMs(a));
  return messages;
}


import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const heroRef = doc(db, 'hero', 'active');

export async function getActiveHero() {
  try {
    const snap = await getDoc(heroRef);
    if (!snap.exists()) return null;
    const hero = snap.data();
    if (!hero.isActive) return null; // Only return active hero for homepage
    return hero;
  } catch (error) {
    console.error('Error fetching hero:', error);
    return null;
  }
}

export async function upsertHero(hero) {
  const data = {
    title: hero.title?.trim() || '',
    subtitle: hero.subtitle?.trim() || '',
    buttonText: hero.buttonText?.trim() || '',
    buttonLink: hero.buttonLink?.trim() || '',
    imageUrl: hero.imageUrl || '',
    isActive: Boolean(hero.isActive),
    updatedAt: serverTimestamp(),
  };
  await setDoc(heroRef, data, { merge: true });
}


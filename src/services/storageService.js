import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../firebase/config';

export async function uploadProductImage(file, { productId }) {
  const fileExt = file.name.split('.').pop() || 'jpg';
  const storageRef = ref(
    storage,
    `products/${productId}/${Date.now()}.${fileExt}`,
  );
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
}

export async function uploadHeroImage(file) {
  const fileExt = file.name.split('.').pop() || 'jpg';
  const storageRef = ref(storage, `hero/${Date.now()}.${fileExt}`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
}


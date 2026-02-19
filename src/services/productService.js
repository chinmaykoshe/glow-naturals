import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../firebase/config';

const productsCol = collection(db, 'products');

function normalizeProduct(product) {
  return {
    name: product.name?.trim() || '',
    description: product.description?.trim() || '',
    imageUrl: product.imageUrl || '',
    retailPrice: Number(product.retailPrice || 0),
    stock: Number(product.stock || 0),
    category: product.category?.trim() || '',
    bestseller: Boolean(product.bestseller),
  };
}

function getCreatedAtMs(product) {
  const createdAt = product?.createdAt;
  if (!createdAt) return 0;
  if (typeof createdAt?.toMillis === 'function') return createdAt.toMillis();
  if (typeof createdAt === 'number') return createdAt;
  return 0;
}

function pickRandomItems(items, count) {
  const list = [...items];
  for (let i = list.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list.slice(0, count);
}

export async function getAllProducts() {
  try {
    const q = query(productsCol);
    const snap = await getDocs(q);
    const products = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    products.sort((a, b) => getCreatedAtMs(b) - getCreatedAtMs(a));
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function getBestsellerProducts() {
  try {
    // Keep this index-free: filter in Firestore, sort in client.
    const q = query(productsCol, where('bestseller', '==', true), limit(40));
    const snap = await getDocs(q);
    const products = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    if (products.length > 0) {
      products.sort((a, b) => getCreatedAtMs(b) - getCreatedAtMs(a));
      return products.slice(0, 8);
    }

    // If no products are marked bestseller, show a random set.
    const allProducts = await getAllProducts();
    return pickRandomItems(allProducts, 8);
  } catch (error) {
    console.error('Error fetching bestsellers:', error);
    return [];
  }
}

export async function getProductById(productId) {
  const ref = doc(db, 'products', productId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

export async function createProduct(product) {
  const data = normalizeProduct(product);
  const ref = await addDoc(productsCol, {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateProduct(productId, updates) {
  const ref = doc(db, 'products', productId);
  const data = normalizeProduct(updates);
  await updateDoc(ref, data);
}

export async function deleteProduct(productId) {
  await deleteDoc(doc(db, 'products', productId));
}


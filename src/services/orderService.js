import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../firebase/config';

const ordersCol = collection(db, 'orders');

function getCreatedAtMs(order) {
  const createdAt = order?.createdAt;
  if (!createdAt) return 0;
  if (typeof createdAt?.toMillis === 'function') return createdAt.toMillis();
  if (typeof createdAt === 'number') return createdAt;
  return 0;
}

export async function placeOrder({ userId, userEmail, cartItems, customerDetails }) {
  if (!userId) throw new Error('You must be logged in to place an order.');
  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    throw new Error('Your cart is empty.');
  }
  if (!customerDetails?.name || !customerDetails?.phone || !customerDetails?.address) {
    throw new Error('Please fill delivery name, phone, and address.');
  }

  return await runTransaction(db, async (tx) => {
    // Load products and validate stock
    const productDocs = new Map();

    for (const item of cartItems) {
      const productRef = doc(db, 'products', item.productId);
      const snap = await tx.get(productRef);
      if (!snap.exists()) {
        throw new Error('A product in your cart no longer exists.');
      }
      const product = { id: snap.id, ...snap.data() };
      productDocs.set(item.productId, { ref: productRef, product });

      const qty = Number(item.quantity || 0);
      if (qty <= 0) throw new Error('Invalid quantity in cart.');

      const stock = Number(product.stock || 0);
      if (stock < qty) {
        throw new Error(`Not enough stock for "${product.name}".`);
      }
    }

    // Build order items with authoritative pricing
    const items = cartItems.map((item) => {
      const { product } = productDocs.get(item.productId);
      const qty = Number(item.quantity || 0);
      const unitPrice = Number(product.retailPrice || 0);
      return {
        productId: product.id,
        productName: product.name || item.name || 'Product',
        quantity: qty,
        price: unitPrice,
      };
    });

    const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const orderRef = doc(ordersCol);
    tx.set(orderRef, {
      userId,
      userEmail: String(userEmail || '').trim(),
      customerDetails: {
        name: String(customerDetails.name || '').trim(),
        phone: String(customerDetails.phone || '').trim(),
        address: String(customerDetails.address || '').trim(),
      },
      items,
      totalAmount,
      status: 'pending',
      createdAt: serverTimestamp(),
    });

    // Decrement stock
    for (const item of cartItems) {
      const { ref, product } = productDocs.get(item.productId);
      const qty = Number(item.quantity || 0);
      const newStock = Number(product.stock || 0) - qty;
      tx.update(ref, { stock: newStock });
    }

    return orderRef.id;
  });
}

export async function getMyOrders(userId) {
  const q = query(ordersCol, where('userId', '==', userId));
  const snap = await getDocs(q);
  const orders = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  orders.sort((a, b) => getCreatedAtMs(b) - getCreatedAtMs(a));
  return orders;
}

export async function getAllOrders() {
  const q = query(ordersCol);
  const snap = await getDocs(q);
  const orders = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  orders.sort((a, b) => getCreatedAtMs(b) - getCreatedAtMs(a));
  return orders;
}

export async function updateOrderStatus(orderId, status) {
  await updateDoc(doc(db, 'orders', orderId), { status });
}

export async function getOrderById(orderId) {
  const snap = await getDoc(doc(db, 'orders', orderId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}


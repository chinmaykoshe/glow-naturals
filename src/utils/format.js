export function formatDate(value) {
  if (!value) return '';
  try {
    // Firestore Timestamp
    if (typeof value.toDate === 'function') {
      return value.toDate().toLocaleString();
    }
    // JS Date
    if (value instanceof Date) return value.toLocaleString();
    return String(value);
  } catch {
    return '';
  }
}


// src/utils/productImageFallback.js

const CATEGORY_FALLBACKS = {
  facewash: '/default-images/facewash.svg',
  shampoo: '/default-images/shampoo.svg',
  serum: '/default-images/serum.svg',
  moisturizer: '/default-images/moisturizer.svg',
  perfume: '/default-images/perfume.svg',
  lipstick: '/default-images/lipstick.svg',
};

const GENERIC_FALLBACK = '/default-images/generic.svg';

export function buildProductImageCandidates(product) {
  const candidates = [];

  // 1️⃣ Primary image from admin / Firebase
  if (product?.imageUrl) {
    candidates.push(product.imageUrl);
  }

  // 2️⃣ Category fallback
  if (product?.category) {
    const categoryKey = product.category.toLowerCase().trim();

    if (CATEGORY_FALLBACKS[categoryKey]) {
      candidates.push(CATEGORY_FALLBACKS[categoryKey]);
    }
  }

  // 3️⃣ Generic fallback (always last)
  candidates.push(GENERIC_FALLBACK);

  return candidates;
}
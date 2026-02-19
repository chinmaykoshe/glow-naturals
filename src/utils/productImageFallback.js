const DEFAULT_KEYWORD_BY_TYPE = {
  lipstick: 'lipstick makeup product',
  serum: 'facial serum skincare bottle',
  moisturizer: 'moisturizer cream skincare',
  shampoo: 'shampoo bottle hair care',
  facewash: 'face wash cleanser skincare',
  perfume: 'perfume bottle fragrance',
};

const GENERIC_KEYWORD = 'beauty cosmetic product';
const DEFAULT_LOCAL_IMAGE_BY_TYPE = {
  lipstick: '/default-images/lipstick.svg',
  serum: '/default-images/serum.svg',
  moisturizer: '/default-images/moisturizer.svg',
  shampoo: '/default-images/shampoo.svg',
  facewash: '/default-images/facewash.svg',
  perfume: '/default-images/perfume.svg',
};
const GENERIC_LOCAL_IMAGE = '/default-images/generic.svg';

const KEYWORDS_BY_TYPE = {
  lipstick: ['lipstick', 'lip color', 'lip tint', 'lip balm', 'lipbalm'],
  serum: ['serum', 'kumkumadi'],
  moisturizer: ['moisturizer', 'moisturiser', 'cream', 'body butter', 'gel'],
  shampoo: ['shampoo'],
  facewash: ['facewash', 'face wash', 'cleanser'],
  perfume: ['perfume', 'fragrance', 'deo', 'deostick'],
};

function normalizeText(value) {
  return String(value || '').toLowerCase().trim();
}

function buildUnsplashUrl(keyword) {
  // Use picsum seed URLs for stable free image URLs without API keys.
  return `https://picsum.photos/seed/${encodeURIComponent(keyword)}/600/600`;
}

export function detectImageTypeFromProduct(product) {
  const haystack = [
    normalizeText(product?.category),
    normalizeText(product?.name),
    normalizeText(product?.description),
  ].join(' ');

  for (const [type, keywords] of Object.entries(KEYWORDS_BY_TYPE)) {
    if (keywords.some((keyword) => haystack.includes(keyword))) {
      return type;
    }
  }

  return null;
}

export function getDefaultImageForProduct(product) {
  const type = detectImageTypeFromProduct(product);
  if (!type) return buildUnsplashUrl(GENERIC_KEYWORD);
  return buildUnsplashUrl(DEFAULT_KEYWORD_BY_TYPE[type] || GENERIC_KEYWORD);
}

export function getLocalDefaultImageForProduct(product) {
  const type = detectImageTypeFromProduct(product);
  if (!type) return GENERIC_LOCAL_IMAGE;
  return DEFAULT_LOCAL_IMAGE_BY_TYPE[type] || GENERIC_LOCAL_IMAGE;
}

export function resolveProductImageUrl(product) {
  const uploaded = String(product?.imageUrl || '').trim();
  if (uploaded) return uploaded;
  return getDefaultImageForProduct(product);
}

export function buildProductImageCandidates(product) {
  const uploaded = String(product?.imageUrl || '').trim();
  const categoryBasedRemote = getDefaultImageForProduct(product);
  const categoryBasedLocal = getLocalDefaultImageForProduct(product);
  const generic = buildUnsplashUrl(GENERIC_KEYWORD);
  const genericLocal = GENERIC_LOCAL_IMAGE;

  return [uploaded, categoryBasedRemote, categoryBasedLocal, generic, genericLocal].filter(
    (url, index, list) => Boolean(url) && list.indexOf(url) === index,
  );
}

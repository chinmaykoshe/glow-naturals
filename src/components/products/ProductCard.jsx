import { useEffect, useMemo, useState } from 'react';
import { buildProductImageCandidates } from '../../utils/productImageFallback';

export function ProductCard({ product, onAddToCart }) {
  const [qty, setQty] = useState(1);
  const [imageIndex, setImageIndex] = useState(0);
  const [showImage, setShowImage] = useState(true);

  const priceToShow = product?.retailPrice;

  const imageCandidates = useMemo(
    () => buildProductImageCandidates(product),
    [product]
  );

  const imageSrc = imageCandidates[imageIndex] || '';

  useEffect(() => {
    setImageIndex(0);
    setShowImage(true);
  }, [imageCandidates]);

  const handleAdd = () => {
    if (qty <= 0) return;
    onAddToCart(product, qty);
  };

  return (
    <article className="rounded-lg border border-[#e6f0da] bg-white p-4 shadow-sm">
      {/* IMAGE SECTION */}
      <div className="relative">
        {product?.bestseller && (
          <span className="absolute left-3 top-3 text-xs rounded-full bg-[#7aa556] px-2 py-1 text-white">
            Bestseller
          </span>
        )}

        <div className="h-40 flex items-center justify-center overflow-hidden rounded-md bg-[#f5f8ef]">
          {showImage && imageSrc ? (
            <img
              src={imageSrc}
              alt={product?.name || 'Product'}
              className="max-h-full object-contain"
              onError={() => {
                setImageIndex((current) => {
                  if (current + 1 < imageCandidates.length) {
                    return current + 1;
                  }
                  setShowImage(false);
                  return current;
                });
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
              No Image
            </div>
          )}
        </div>
      </div>

      {/* CONTENT */}
      <div className="mt-3">
        <h3 className="text-sm font-semibold text-slate-900">
          {product?.name}
        </h3>

        <p className="text-xs text-slate-500 mt-1">
          {product?.category}
        </p>

        {product?.description && (
          <p className="text-sm text-slate-600 mt-2 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* PRICE + CART */}
        <div className="mt-3 flex items-center justify-between">
          <div className="text-lg font-bold text-slate-900">
            ₹
            {priceToShow?.toFixed
              ? priceToShow.toFixed(2)
              : priceToShow}
          </div>

          <div className="flex items-center gap-2">
            {/* Quantity */}
            <div className="inline-flex items-center rounded border overflow-hidden">
              <button
                aria-label="Decrease quantity"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="px-2 py-1 text-sm text-slate-700 hover:bg-[#f0f6e8]"
              >
                −
              </button>

              <div className="px-3 py-1 text-sm text-center w-10">
                {qty}
              </div>

              <button
                aria-label="Increase quantity"
                onClick={() => setQty((q) => q + 1)}
                className="px-2 py-1 text-sm text-slate-700 hover:bg-[#f0f6e8]"
              >
                +
              </button>
            </div>

            {/* Add Button */}
            <button
              type="button"
              className="rounded bg-[#7aa556] px-3 py-1 text-sm font-semibold text-white hover:bg-[#5f8740] transition-transform transform hover:-translate-y-0.5"
              onClick={handleAdd}
              aria-label={`Add ${qty} ${product?.name} to cart`}
            >
              Add
            </button>
          </div>
        </div>

        {/* STOCK */}
        {product?.stock !== undefined && (
          <p className="text-xs text-slate-500 mt-2">
            In stock: {product.stock}
            {product.stock < 5 && (
              <span className="text-red-500 ml-2">Low</span>
            )}
          </p>
        )}
      </div>
    </article>
  );
}
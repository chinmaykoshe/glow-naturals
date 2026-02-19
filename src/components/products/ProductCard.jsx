import { useEffect, useMemo, useState } from 'react';
import { buildProductImageCandidates } from '../../utils/productImageFallback';

export function ProductCard({ product, onAddToCart }) {
  const [qty, setQty] = useState(1);
  const [imageIndex, setImageIndex] = useState(0);
  const [showImage, setShowImage] = useState(true);
  const priceToShow = product.retailPrice;
  const imageCandidates = useMemo(
    () => buildProductImageCandidates(product),
    [product],
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
    <article className="product-card">
      <div className="product-image-wrapper">
        {product.bestseller && (
          <span className="badge-bestseller" aria-label="Bestseller">
            Bestseller
          </span>
        )}
        {showImage && imageSrc ? (
          <img
            src={imageSrc}
            alt={product.name}
            className="product-image"
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
          <div className="product-image-placeholder" aria-hidden="true" />
        )}
      </div>
      <div className="product-body">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-category">{product.category}</p>
        <p className="product-description">{product.description}</p>

        <div className="product-pricing">
          <p className="price-main">
            {'\u20B9'}{priceToShow?.toFixed ? priceToShow.toFixed(2) : priceToShow}
            <span className="price-unit"> / unit</span>
          </p>
          <p className="price-note">Standard customer pricing</p>
        </div>

        <div className="product-actions">
          <label className="quantity-label">
            Qty
            <input
              type="number"
              min="1"
              value={qty}
              onChange={(e) => setQty(Number(e.target.value) || 1)}
            />
          </label>
          <button
            type="button"
            className="btn-secondary"
            onClick={handleAdd}
          >
            Add to cart
          </button>
        </div>

        {product.stock !== undefined && (
          <p className="stock-label">
            In stock: {product.stock}{' '}
            {product.stock < 5 && (
              <span className="stock-low">Low stock</span>
            )}
          </p>
        )}
      </div>
    </article>
  );
}

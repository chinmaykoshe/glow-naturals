import { useEffect, useMemo, useState } from 'react';
import { getAllProducts } from '../services/productService';
import { ProductCard } from '../components/products/ProductCard';
import { useCart } from '../contexts/CartContext';

export function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const { addToCart } = useCart();

  useEffect(() => {
    async function load() {
      setLoading(true);
      const list = await getAllProducts();
      setProducts(list);
      setLoading(false);
    }
    load();
  }, []);

  const categories = useMemo(() => {
    const set = new Set();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [products]);

  const filtered = products.filter((p) => {
    const matchesSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'all' || p.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="page">
      <section className="section">
        <header className="section-header">
          <h1>Products</h1>
          <p>Discover Glow Naturals products for skin, hair, and personal care.</p>
        </header>

        <div className="filters" aria-label="Product filters">
          <input
            type="search"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search products"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label="Filter by category"
          >
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <p>Loading products...</p>
        ) : (
          <div className="product-grid" aria-live="polite">
            {filtered.length === 0 && <p>No products match these filters.</p>}
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}


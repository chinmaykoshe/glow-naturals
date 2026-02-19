import { useEffect, useState } from 'react';
import { getAllProducts, updateProduct } from '../../services/productService';

export function AdminInventoryPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const list = await getAllProducts();
      setProducts(list);
    } catch (err) {
      setError(err?.message || 'Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onUpdateStock = async (productId, nextStock) => {
    setError('');
    setStatus('');
    try {
      await updateProduct(productId, {
        ...products.find((p) => p.id === productId),
        stock: Number(nextStock),
      });
      setStatus('Inventory updated.');
      await load();
    } catch (err) {
      setError(err?.message || 'Failed to update stock');
    }
  };

  return (
    <section className="section">
      <header className="section-header">
        <h1>Inventory</h1>
        <p>View stock levels and update counts. Low stock = below 5.</p>
      </header>

      {status && <p className="form-success">{status}</p>}
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <div className="card">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="table" role="table" aria-label="Inventory table">
            <div className="table-row table-head" role="row">
              <div role="columnheader">Product</div>
              <div role="columnheader">Category</div>
              <div role="columnheader">Stock</div>
              <div role="columnheader">Update</div>
            </div>

            {products.map((p) => (
              <div className="table-row" role="row" key={p.id}>
                <div role="cell">
                  <div className="admin-list-title">{p.name}</div>
                  {p.stock < 5 && <div className="stock-low">Low stock</div>}
                </div>
                <div role="cell" className="muted">
                  {p.category || '-'}
                </div>
                <div role="cell">
                  <span className="mono">{p.stock ?? 0}</span>
                </div>
                <div role="cell">
                  <label className="quantity-label">
                    New
                    <input
                      type="number"
                      min="0"
                      defaultValue={p.stock ?? 0}
                      onBlur={(e) => onUpdateStock(p.id, e.target.value)}
                      aria-label={`Update stock for ${p.name}`}
                    />
                  </label>
                </div>
              </div>
            ))}
            {products.length === 0 && <p className="muted">No products yet.</p>}
          </div>
        )}
      </div>
    </section>
  );
}


import { useEffect, useMemo, useState } from 'react';
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  updateProduct,
} from '../../services/productService';
import { uploadProductImage } from '../../services/storageService';

const emptyForm = {
  name: '',
  description: '',
  category: '',
  retailPrice: 0,
  stock: 0,
  bestseller: false,
  imageUrl: '',
};

export function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  const [selectedId, setSelectedId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [showOnlyBestsellers, setShowOnlyBestsellers] = useState(false);

  const selected = useMemo(
    () => products.find((p) => p.id === selectedId) || null,
    [products, selectedId],
  );
  const visibleProducts = useMemo(
    () =>
      showOnlyBestsellers
        ? products.filter((product) => Boolean(product.bestseller))
        : products,
    [products, showOnlyBestsellers],
  );

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const list = await getAllProducts();
      setProducts(list);
    } catch (err) {
      setError(err?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!selected) {
      setForm(emptyForm);
      setImageFile(null);
      return;
    }
    setForm({
      name: selected.name || '',
      description: selected.description || '',
      category: selected.category || '',
      retailPrice: selected.retailPrice || 0,
      stock: selected.stock || 0,
      bestseller: Boolean(selected.bestseller),
      imageUrl: selected.imageUrl || '',
    });
    setImageFile(null);
  }, [selected]);

  const onChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onNew = () => {
    setSelectedId(null);
    setForm(emptyForm);
    setImageFile(null);
    setStatus('');
    setError('');
  };

  const onSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setStatus('');
    try {
      if (selectedId) {
        await updateProduct(selectedId, form);
        if (imageFile) {
          const url = await uploadProductImage(imageFile, { productId: selectedId });
          await updateProduct(selectedId, { ...form, imageUrl: url });
        }
        setStatus('Product updated.');
      } else {
        const id = await createProduct(form);
        if (imageFile) {
          const url = await uploadProductImage(imageFile, { productId: id });
          await updateProduct(id, { ...form, imageUrl: url });
        }
        setSelectedId(id);
        setStatus('Product created.');
      }
      await load();
    } catch (err) {
      setError(err?.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id) => {
    const ok = confirm('Delete this product? This cannot be undone.');
    if (!ok) return;
    setError('');
    setStatus('');
    try {
      await deleteProduct(id);
      if (selectedId === id) onNew();
      await load();
      setStatus('Product deleted.');
    } catch (err) {
      setError(err?.message || 'Failed to delete product');
    }
  };

  const onToggleBestsellerQuick = async (product) => {
    setError('');
    setStatus('');
    try {
      await updateProduct(product.id, { ...product, bestseller: !product.bestseller });
      await load();
      setStatus(
        `${product.name} ${product.bestseller ? 'removed from' : 'added to'} bestsellers.`,
      );
    } catch (err) {
      setError(err?.message || 'Failed to update bestseller flag');
    }
  };

  const onAutoPickBestsellers = async () => {
    setError('');
    setStatus('');
    try {
      if (products.length === 0) {
        setStatus('No products available to mark as bestsellers.');
        return;
      }
      const shuffled = [...products];
      for (let i = shuffled.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      const pickedIds = new Set(shuffled.slice(0, Math.min(8, shuffled.length)).map((p) => p.id));
      await Promise.all(
        products.map((product) =>
          updateProduct(product.id, { ...product, bestseller: pickedIds.has(product.id) }),
        ),
      );
      await load();
      setStatus('Random bestsellers selected successfully.');
    } catch (err) {
      setError(err?.message || 'Failed to auto-select bestsellers');
    }
  };

  return (
    <section className="section">
      <header className="section-header admin-header">
        <div>
          <h1>Products</h1>
          <p>Add, edit, delete products and upload images.</p>
        </div>
        <div className="filters">
          <button type="button" className="btn-secondary" onClick={onAutoPickBestsellers}>
            Auto pick bestsellers
          </button>
          <button
            type="button"
            className="btn-ghost"
            onClick={() => setShowOnlyBestsellers((value) => !value)}
          >
            {showOnlyBestsellers ? 'Show all' : 'Only bestsellers'}
          </button>
          <button type="button" className="btn-primary" onClick={onNew}>
            New product
          </button>
        </div>
      </header>

      <div className="admin-split">
        <div className="card">
          <h2>Catalog</h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ul className="admin-list" aria-label="Products list">
              {visibleProducts.map((p) => (
                <li key={p.id} className="admin-list-item">
                  <button
                    type="button"
                    className={`admin-list-button ${selectedId === p.id ? 'is-active' : ''}`}
                    onClick={() => setSelectedId(p.id)}
                    aria-label={`Edit ${p.name}`}
                  >
                    <span className="admin-list-title">{p.name}</span>
                    <span className="muted">
                      Stock: {p.stock ?? 0} {p.stock < 5 ? '| Low' : ''} {p.bestseller ? '| Bestseller' : ''}
                    </span>
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => onToggleBestsellerQuick(p)}
                    aria-label={`Toggle bestseller for ${p.name}`}
                  >
                    {p.bestseller ? 'Unmark' : 'Mark'}
                  </button>
                  <button
                    type="button"
                    className="btn-ghost"
                    onClick={() => onDelete(p.id)}
                    aria-label={`Delete ${p.name}`}
                  >
                    Delete
                  </button>
                </li>
              ))}
              {visibleProducts.length === 0 && (
                <li className="muted">
                  {products.length === 0
                    ? 'No products yet.'
                    : 'No bestsellers yet. Use Auto pick bestsellers.'}
                </li>
              )}
            </ul>
          )}
        </div>

        <form className="card form" onSubmit={onSave}>
          <h2>{selectedId ? 'Edit product' : 'Create product'}</h2>
          <label>
            Name
            <input
              value={form.name}
              onChange={(e) => onChange('name', e.target.value)}
              required
            />
          </label>
          <label>
            Category
            <input
              value={form.category}
              onChange={(e) => onChange('category', e.target.value)}
              placeholder="Skincare, Body, Hair..."
            />
          </label>
          <label>
            Description
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => onChange('description', e.target.value)}
              required
            />
          </label>

          <div className="grid-2">
            <label>
              Price
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.retailPrice}
                onChange={(e) => onChange('retailPrice', Number(e.target.value))}
                required
              />
            </label>
            <label>
              Stock
              <input
                type="number"
                min="0"
                step="1"
                value={form.stock}
                onChange={(e) => onChange('stock', Number(e.target.value))}
                required
              />
            </label>
          </div>

          <label className="checkbox">
            <input
              type="checkbox"
              checked={form.bestseller}
              onChange={(e) => onChange('bestseller', e.target.checked)}
            />
            Bestseller
          </label>

          <label>
            Product image
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            />
            {form.imageUrl && (
              <span className="muted">Current image is set.</span>
            )}
          </label>

          {status && <p className="form-success">{status}</p>}
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </button>
        </form>
      </div>
    </section>
  );
}



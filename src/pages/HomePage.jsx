import { useEffect, useState } from 'react';
import { getActiveHero } from '../services/heroService';
import { getBestsellerProducts } from '../services/productService';
import { ProductCard } from '../components/products/ProductCard';
import { useCart } from '../contexts/CartContext';
import { Link } from 'react-router-dom';

export function HomePage() {
  const [hero, setHero] = useState(null);
  const [bestsellers, setBestsellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [heroDoc, products] = await Promise.all([
          getActiveHero(),
          getBestsellerProducts(),
        ]);
        setHero(heroDoc);
        setBestsellers(products);
      } catch (error) {
        console.error('Failed to load home page data:', error);
      }
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <section className="flex min-h-screen items-center rounded-2xl border border-[#7aa556]/30 bg-white px-6 py-10 md:px-10">
        <div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-2 lg:items-center">
          <div className="space-y-5">
            <p className="inline-flex rounded-full border border-[#7aa556]/40 bg-[#f5f8ef] px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#5f8740]">
              Glow Naturals
            </p>
            <h1 className="text-4xl font-black leading-tight text-slate-900 md:text-6xl">
              {hero?.title || 'Simple care for skin, hair, and everyday glow'}
            </h1>
            <p className="max-w-xl text-base text-slate-600 md:text-lg">
              {hero?.subtitle ||
                'Homemade personal care products by Glow Naturals. B2C only, shipping pan India, COD not available.'}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/products"
                className="rounded-xl bg-[#7aa556] px-5 py-3 font-semibold text-white transition hover:bg-[#5f8740]"
              >
                Shop products
              </Link>
              <Link
                to="/contact"
                className="rounded-xl border border-[#7aa556]/35 bg-white px-5 py-3 font-semibold text-[#314429] transition hover:bg-[#f5f8ef]"
              >
                Contact us
              </Link>
            </div>
          </div>

          <div className="grid gap-4">
            {hero?.imageUrl ? (
              <img
                src={hero.imageUrl}
                alt={hero?.title || 'Glow Naturals featured product'}
                className="h-72 w-full rounded-2xl border border-[#7aa556]/30 object-cover shadow-sm md:h-[25rem]"
              />
            ) : (
              <div className="h-72 w-full rounded-2xl border border-[#7aa556]/30 bg-[#f5f8ef] shadow-sm md:h-[25rem]" />
            )}
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-[#7aa556]/20 bg-[#f5f8ef] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                  Delivery
                </p>
                <p className="mt-1 font-bold text-slate-900">Pan India</p>
              </div>
              <div className="rounded-2xl border border-[#7aa556]/20 bg-[#f5f8ef] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                  Brand
                </p>
                <p className="mt-1 font-bold text-slate-900">Glow Naturals</p>
              </div>
              <div className="rounded-2xl border border-[#7aa556]/20 bg-[#f5f8ef] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-500">
                  Checkout
                </p>
                <p className="mt-1 font-bold text-slate-900">No COD</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="flex min-h-screen items-center rounded-2xl border border-[#7aa556]/30 bg-white px-6 py-10 md:px-10">
        <div className="mx-auto w-full max-w-6xl space-y-8">
          <header className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#5f8740]">
              Bestsellers
            </p>
            <h2 className="text-3xl font-black text-slate-900 md:text-4xl">
              Most-loved picks from Glow Naturals
            </h2>
            <p className="text-slate-600">
              Explore products trusted for everyday use.
            </p>
          </header>

          {loading ? (
            <p className="text-slate-600">Loading products...</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-live="polite">
              {bestsellers.length === 0 && <p>No products yet.</p>}
              {bestsellers.map((product) => (
                <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="flex min-h-screen items-center rounded-2xl border border-[#7aa556]/30 bg-white px-6 py-10 md:px-10">
        <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-2 lg:items-center">
          <header className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#5f8740]">
              Why choose us
            </p>
            <h2 className="text-3xl font-black text-slate-900 md:text-4xl">
              Clean, practical, and made for daily routine
            </h2>
            <p className="max-w-xl text-slate-600">
              Glow Naturals products are made to be easy to choose and easy to use. No complex plans,
              no B2B workflow, just direct customer-first care.
            </p>
            <div className="flex flex-wrap gap-2">
              {['Skincare', 'Haircare', 'Lip care', 'Facewash', 'Perfume', 'Body care'].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-[#7aa556]/30 bg-[#f5f8ef] px-3 py-1 text-sm font-medium text-[#314429]"
                >
                  {item}
                </span>
              ))}
            </div>
          </header>

          <div className="grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl border border-[#7aa556]/20 bg-[#f5f8ef] p-5">
              <h3 className="text-lg font-bold text-slate-900">Gentle formulas</h3>
              <p className="mt-2 text-slate-600">
                Everyday products made for regular use and consistent results.
              </p>
            </article>
            <article className="rounded-2xl border border-[#7aa556]/20 bg-[#f5f8ef] p-5">
              <h3 className="text-lg font-bold text-slate-900">Transparent pricing</h3>
              <p className="mt-2 text-slate-600">
                One simple B2C price model, clear and direct.
              </p>
            </article>
            <article className="rounded-2xl border border-[#7aa556]/20 bg-[#f5f8ef] p-5">
              <h3 className="text-lg font-bold text-slate-900">Pan India delivery</h3>
              <p className="mt-2 text-slate-600">
                Reliable shipping coverage across India.
              </p>
            </article>
            <article className="rounded-2xl border border-[#7aa556]/20 bg-[#f5f8ef] p-5">
              <h3 className="text-lg font-bold text-slate-900">Quick support</h3>
              <p className="mt-2 text-slate-600">
                Contact from the website and your message appears in admin panel.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="flex min-h-screen items-center rounded-2xl border border-[#7aa556]/30 bg-white px-6 py-10 md:px-10">
        <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-2 lg:items-center">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#5f8740]">
              Start now
            </p>
            <h2 className="text-3xl font-black text-slate-900 md:text-4xl">
              Build your routine in a few clicks
            </h2>
            <p className="text-slate-600">
              Browse products, place your order, or talk to us if you need product help.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/about"
                className="rounded-xl border border-[#7aa556]/35 bg-white px-5 py-3 font-semibold text-[#314429] transition hover:bg-[#f5f8ef]"
              >
                About us
              </Link>
              <Link
                to="/contact"
                className="rounded-xl bg-[#7aa556] px-5 py-3 font-semibold text-white transition hover:bg-[#5f8740]"
              >
                Contact team
              </Link>
            </div>
          </div>

          <div className="space-y-3 rounded-2xl border border-[#7aa556]/20 bg-[#f5f8ef] p-6">
            <h3 className="text-xl font-bold text-slate-900">Order details</h3>
            <p className="text-slate-700">Shipping: Pan India</p>
            <p className="text-slate-700">Support: Contact form and email</p>
            <p className="text-slate-700">Payment: COD not available</p>
            <p className="text-slate-700">Brand: Glow Naturals (B2C)</p>
          </div>
        </div>
      </section>
    </div>
  );
}

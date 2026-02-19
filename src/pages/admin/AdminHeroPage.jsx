import { useEffect, useState } from 'react';
import { getActiveHero, upsertHero } from '../../services/heroService';
import { uploadHeroImage } from '../../services/storageService';
import { HeroSection } from '../../components/hero/HeroSection';

export function AdminHeroPage() {
  const [hero, setHero] = useState({
    title: '',
    subtitle: '',
    buttonText: '',
    buttonLink: '',
    imageUrl: '',
    isActive: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError('');
      try {
        const doc = await getActiveHero();
        if (doc) setHero((prev) => ({ ...prev, ...doc }));
      } catch (err) {
        setError(err?.message || 'Failed to load hero');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const onChange = (key, value) => setHero((prev) => ({ ...prev, [key]: value }));

  const onSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setStatus('');
    try {
      let next = { ...hero };
      if (imageFile) {
        const url = await uploadHeroImage(imageFile);
        next = { ...next, imageUrl: url };
      }
      await upsertHero(next);
      setHero(next);
      setImageFile(null);
      setStatus('Hero updated.');
    } catch (err) {
      setError(err?.message || 'Failed to save hero');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="section">
      <header className="section-header">
        <h1>Hero editor</h1>
        <p>Update the homepage campaign content and image.</p>
      </header>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="admin-split">
          <form className="card form" onSubmit={onSave}>
            <h2>Edit hero</h2>
            <label>
              Title
              <input
                value={hero.title}
                onChange={(e) => onChange('title', e.target.value)}
                required
              />
            </label>
            <label>
              Subtitle
              <textarea
                rows={3}
                value={hero.subtitle}
                onChange={(e) => onChange('subtitle', e.target.value)}
              />
            </label>
            <div className="grid-2">
              <label>
                Button text
                <input
                  value={hero.buttonText}
                  onChange={(e) => onChange('buttonText', e.target.value)}
                />
              </label>
              <label>
                Button link
                <input
                  value={hero.buttonLink}
                  onChange={(e) => onChange('buttonLink', e.target.value)}
                  placeholder="/products"
                />
              </label>
            </div>

            <label className="checkbox">
              <input
                type="checkbox"
                checked={Boolean(hero.isActive)}
                onChange={(e) => onChange('isActive', e.target.checked)}
              />
              Campaign active
            </label>

            <label>
              Hero image
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
              {hero.imageUrl && <span className="muted">Current image is set.</span>}
            </label>

            {status && <p className="form-success">{status}</p>}
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}

            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save hero'}
            </button>
          </form>

          <div className="card">
            <h2>Preview</h2>
            <p className="muted">Homepage will only render the hero when active.</p>
            <HeroSection hero={hero} />
          </div>
        </div>
      )}
    </section>
  );
}


import { useEffect, useState } from 'react';
import { getActiveHero, upsertHero } from '../../services/heroService';
import { HeroSection } from '../../components/hero/HeroSection';

const DEFAULT_HERO_IMAGE = '/assets/glownaturalslogo.png';

export function AdminHeroPage() {
  const [hero, setHero] = useState({
    title: '',
    subtitle: '',
    buttonText: '',
    buttonLink: '',
    imageUrl: DEFAULT_HERO_IMAGE,
    isActive: false,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError('');
      try {
        const doc = await getActiveHero();
        if (doc) {
          setHero({
            ...doc,
            imageUrl: doc.imageUrl || DEFAULT_HERO_IMAGE,
          });
        }
      } catch (err) {
        setError('Failed to load hero content.');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const onChange = (key, value) =>
    setHero((prev) => ({ ...prev, [key]: value }));

  const onSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setStatus('');

    try {
      const heroToSave = {
        ...hero,
        imageUrl: hero.imageUrl || DEFAULT_HERO_IMAGE,
      };

      await upsertHero(heroToSave);
      setHero(heroToSave);
      setStatus('Hero updated successfully.');
    } catch (err) {
      setError('Failed to save hero.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="section">
      <header className="section-header">
        <h1>Hero Editor</h1>
        <p>Update homepage campaign content and image.</p>
      </header>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="admin-split">
          {/* FORM */}
          <form className="card form" onSubmit={onSave}>
            <h2>Edit Hero</h2>

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
                  onChange={(e) =>
                    onChange('buttonText', e.target.value)
                  }
                />
              </label>

              <label>
                Button link
                <input
                  value={hero.buttonLink}
                  onChange={(e) =>
                    onChange('buttonLink', e.target.value)
                  }
                  placeholder="/products"
                />
              </label>
            </div>

            <label className="checkbox">
              <input
                type="checkbox"
                checked={Boolean(hero.isActive)}
                onChange={(e) =>
                  onChange('isActive', e.target.checked)
                }
              />
              Campaign active
            </label>

            {/* ✅ IMAGE URL INSTEAD OF FILE */}
            <label>
              Hero image URL
              <input
                type="text"
                value={hero.imageUrl}
                onChange={(e) =>
                  onChange('imageUrl', e.target.value)
                }
                placeholder="/assets/glownaturalslogo.png"
              />
              <span className="muted">
                Leave empty to use default logo.
              </span>
            </label>

            {status && (
              <p className="form-success">{status}</p>
            )}
            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="btn-primary"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save hero'}
            </button>
          </form>

          {/* PREVIEW */}
          <div className="card">
            <h2>Preview</h2>
            <p className="muted">
              Homepage renders hero only when active.
            </p>

            <HeroSection
              hero={{
                ...hero,
                imageUrl:
                  hero.imageUrl || DEFAULT_HERO_IMAGE,
              }}
            />
          </div>
        </div>
      )}
    </section>
  );
}
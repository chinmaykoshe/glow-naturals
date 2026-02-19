export function HeroSection({ hero }) {
  if (!hero || !hero.isActive) return null;

  return (
    <section className="hero" aria-label="Featured campaign">
      <div className="hero-inner">
        <div className="hero-copy">
          <h1 className="hero-title">{hero.title}</h1>
          <p className="hero-subtitle">{hero.subtitle}</p>
          {hero.buttonText && hero.buttonLink && (
            <a
              href={hero.buttonLink}
              className="btn-primary hero-cta"
            >
              {hero.buttonText}
            </a>
          )}
        </div>
        {hero.imageUrl && (
          <div className="hero-image-wrapper">
            <img
              src={hero.imageUrl}
              alt={hero.title}
              className="hero-image"
            />
          </div>
        )}
      </div>
    </section>
  );
}


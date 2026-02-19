import { Link } from 'react-router-dom';

export function AboutPage() {
  return (
    <section className="section page-stack">
      <header className="section-header">
        <h1>About Glow Naturals</h1>
        <p>
          Glow Naturals is a homemade personal care brand focused on simple,
          effective products inspired by natural ingredients.
        </p>
      </header>

      <div className="grid-cards">
        <article className="card">
          <h3>Our Story</h3>
          <p>
            Glow Naturals started with a simple goal: make honest, homemade
            products that families can trust for long-term use.
          </p>
        </article>
        <article className="card">
          <h3>What We Use</h3>
          <p>
            We focus on herbal actives, balanced formulations, and clear
            ingredient choices that fit real skin and hair needs.
          </p>
        </article>
        <article className="card">
          <h3>How We Serve</h3>
          <p>
            We sell directly to customers across India with transparent pricing
            and responsive support.
          </p>
        </article>
      </div>

      <div className="card about-cta">
        <h2>Ready to explore the range?</h2>
        <p>
          Browse our bestsellers and discover the right products for your daily
          routine.
        </p>
        <Link to="/products" className="btn-primary">
          View products
        </Link>
      </div>
    </section>
  );
}

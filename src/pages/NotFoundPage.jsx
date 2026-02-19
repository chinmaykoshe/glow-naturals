import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <section className="page-center card">
      <h1>Page not found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link to="/" className="btn-primary">
        Back to home
      </Link>
    </section>
  );
}

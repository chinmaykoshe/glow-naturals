import { useState } from 'react';
import { createContactMessage } from '../services/contactService';

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setSubmitted(false);
    setError('');
    const formData = new FormData(event.currentTarget);
    try {
      await createContactMessage({
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        message: formData.get('message'),
      });
      setSubmitted(true);
      event.currentTarget.reset();
    } catch (err) {
      setError(err?.message || 'Failed to send message');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="section page-stack">
      <header className="section-header">
        <h1>Contact Us</h1>
        <p>
          Have a product question or support request? Share your details and we
          will get back to you.
        </p>
      </header>

      <div className="contact-grid">
        <article className="card">
          <h2>Direct Contact</h2>
          <p>Instagram: @glow_natural02</p>
          <p>DM for orders</p>
          <p>Shipping pan India</p>
          <p>COD not available</p>
          <p>
            Email:{' '}
            <a href="mailto:glownatural02@gmail.com">
              glownatural02@gmail.com
            </a>
          </p>
        </article>

        <form className="card form" onSubmit={onSubmit}>
          <h2>Send a Message</h2>
          <label>
            Full name
            <input type="text" name="name" required />
          </label>
          <label>
            Email
            <input type="email" name="email" required />
          </label>
          <label>
            Phone
            <input type="tel" name="phone" required />
          </label>
          <label>
            Message
            <textarea name="message" rows="5" required />
          </label>
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          {submitted && (
            <p className="form-success" role="status">
              Thanks. Your message has been sent.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}

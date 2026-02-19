import { useEffect, useState } from 'react';
import { getAllContactMessages } from '../../services/contactService';
import { formatDate } from '../../utils/format';

export function AdminMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError('');
      try {
        const list = await getAllContactMessages();
        setMessages(list);
      } catch (err) {
        setError(err?.message || 'Failed to load messages');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <section className="section">
      <header className="section-header">
        <h1>Messages</h1>
        <p>All contact form messages from users.</p>
      </header>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <div className="card">
        {loading ? (
          <p>Loading...</p>
        ) : messages.length === 0 ? (
          <p className="muted">No messages yet.</p>
        ) : (
          <div className="table" role="table" aria-label="Messages table">
            <div className="table-row table-head" role="row">
              <div role="columnheader">Name</div>
              <div role="columnheader">Contact</div>
              <div role="columnheader">Message</div>
              <div role="columnheader">Time</div>
            </div>
            {messages.map((message) => (
              <div className="table-row" role="row" key={message.id}>
                <div role="cell">
                  <p className="admin-list-title">{message.name || '-'}</p>
                </div>
                <div role="cell">
                  <p className="muted">{message.email || '-'}</p>
                  <p className="muted">{message.phone || '-'}</p>
                </div>
                <div role="cell">{message.message || '-'}</div>
                <div role="cell" className="muted">
                  {formatDate(message.createdAt)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}


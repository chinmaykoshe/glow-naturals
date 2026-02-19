export function OrderCustomerDetails({ customerDetails }) {
  return (
    <div className="stack" style={{ gap: '0.45rem' }}>
      <p>
        <strong>Customer:</strong> {customerDetails?.name || '-'}
      </p>
      <p>
        <strong>Contact:</strong> {customerDetails?.phone || '-'}
      </p>
      <p>
        <strong>Address:</strong> {customerDetails?.address || '-'}
      </p>
    </div>
  );
}


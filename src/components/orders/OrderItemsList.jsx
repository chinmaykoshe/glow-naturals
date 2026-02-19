export function OrderItemsList({ items }) {
  return (
    <ul className="order-items" aria-label="Order items">
      {(items || []).map((item, index) => (
        <li key={`${item.productId}-${index}`} className="order-item">
          <span>{item.productName || item.productId}</span>
          <span>
            Qty: {item.quantity} | {'\u20B9'}{Number(item.price || 0).toFixed(2)} / unit
          </span>
        </li>
      ))}
    </ul>
  );
}

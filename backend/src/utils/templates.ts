export const approvedEmailTemplate = (order: any) => `
  <h2>✅ Order Confirmed</h2>
  <p>Order Number: <strong>${order.orderNumber}</strong></p>
  <p>Thank you for your purchase, ${order.fullName}!</p>
  <p><strong>Items:</strong></p>
  <ul>
    ${order.orderItems.map((item: any) => `
      <li>${item.product.title} - ${item.quantity}x (${item.color}, ${item.size})</li>
    `).join('')}
  </ul>
  <p>Shipping to: ${order.address}, ${order.city}, ${order.state} - ${order.zipCode}</p>
  <p>Card ending: **** ${order.cardLast4}</p>
  <p>We’ll notify you when your items ship. 🎉</p>
`;

export const failedEmailTemplate = (orderNumber: string, reason: string) => `
  <h2>❌ Order Failed</h2>
  <p>Order Number: <strong>${orderNumber}</strong></p>
  <p>We're sorry, but your transaction was unsuccessful.</p>
  <p>Reason: <strong>${reason}</strong></p>
  <p>Please try again or contact support for help.</p>
`;

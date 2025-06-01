export const approvedEmailTemplate = (order: any) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
    <h2 style="color: #4CAF50; text-align: center;">✅ Order Confirmed</h2>
    <p style="font-size: 16px;">Hi <strong>${order.fullName}</strong>,</p>
    <p style="font-size: 16px;">Thanks for your purchase! Below are your order details:</p>

    <div style="background-color: #ffffff; padding: 16px; border-radius: 6px; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">
      <p><strong>Order Number:</strong> <span style="color: #3f51b5;">${order.orderNumber}</span></p>
      <p><strong>Shipping To:</strong><br />
      ${order.address}, ${order.city}, ${order.state} - ${order.zipCode}</p>
      <p><strong>Card Ending:</strong> **** ${order.cardLast4}</p>
    </div>

    <h3 style="margin-top: 24px; color: #333;">🛍️ Items Ordered</h3>
    <ul style="list-style-type: none; padding-left: 0;">
      ${order.orderItems.map((item: any) => `
        <li style="background: #fff; margin-bottom: 10px; padding: 12px; border: 1px solid #ddd; border-radius: 6px;">
          <strong>${item.product.title}</strong><br />
          Quantity: ${item.quantity} &nbsp; | &nbsp; Color: ${item.color} &nbsp; | &nbsp; Size: ${item.size}
        </li>
      `).join('')}
    </ul>

    <p style="margin-top: 24px; font-size: 16px; color: #333;">🎉 We'll notify you once your items are on the way. Thank you again for shopping with us!</p>

    <p style="text-align: center; font-size: 14px; color: #999; margin-top: 32px;">E-SalesOne Team</p>
  </div>
`;


export const failedEmailTemplate = (orderNumber: string, reason: string) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 24px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #fff3f3;">
    <h2 style="color: #f44336; text-align: center;">❌ Order Failed</h2>
    <p style="font-size: 16px;">Hello,</p>
    <p style="font-size: 16px;">We're sorry, but your order could not be completed.</p>

    <div style="background-color: #fff; padding: 16px; border-radius: 6px; box-shadow: 0 2px 6px rgba(0,0,0,0.05); margin-top: 16px;">
      <p><strong>Order Number:</strong> ${orderNumber}</p>
      <p><strong>Reason:</strong> <span style="color: #d32f2f;">${reason}</span></p>
    </div>

    <p style="margin-top: 24px;">Please try again or contact our support team if you need help.</p>

    <p style="text-align: center; font-size: 14px; color: #999; margin-top: 32px;">E-SalesOne Team</p>
  </div>
`;


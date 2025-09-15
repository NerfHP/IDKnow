import { Resend } from 'resend';
import { Order, OrderItem, ContentItem } from '@prisma/client';

const resend = new Resend(process.env.RESEND_API_KEY);

// This type definition is the key. It tells TypeScript what an "order with all its details" looks like.
type OrderWithDetails = Order & {
  items: (OrderItem & { product: ContentItem })[];
};

// --- 1. Email to the Customer ---
export const sendOrderConfirmationEmail = async (order: OrderWithDetails, customerEmail: string) => {
  const subject = `Your Siddhi Divine Order Confirmation #${order.id.slice(-6)}`;
  
  // By explicitly typing `item` here, we fix the error.
  const itemsHtml = order.items.map((item: OrderItem & { product: ContentItem }) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.product.name} (x${item.quantity})</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${(item.price * item.quantity).toLocaleString('en-IN')}</td>
    </tr>
  `).join('');

  const body = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h1 style="color: #c0392b;">Thank you for your order!</h1>
      <p>Hi ${order.customerName}, we've received your order and will process it shortly.</p>
      <h2 style="border-bottom: 2px solid #eee; padding-bottom: 10px;">Order Summary</h2>
      <table style="width: 100%; border-collapse: collapse;">
        ${itemsHtml}
        <tr style="font-weight: bold;">
          <td style="padding: 10px;">Total</td>
          <td style="padding: 10px; text-align: right;">₹${order.total.toLocaleString('en-IN')}</td>
        </tr>
      </table>
      <h3 style="margin-top: 30px;">Shipping Address</h3>
      <p>${order.shippingAddress}</p>
    </div>
  `;

  try {
    await resend.emails.send({
      from: 'Siddhi Divine <onboarding@resend.dev>',
      to: customerEmail,
      subject: subject,
      html: body,
    });
  } catch (error) {
    console.error("Failed to send customer email:", error);
  }
};

// --- 2. Email to You (the Admin) ---
export const sendNewOrderNotificationEmail = async (order: OrderWithDetails) => {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) return;

  const subject = `🎉 New Order Received! #${order.id.slice(-6)}`;
  
  const itemsHtml = order.items.map((item: OrderItem & { product: ContentItem }) => `
    <li style="margin-bottom: 10px;">
      <strong>${item.product.name}</strong> (SKU: ${item.product.sku || 'N/A'})<br>
      Quantity: ${item.quantity} | Price: ₹${item.price.toLocaleString('en-IN')}
    </li>
  `).join('');

  const body = `
     <div style="font-family: Arial, sans-serif; color: #333;">
      <h1 style="color: #27ae60;">You have a new order!</h1>
      <p>Order #${order.id.slice(-6)} was placed by <strong>${order.customerName}</strong>.</p>
      <h2 style="border-bottom: 2px solid #eee; padding-bottom: 10px;">Items to Dispatch</h2>
      <ul style="list-style-type: none; padding: 0;">${itemsHtml}</ul>
      <h3 style="font-weight: bold;">Total Value: ₹${order.total.toLocaleString('en-IN')}</h3>
      <h2 style="margin-top: 30px;">Shipping Address</h2>
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px;">
        <p style="margin: 0;"><strong>${order.customerName}</strong></p>
        <p style="margin: 0;">${order.shippingAddress}</p>
        <p style="margin: 0;">Phone: ${order.customerPhone}</p>
      </div>
    </div>
  `;

  try {
    await resend.emails.send({
      from: 'Siddhi Divine <onboarding@resend.dev>',
      to: adminEmail,
      subject: subject,
      html: body,
    });
  } catch (error) {
    console.error("Failed to send admin email:", error);
  }
};


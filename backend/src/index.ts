
import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import bodyParser from 'body-parser';
// import { sendOrderEmail } from './utils/mailer'; used for mailtrap
import { sendOrderConfirmationEmail } from './utils/sendgrid';
import { approvedEmailTemplate, failedEmailTemplate } from './utils/templates';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(bodyParser.json());

function determineStatus(cardNumber: string): 'approved' | 'declined' | 'gateway_error' {
  if (cardNumber.endsWith('1')) return 'approved';
  if (cardNumber.endsWith('2')) return 'declined';
  if (cardNumber.endsWith('3')) return 'gateway_error';
  return 'approved';
}
//@ts-ignore
app.post('/checkout', async (req, res) => {
  try {
    const { userInfo, cartItems } = req.body;
    const orderNumber = 'ORD-' + Date.now();
    const cardLast4 = userInfo.cardNumber.slice(-4);
    const status = determineStatus(userInfo.cardNumber);

    const order = await prisma.order.create({
      data: {
        orderNumber,
        fullName: userInfo.fullName,
        email: userInfo.email,
        phone: userInfo.phone,
        address: userInfo.address,
        city: userInfo.city,
        state: userInfo.state,
        zipCode: userInfo.zipCode,
        cardLast4,
        status,
        orderItems: {
          create: cartItems.map((item: any) => ({
            productId: item.id,
            color: item.color,
            size: item.size,
            quantity: item.quantity,
          })),
        },
      },
    });
    const orderWithItems = await prisma.order.findUnique({
        where: { orderNumber },
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
        },
      });

    for (const item of cartItems) {
      await prisma.product.update({
        where: { id: item.id },
        data: { inventory: { decrement: item.quantity } },
      });
    }

    if (status === 'approved') {
        
        await sendOrderConfirmationEmail(userInfo.email, '✅ Order Confirmed', approvedEmailTemplate(orderWithItems));
      return res.status(200).json({ success: true, orderNumber });
    } else if (status === 'declined') {
    await sendOrderConfirmationEmail(userInfo.email, '❌ Transaction Declined', failedEmailTemplate(orderNumber, 'Transaction Declined by Bank'));
      return res.status(400).json({ success: false, error: '❌ Transaction Declined by Bank', orderNumber });
    } else if (status === 'gateway_error') {
        await sendOrderConfirmationEmail(userInfo.email, '⚠️ Payment Gateway Error', failedEmailTemplate(orderNumber, 'Payment Gateway Error'));
      return res.status(502).json({ success: false, error: '⚠️ Payment Gateway Error', orderNumber });
    }

    return res.status(500).json({ success: false, error: '❌ Unknown Payment Status', orderNumber });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});
//@ts-ignore
app.get('/order/:orderNumber', async (req, res) => {
    try {
      const order = await prisma.order.findUnique({
        where: { orderNumber: req.params.orderNumber },
        include: {
          orderItems: {
            include: {
              product: true,
            },
          },
        },
      });
  
      if (!order) return res.status(404).json({ error: 'Order not found' });
  
      res.json(order);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch order' });
    }
  });
  

app.listen(3001, () => console.log('✅ Backend running on http://localhost:3001'));

'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';

export default function ThankYouPage() {
  const { orderNumber } = useParams();
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!orderNumber) return;

    const fetchOrder = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/order/${orderNumber}`);
        setOrderData(res.data);
      } catch (err: any) {
        setError('⚠️ Order not found or failed to load.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderNumber]);

  if (loading) return <p className="p-10 text-center text-lg">Loading...</p>;
  if (error) return <p className="p-10 text-center text-red-500">{error}</p>;
  if (!orderData) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-green-600">✅ Thank You for Your Purchase!</h1>
      <p className="text-lg font-medium mb-4">Order Number: <span className="font-mono">{orderData.orderNumber}</span></p>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Customer Info</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
        <p><strong>Full Name:</strong> {orderData.fullName}</p>
        <p><strong>Email:</strong> {orderData.email}</p>
        <p><strong>Phone:</strong> {orderData.phone}</p>
        <p><strong>Address:</strong> {orderData.address}, {orderData.city}, {orderData.state} - {orderData.zipCode}</p>
        <p><strong>Card Ending:</strong> **** **** **** {orderData.cardLast4}</p>
        <p><strong>Status:</strong> <span className={`font-semibold ${orderData.status === 'approved' ? 'text-green-600' : 'text-red-500'}`}>{orderData.status}</span></p>
      </div>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Order Summary</h2>
      <div className="space-y-4">
        {orderData.orderItems.map((item: any, idx: number) => (
          <div key={idx} className="flex items-center gap-4 border p-4 rounded-lg shadow">
            <img src={item.product.image} alt={item.product.title} className="w-20 h-20 object-cover rounded" />
            <div className="flex-1">
              <p className="font-semibold">{item.product.title}</p>
              <p className="text-sm text-gray-600">Color: {item.color} | Size: {item.size}</p>
              <p className="text-sm">Quantity: {item.quantity}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-10 text-xl font-semibold text-center text-indigo-700">
        🎉 Your order has been placed successfully. You will receive a confirmation email shortly.
      </p>
    </div>
  );
}

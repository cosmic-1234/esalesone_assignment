'use client';
import { useState } from 'react';
import { useCart } from '../cart-context';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import * as dotenv from 'dotenv'
dotenv.config()

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    const cardRegex = /^[0-9]{16}$/;
    const cvvRegex = /^[0-9]{3}$/;

    const expiry = new Date(form.expiryDate);
    const now = new Date();
    now.setMonth(now.getMonth() - 1);

    if (!form.fullName || !form.email || !form.phone || !form.address || !form.city || !form.state || !form.zip || !form.cardNumber || !form.expiryDate || !form.cvv) {
      return 'Please fill out all fields.';
    }
    if (!emailRegex.test(form.email)) return 'Invalid email format.';
    if (!phoneRegex.test(form.phone)) return 'Phone number must be 10 digits.';
    if (!cardRegex.test(form.cardNumber)) return 'Card number must be 16 digits.';
    if (!cvvRegex.test(form.cvv)) return 'CVV must be 3 digits.';
    if (expiry <= now) return 'Expiry date must be in the future.';

    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      console.log(process.env.NEXT_PUBLIC_API)
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API}/checkout`, {
        userInfo: {
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          address: form.address,
          city: form.city,
          state: form.state,
          zipCode: form.zip,
          cardNumber: form.cardNumber,
        },
        cartItems: cart.map(item => ({
          id: item.id,
          color: item.color,
          size: item.size,
          quantity: item.quantity,
        })),
      });

      const { success: ok, orderNumber } = response.data;
      setLoading(false);

      if (ok) {
        setSuccess(`✅ Payment Approved! Order #${orderNumber}`);
        clearCart();
  router.push(`/thank-you/${orderNumber}`);
      } else {
        setError('❌ Transaction failed. Please try again.');
      }
    } catch (err: any) {
      setLoading(false);
      const msg = err?.response?.data?.error || '⚠️ Server Error. Please try again.';
      setError(msg);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input name="fullName" placeholder="Full Name" className="input" value={form.fullName} onChange={handleChange} />
        <input name="email" placeholder="Email" type="email" className="input" value={form.email} onChange={handleChange} />
        <input name="phone" placeholder="Phone Number" className="input" value={form.phone} onChange={handleChange} />
        <input name="address" placeholder="Address" className="input" value={form.address} onChange={handleChange} />
        <input name="city" placeholder="City" className="input" value={form.city} onChange={handleChange} />
        <input name="state" placeholder="State" className="input" value={form.state} onChange={handleChange} />
        <input name="zip" placeholder="Zip Code" className="input" value={form.zip} onChange={handleChange} />
        <input name="cardNumber" placeholder="Card Number (16 digits)" className="input" value={form.cardNumber} onChange={handleChange} />
        <input name="expiryDate" type="month" className="input" value={form.expiryDate} onChange={handleChange} />
        <input name="cvv" placeholder="CVV" className="input" value={form.cvv} onChange={handleChange} />

        {error && <p className="col-span-2 text-red-500">{error}</p>}
        {success && <p className="col-span-2 text-green-600 font-semibold">{success}</p>}

        <button type="submit" disabled={loading} className="col-span-2 bg-indigo-600 text-white py-3 rounded-lg shadow hover:bg-indigo-700 transition">
          {loading ? 'Processing...' : `Pay $${total}`}
        </button>
      </form>

      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
        {cart.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between py-3 border-b gap-4">
            <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded-md" />
            <div className="flex-1">
              <p className="font-semibold">{item.title}</p>
              <p className="text-sm text-gray-500">{item.color}, {item.size} × {item.quantity}</p>
            </div>
            <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
          </div>
        ))}
        <p className="text-right font-bold text-lg mt-4">Total: ${total}</p>
      </div>
    </div>
  );
}

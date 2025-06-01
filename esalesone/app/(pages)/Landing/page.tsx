'use client';
import React, { useEffect, useState } from 'react';
import { useCart } from '../cart-context';

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
  variants: {
    colors: string[];
    sizes: string[];
  };
}

export default function LandingPage() {
  const { addToCart, cart } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<Record<number, {
    color: string;
    size: string;
    quantity: number;
  }>>({});

  useEffect(() => {
    fetch('https://mocki.io/v1/7fed707e-0db9-4a47-be28-a8bb877a3b24')
      .then((res) => res.json())
      .then((data: Product[]) => {
        setProducts(data);
        // Initialize selected options with first color, size and quantity 1
        const defaults: Record<number, { color: string; size: string; quantity: number }> = {};
        data.forEach((p) => {
          defaults[p.id] = {
            color: p.variants.colors[0],
            size: p.variants.sizes[0],
            quantity: 1,
          };
        });
        setSelectedOptions(defaults);
      });
  }, []);

  const handleAddToCart = (product: Product) => {
    const opts = selectedOptions[product.id];
    if (!opts) return; // safety check

    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      color: opts.color,
      size: opts.size,
      quantity: opts.quantity,
    });
    alert(`${product.title} added to cart!`);
  };

  // Prevent buttons overlapping: Cart button bottom-right, Checkout button bottom-left
  // Make CartPopup's button bottom-right and LandingPage Checkout button bottom-left

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-sky-50 to-pink-50 px-6 py-16 relative">
      <h1 className="max-w-4xl mx-auto text-center text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600 drop-shadow-lg select-none mb-20">
        ✨ Explore Our Best-Sellers
      </h1>

      <div className="max-w-7xl mx-auto grid gap-12 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <article
            key={product.id}
            className="bg-white rounded-3xl shadow-xl border hover:shadow-pink-300 hover:scale-[1.05] transition-transform duration-300 ease-out flex flex-col"
          >
            <div className="relative overflow-hidden rounded-t-3xl h-64 group">
              <img
                src={product.image}
                alt={product.title}
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute top-3 left-3 bg-pink-600 text-white text-xs font-semibold rounded-full px-3 py-1 shadow-lg">
                ${product.price.toFixed(2)}
              </div>
            </div>

            <div className="p-6 flex flex-col flex-grow">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{product.title}</h2>
              <p className="text-gray-600 text-sm mb-5">{product.description}</p>

              <div className="flex gap-3 mb-3">
                <select
                  className="flex-1 rounded-lg border px-3 py-2 shadow-sm"
                  value={selectedOptions[product.id]?.color || ''}
                  onChange={(e) =>
                    setSelectedOptions((prev) => ({
                      ...prev,
                      [product.id]: {
                        ...prev[product.id],
                        color: e.target.value,
                      },
                    }))
                  }
                >
                  {product.variants.colors.map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>

                <select
                  className="flex-1 rounded-lg border px-3 py-2 shadow-sm"
                  value={selectedOptions[product.id]?.size || ''}
                  onChange={(e) =>
                    setSelectedOptions((prev) => ({
                      ...prev,
                      [product.id]: {
                        ...prev[product.id],
                        size: e.target.value,
                      },
                    }))
                  }
                >
                  {product.variants.sizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-5 flex items-center gap-2">
                <button
                  onClick={() =>
                    setSelectedOptions((prev) => {
                      const q = prev[product.id]?.quantity || 1;
                      return {
                        ...prev,
                        [product.id]: {
                          ...prev[product.id],
                          quantity: Math.max(1, q - 1),
                        },
                      };
                    })
                  }
                  className="px-3 py-1 bg-gray-200 rounded text-lg select-none"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="font-semibold">{selectedOptions[product.id]?.quantity || 1}</span>
                <button
                  onClick={() =>
                    setSelectedOptions((prev) => {
                      const q = prev[product.id]?.quantity || 1;
                      return {
                        ...prev,
                        [product.id]: {
                          ...prev[product.id],
                          quantity: q + 1,
                        },
                      };
                    })
                  }
                  className="px-3 py-1 bg-gray-200 rounded text-lg select-none"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => handleAddToCart(product)}
                className="w-full bg-gradient-to-r from-indigo-600 to-pink-600 text-white font-semibold py-3 rounded-xl shadow-md hover:scale-105 transition"
              >
                Add to Cart 🛒
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Checkout button fixed bottom left */}
      <div className="fixed bottom-6 left-6 z-50">
        <button
          onClick={() => (window.location.href = '/checkout')}
          className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-full font-semibold shadow-lg"
        >
          🧾 Go to Checkout
        </button>
      </div>
    </div>
  );
}

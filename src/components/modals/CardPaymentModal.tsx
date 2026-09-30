"use client";

import { useState } from "react";

interface CardModalProps {
  amount: number;
  onClose: () => void;
  onSubmit: (cardDetails: any) => void;
  isLoading: boolean;
}

export default function CardPaymentModal({
  amount,
  onClose,
  onSubmit,
  isLoading,
}: CardModalProps) {
  const [cardDetails, setCardDetails] = useState({
    number: "",
    name: "",
    expiry: "",
    cvc: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add simple validation here if needed
    if (
      cardDetails.number &&
      cardDetails.name &&
      cardDetails.expiry &&
      cardDetails.cvc
    ) {
      onSubmit(cardDetails);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md m-4">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex justify-between items-center border-b pb-3 mb-4">
            <h3 className="text-xl font-semibold text-gray-800">
              Pay with Card
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-3xl leading-none"
            >
              &times;
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Card Number
              </label>
              <input
                type="text"
                name="number"
                value={cardDetails.number}
                onChange={handleChange}
                placeholder="0000 0000 0000 0000"
                className="w-full mt-1 border px-3 py-2 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name on Card
              </label>
              <input
                type="text"
                name="name"
                value={cardDetails.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full mt-1 border px-3 py-2 rounded-md"
                required
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">
                  Expiry (MM/YY)
                </label>
                <input
                  type="text"
                  name="expiry"
                  value={cardDetails.expiry}
                  onChange={handleChange}
                  placeholder="MM/YY"
                  className="w-full mt-1 border px-3 py-2 rounded-md"
                  required
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">
                  CVC
                </label>
                <input
                  type="text"
                  name="cvc"
                  value={cardDetails.cvc}
                  onChange={handleChange}
                  placeholder="123"
                  className="w-full mt-1 border px-3 py-2 rounded-md"
                  required
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 px-4 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={true}
              className="w-full flex items-center justify-center py-3 px-4 rounded-md bg-slate-800 text-white font-semibold hover:bg-slate-700 disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
              {isLoading ? "Processing..." : `Pay ৳${amount.toFixed(2)}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

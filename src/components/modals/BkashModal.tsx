"use client";

import { useState } from "react";
import Image from "next/image";

interface BkashModalProps {
  amount: number;
  onClose: () => void;
  onSubmit: (transactionId: string) => void;
  isLoading: boolean;
}

export default function BkashModal({
  amount,
  onClose,
  onSubmit,
  isLoading,
}: BkashModalProps) {
  const [transactionId, setTransactionId] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (transactionId.trim()) {
      onSubmit(transactionId);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md m-4">
        <div className="p-6">
          <div className="flex justify-between items-center border-b pb-3 mb-4">
            <h3 className="text-xl font-semibold text-gray-800">
              Bkash Payment
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-3xl leading-none"
            >
              &times;
            </button>
          </div>

          <div className="flex flex-col items-center text-center">
            <Image src="/bkash.png" alt="Bkash Logo" width={120} height={120} />
            <span className="font-bold text-lg text-[#e2136e]">
              ৳{amount.toFixed(2)}
            </span>
            {/* <p className="text-gray-600 mt-4">
              Please send{" "}
              <span className="font-bold text-lg text-[#e2136e]">
                ৳{amount.toFixed(2)}
              </span>{" "}
              to our Bkash merchant number:
            </p> */}
            <p className="font-semibold my-2 bg-gray-100 px-4 py-2 rounded-md">
              Maven Zone Bkash Merchant Number
            </p>
            {/* <p className="text-sm text-gray-500">
              (Use the &quot;Payment&quot; option in your Bkash app)
            </p> */}
          </div>

          <form onSubmit={handleSubmit} className="mt-6">
            <div>
              <label
                htmlFor="transactionId"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Enter your Phone Number
              </label>
              <input
                type="text"
                id="transactionId"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="e.g., 01817-280895"
                className="w-full border px-4 py-2 rounded-md focus:ring-2 focus:ring-[#e2136e]"
                required
              />
            </div>
            <div className="mt-6 flex gap-4">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 px-4 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={true}
                className="w-full flex items-center justify-center py-2 px-4 rounded-md bg-[#e2136e] text-white font-semibold hover:bg-[#d01164] disabled:bg-pink-200 disabled:cursor-not-allowed"
              >
                {isLoading ? "Verifying..." : "Confirm Payment"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

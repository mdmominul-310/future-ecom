"use client";

import React from "react";
import { Check, Loader, Truck, Home, XCircle } from "lucide-react";

// The defined sequence of order statuses
const STATUS_SEQUENCE = ["Pending", "Processing", "Shipped", "Delivered"];

const OrderStatusTracker = ({ currentStatus }: { currentStatus: string }) => {
  // Correct a common typo ("Shiped") to ensure the tracker works correctly
  const correctedStatus =
    currentStatus === "Shiped" ? "Shipped" : currentStatus;
  const currentIndex = STATUS_SEQUENCE.indexOf(correctedStatus);

  // Handle the "Cancelled" state separately
  if (correctedStatus === "Cancelled") {
    return (
      <div className="flex items-center gap-3 p-2 text-red-600 bg-red-50 rounded-md">
        <XCircle size={24} />
        <div className="text-left">
          <p className="font-semibold text-sm">Order Cancelled</p>
          <p className="text-xs">This order will not be fulfilled.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-start justify-between">
        {STATUS_SEQUENCE.map((status, index) => {
          const isCompleted = currentIndex > index;
          const isCurrent = currentIndex === index;

          const getIcon = () => {
            if (isCompleted) return <Check className="h-5 w-5" />;
            if (isCurrent) return <Loader className="h-5 w-5 animate-spin" />;
            switch (status) {
              case "Shipped":
                return <Truck className="h-5 w-5" />;
              case "Delivered":
                return <Home className="h-5 w-5" />;
              default:
                return <div className="h-3 w-3 rounded-full bg-gray-300" />;
            }
          };

          const iconColor =
            isCompleted || isCurrent
              ? "bg-orange-500 text-white"
              : "bg-gray-200 text-gray-500";
          const textColor =
            isCompleted || isCurrent ? "text-orange-600" : "text-gray-400";
          const lineColor = isCompleted
            ? "border-orange-500"
            : "border-gray-300";

          return (
            <React.Fragment key={status}>
              {/* Status Step */}
              <div className="flex flex-col items-center text-center w-20">
                <div
                  className={`flex items-center justify-center h-10 w-10 rounded-full ${iconColor} transition-colors`}
                >
                  {getIcon()}
                </div>
                <p
                  className={`mt-2 text-xs font-bold ${textColor} transition-colors`}
                >
                  {status}
                </p>
              </div>

              {/* Connecting Line */}
              {index < STATUS_SEQUENCE.length - 1 && (
                <div
                  className={`flex-auto border-t-2 mt-5 ${lineColor} transition-colors`}
                ></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default OrderStatusTracker;

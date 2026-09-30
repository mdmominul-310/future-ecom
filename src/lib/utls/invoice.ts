interface Customer {
  name: string;
  address?: string;
  email?: string; // Optional field
  phone?: string; // Optional field
}

interface CartItem {
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  createdAt: Date | string;
  customer: Customer;
  cartItems: CartItem[];
  subTotal: number;
  deliveryCharge: number;
  totalAmount: number;
  advanceAmount?: number;
  paymentMethod: string;
}

export function generateInvoice(order: Order) {
  const due = order.totalAmount - (order.advanceAmount || 0);

  return {
    invoiceNumber: `INV-${new Date(order.createdAt)
      .toISOString()
      .split("T")[0]
      .replace(/-/g, "")}-${order._id.toString().slice(-3)}`,
    date: new Date(order.createdAt).toISOString().split("T")[0],
    customer: {
      name: order.customer.name,
      address: order.customer.address,
      phone: order.customer.phone || "", // Optional field
      email: order.customer.email || "", // Optional field
    },
    items: order.cartItems.map((item, index) => ({
      sl: index + 1,
      description: item.name,
      price: item.price.toFixed(2),
      qty: item.quantity,
      total: (item.price * item.quantity).toFixed(2),
    })),
    subTotal: order.subTotal,
    DeliveryCharge: order.deliveryCharge,
    totalAmount: order.totalAmount.toFixed(2),
    advanceAmount: order.advanceAmount || 0,
    dueAmount: due.toFixed(2),
    paymentMethod: order.paymentMethod,
    contact: {
      phone: "+880 1974-003819",
      address: "Dhaka, Bangladesh",
      website: "https://futgensoft.com",
    },
    footerMessage:
      "Thank you for shopping at Future com! Powered by Futgensoft.",
    companyTagline: "Your Premier Online General Store",
  };
}

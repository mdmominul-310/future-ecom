import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import mongoose from "mongoose";

// Import Product model
import "@/models/Product";

// Helper function to calculate dates for filtering
const getDateRanges = () => {
  const now = new Date();

  // Today (start of day to now)
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);

  // This week (start of week to now)
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
  weekStart.setHours(0, 0, 0, 0);

  // This month (start of month to now)
  const monthStart = new Date(now);
  monthStart.setDate(1); // Start of month
  monthStart.setHours(0, 0, 0, 0);

  return {
    today: { $gte: todayStart, $lte: now },
    week: { $gte: weekStart, $lte: now },
    month: { $gte: monthStart, $lte: now },
  };
};

// Define types for order and cart items
interface ProductType {
  _id: string;
  name: string;
  price: number;
  buyPrice?: number;
  costPerProduct?: number;
  [key: string]: any;
}

interface CartItemType {
  productId: ProductType | string;
  quantity: number;
  price: number;
  [key: string]: any;
}

interface OrderType {
  _id: string;
  totalAmount: number;
  totalItems: number;
  cartItems: CartItemType[];
  createdAt: Date;
  [key: string]: any;
}

export async function GET() {
  try {
    await connectDB();

    // First ensure the Product model is registered by mongoose
    try {
      // Check if Product model exists, if not it will throw an error
      mongoose.model("Product");
    } catch (error) {
      console.log(error);
      // If error, import the Product model directly
      await import("@/models/Product");
    }

    // Get date ranges for filtering
    // const dateRanges = getDateRanges();

    // Fetch all orders with populated product data
    const ordersData = await Order.find({})
      .populate({
        path: "cartItems.productId",
        model: "Product",
      })
      .lean();

    // Safe type conversion
    const orders = ordersData as unknown as OrderType[];

    if (!orders || orders.length === 0) {
      return NextResponse.json({
        success: true,
        totalSales: 0,
        totalOrders: 0,
        totalRevenue: 0,
        totalCost: 0,
        profit: 0,
        profitPercentage: 0,
        dailyStats: { totalSales: 0, totalOrders: 0, profit: 0 },
        weeklyStats: { totalSales: 0, totalOrders: 0, profit: 0 },
        monthlyStats: { totalSales: 0, totalOrders: 0, profit: 0 },
      });
    }

    // Calculate total sales metrics
    const calculateMetrics = (ordersList: OrderType[]) => {
      const totalOrders = ordersList.length;
      const totalRevenue = ordersList.reduce(
        (total: number, order: OrderType) => total + (order.totalAmount || 0),
        0
      );

      // Calculate total cost from cart items
      let totalCost = 0;
      ordersList.forEach((order: OrderType) => {
        if (order.cartItems && Array.isArray(order.cartItems)) {
          order.cartItems.forEach((item: CartItemType) => {
            const product = item.productId as ProductType;
            const quantity = item.quantity || 0;

            // Use product's buyPrice and costPerProduct if available
            if (product && typeof product === "object") {
              const buyPrice = product.buyPrice || 0;
              const costPerProduct = product.costPerProduct || 0;
              totalCost += (buyPrice + costPerProduct) * quantity;
            }
          });
        }
      });

      const profit = totalRevenue - totalCost;
      const profitPercentage =
        totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;

      return {
        totalOrders,
        totalRevenue,
        totalCost,
        profit,
        profitPercentage: parseFloat(profitPercentage.toFixed(2)),
      };
    };

    // Calculate stats for different time periods
    const dailyOrders = orders.filter((order: OrderType) => {
      const orderDate = new Date(order.createdAt);
      const today = new Date();
      return (
        orderDate.getDate() === today.getDate() &&
        orderDate.getMonth() === today.getMonth() &&
        orderDate.getFullYear() === today.getFullYear()
      );
    });

    const weeklyOrders = orders.filter((order: OrderType) => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= getDateRanges().week.$gte;
    });

    const monthlyOrders = orders.filter((order: OrderType) => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= getDateRanges().month.$gte;
    });

    // Calculate metrics for all time periods
    const allTimeMetrics = calculateMetrics(orders);
    const dailyMetrics = calculateMetrics(dailyOrders);
    const weeklyMetrics = calculateMetrics(weeklyOrders);
    const monthlyMetrics = calculateMetrics(monthlyOrders);

    return NextResponse.json({
      success: true,
      totalSales: allTimeMetrics.totalRevenue,
      totalOrders: allTimeMetrics.totalOrders,
      totalRevenue: allTimeMetrics.totalRevenue,
      totalCost: allTimeMetrics.totalCost,
      profit: allTimeMetrics.profit,
      profitPercentage: allTimeMetrics.profitPercentage,
      dailyStats: {
        totalSales: dailyMetrics.totalRevenue,
        totalOrders: dailyMetrics.totalOrders,
        profit: dailyMetrics.profit,
      },
      weeklyStats: {
        totalSales: weeklyMetrics.totalRevenue,
        totalOrders: weeklyMetrics.totalOrders,
        profit: weeklyMetrics.profit,
      },
      monthlyStats: {
        totalSales: monthlyMetrics.totalRevenue,
        totalOrders: monthlyMetrics.totalOrders,
        profit: monthlyMetrics.profit,
      },
    });
  } catch (error: any) {
    console.error("Error fetching revenue overview:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

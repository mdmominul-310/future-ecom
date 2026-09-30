import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import mongoose from "mongoose";

// Import Product model
import "@/models/Product";

interface TimeRangeParams {
  [key: string]: {
    current: { start: Date; end: Date };
    previous: { start: Date; end: Date };
  };
}

export async function GET(request: Request) {
  try {
    await connectDB();

    // Extract filter from URL query parameters
    const url = new URL(request.url);
    const period = url.searchParams.get("period") || "month";

    // Define time ranges based on the filter period
    const timeRanges: TimeRangeParams = getTimeRanges();
    const { current, previous } = timeRanges[period];

    // Ensure the Product model is registered
    try {
      mongoose.model("Product");
    } catch (error) {
      console.log(error);
      await import("@/models/Product");
    }

    // Metrics for current period
    const currentMetrics = await calculateMetrics(current.start, current.end);

    // Metrics for previous period
    const previousMetrics = await calculateMetrics(
      previous.start,
      previous.end
    );

    // Calculate percent changes between periods
    const percentChanges = {
      revenue: calculatePercentChange(
        previousMetrics.revenue,
        currentMetrics.revenue
      ),
      cost: calculatePercentChange(previousMetrics.cost, currentMetrics.cost),
      profit: calculatePercentChange(
        previousMetrics.profit,
        currentMetrics.profit
      ),
      cancelledOrders: calculatePercentChange(
        previousMetrics.cancelledOrders,
        currentMetrics.cancelledOrders
      ),
    };

    return NextResponse.json({
      success: true,
      period,
      metrics: {
        revenue: {
          value: currentMetrics.revenue,
          percentChange: percentChanges.revenue.value,
          trend: percentChanges.revenue.trend,
        },
        cost: {
          value: currentMetrics.cost,
          percentChange: percentChanges.cost.value,
          trend: percentChanges.cost.trend,
        },
        profit: {
          value: currentMetrics.profit,
          percentChange: percentChanges.profit.value,
          trend: percentChanges.profit.trend,
        },
        cancelledOrders: {
          value: currentMetrics.cancelledOrders,
          percentChange: percentChanges.cancelledOrders.value,
          trend: percentChanges.cancelledOrders.trend,
        },
      },
    });
  } catch (error: any) {
    console.error("Error fetching overview data:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// Helper function to calculate percent change
function calculatePercentChange(previous: number, current: number) {
  if (previous === 0) return { value: 0, trend: "neutral" as const };

  const change = ((current - previous) / previous) * 100;
  return {
    value: parseFloat(Math.abs(change).toFixed(1)),
    trend: change >= 0 ? ("up" as const) : ("down" as const),
  };
}

// Helper function to define time ranges based on period
function getTimeRanges(): TimeRangeParams {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Day: today vs yesterday
  const dayStart = new Date(today);
  const yesterdayStart = new Date(today);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);
  const yesterdayEnd = new Date(today);

  // Week: this week vs last week
  const thisWeekStart = new Date(today);
  thisWeekStart.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
  const lastWeekStart = new Date(thisWeekStart);
  lastWeekStart.setDate(lastWeekStart.getDate() - 7);
  const lastWeekEnd = new Date(thisWeekStart);
  lastWeekEnd.setMilliseconds(-1);

  // Month: this month vs last month
  const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastMonthStart = new Date(
    today.getMonth() === 0 ? today.getFullYear() - 1 : today.getFullYear(),
    today.getMonth() === 0 ? 11 : today.getMonth() - 1,
    1
  );
  const lastMonthEnd = new Date(thisMonthStart);
  lastMonthEnd.setMilliseconds(-1);

  return {
    day: {
      current: { start: dayStart, end: now },
      previous: { start: yesterdayStart, end: yesterdayEnd },
    },
    week: {
      current: { start: thisWeekStart, end: now },
      previous: { start: lastWeekStart, end: lastWeekEnd },
    },
    month: {
      current: { start: thisMonthStart, end: now },
      previous: { start: lastMonthStart, end: lastMonthEnd },
    },
  };
}

// Helper function to calculate metrics
async function calculateMetrics(startDate: Date, endDate: Date) {
  // Get all delivered orders within the time range for revenue calculations
  const deliveredOrders = await Order.find({
    createdAt: { $gte: startDate, $lte: endDate },
    status: "Delivered", // Only count delivered orders for revenue
  })
    .populate({
      path: "cartItems.productId",
      model: "Product",
    })
    .lean();

  // Count cancelled orders
  const cancelledOrders = await Order.countDocuments({
    createdAt: { $gte: startDate, $lte: endDate },
    status: "Cancelled",
  });

  // Calculate revenue, cost and profit from delivered orders only
  let revenue = 0;
  let cost = 0;

  for (const order of deliveredOrders) {
    revenue += order.totalAmount || 0;

    // Calculate cost based on product buyPrice and costPerProduct
    if (order.cartItems && Array.isArray(order.cartItems)) {
      for (const item of order.cartItems) {
        const product = item.productId;
        const quantity = item.quantity || 0;

        if (product && typeof product === "object") {
          const buyPrice = product.buyPrice || 0;
          const costPerProduct = product.costPerProduct || 0;
          cost += (buyPrice + costPerProduct) * quantity;
        }
      }
    }
  }

  const profit = revenue - cost;

  return {
    revenue,
    cost,
    profit,
    cancelledOrders,
  };
}

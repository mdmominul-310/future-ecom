import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import Product from "@/models/Product";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const filter = req.nextUrl.searchParams.get("filter") || "month";
    const today = new Date();
    let currentStart: Date, previousStart: Date, previousEnd: Date;

    switch (filter.toLowerCase()) {
      case "day":
        currentStart = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate()
        );
        previousStart = new Date(currentStart);
        previousStart.setDate(currentStart.getDate() - 1);
        previousEnd = new Date(currentStart);
        break;
      case "week":
        currentStart = new Date(today);
        currentStart.setDate(today.getDate() - today.getDay());
        previousStart = new Date(currentStart);
        previousStart.setDate(currentStart.getDate() - 7);
        previousEnd = new Date(currentStart);
        break;
      default: // "month"
        currentStart = new Date(today.getFullYear(), today.getMonth(), 1);
        previousStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        previousEnd = new Date(today.getFullYear(), today.getMonth(), 1);
    }

    // Orders Count
    const totalOrders = await Order.countDocuments({ status: "Delivered" });
    const totalAllOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({
      status: { $in: ["Pending", "Processing"] },
    });

    // Total Products in Catalog
    const totalProducts = await Product.countDocuments().catch(() => 0);

    // Revenue Aggregation
    const revenueAgg = await Order.aggregate([
      { $match: { status: "Delivered" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;

    // Period Revenue
    const currentRevenueAgg = await Order.aggregate([
      { $match: { createdAt: { $gte: currentStart }, status: "Delivered" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);
    const previousRevenueAgg = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: previousStart, $lt: previousEnd },
          status: "Delivered",
        },
      },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    const currentRevenue = currentRevenueAgg[0]?.total || 0;
    const previousRevenue = previousRevenueAgg[0]?.total || 0;
    const revenueGrowthPercent =
      previousRevenue > 0
        ? ((currentRevenue - previousRevenue) / previousRevenue) * 100
        : currentRevenue > 0
        ? 100
        : 0;

    // Customers
    const uniqueCustomers = await Order.aggregate([
      { $match: { status: "Delivered" } },
      { $group: { _id: "$customer.email" } },
      { $count: "total" },
    ]);
    const customerCount =
      uniqueCustomers.length > 0 ? uniqueCustomers[0].total : 0;

    const currentOrders = await Order.countDocuments({
      createdAt: { $gte: currentStart },
      status: "Delivered",
    });

    const previousOrders = await Order.countDocuments({
      createdAt: { $gte: previousStart, $lt: previousEnd },
      status: "Delivered",
    });

    const orderGrowthPercent =
      previousOrders > 0
        ? ((currentOrders - previousOrders) / previousOrders) * 100
        : currentOrders > 0
        ? 100
        : 0;

    const currentCustomers = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: currentStart },
          status: "Delivered",
        },
      },
      {
        $group: { _id: "$customer.email" },
      },
      {
        $count: "total",
      },
    ]);

    const previousCustomers = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: previousStart, $lt: previousEnd },
          status: "Delivered",
        },
      },
      {
        $group: { _id: "$customer.email" },
      },
      {
        $count: "total",
      },
    ]);

    const thisCustomerCount = currentCustomers[0]?.total || 0;
    const lastCustomerCount = previousCustomers[0]?.total || 0;

    const customerGrowthPercent =
      lastCustomerCount > 0
        ? ((thisCustomerCount - lastCustomerCount) / lastCustomerCount) * 100
        : thisCustomerCount > 0
        ? 100
        : 0;

    return NextResponse.json({
      success: true,
      totalRevenue,
      totalCustomers: customerCount,
      totalOrders,
      totalAllOrders,
      pendingOrders,
      totalProducts,
      revenueGrowth: {
        percent: parseFloat(Math.abs(revenueGrowthPercent).toFixed(2)),
        trend: revenueGrowthPercent >= 0 ? "up" : "down",
      },
      customerGrowth: {
        percent: parseFloat(Math.abs(customerGrowthPercent).toFixed(2)),
        trend: customerGrowthPercent >= 0 ? "up" : "down",
      },
      orderGrowth: {
        percent: parseFloat(Math.abs(orderGrowthPercent).toFixed(2)),
        trend: orderGrowthPercent >= 0 ? "up" : "down",
      },
    });
  } catch (error: any) {
    console.error("Error fetching metrics stats:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/mongodb";
// import { Order } from "@/models/Order";
// // import mongoose from "mongoose";

// export async function GET() {
//   try {
//     await connectDB();

//     // Get total order count (only delivered orders)
//     const totalOrders = await Order.countDocuments({ status: "Delivered" });

//     // Get unique customer count (for delivered orders only)
//     const uniqueCustomers = await Order.aggregate([
//       {
//         $match: {
//           status: "Delivered",
//         },
//       },
//       {
//         $group: {
//           _id: "$customer.email",
//           count: { $sum: 1 },
//         },
//       },
//       {
//         $group: {
//           _id: null,
//           total: { $sum: 1 },
//         },
//       },
//     ]);

//     const customerCount =
//       uniqueCustomers.length > 0 ? uniqueCustomers[0].total : 0;

//     // Get order count from previous month for comparison (delivered orders only)
//     const today = new Date();
//     const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
//     const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

//     const lastMonthOrders = await Order.countDocuments({
//       createdAt: { $gte: lastMonth, $lt: thisMonth },
//       status: "Delivered",
//     });

//     const thisMonthOrders = await Order.countDocuments({
//       createdAt: { $gte: thisMonth },
//       status: "Delivered",
//     });

//     // Calculate change percentages
//     const orderChangePercent =
//       lastMonthOrders > 0
//         ? ((thisMonthOrders - lastMonthOrders) / lastMonthOrders) * 100
//         : 0;

//     // For customer growth, use a placeholder for now (getting exact customer growth would require tracking customers by month)
//     // Here we'll use the same calculation as orders for delivered orders
//     const lastMonthCustomers = await Order.aggregate([
//       {
//         $match: {
//           createdAt: { $gte: lastMonth, $lt: thisMonth },
//           status: "Delivered",
//         },
//       },
//       {
//         $group: {
//           _id: "$customer.email",
//         },
//       },
//       {
//         $count: "total",
//       },
//     ]);

//     const thisMonthCustomers = await Order.aggregate([
//       {
//         $match: {
//           createdAt: { $gte: thisMonth },
//           status: "Delivered",
//         },
//       },
//       {
//         $group: {
//           _id: "$customer.email",
//         },
//       },
//       {
//         $count: "total",
//       },
//     ]);

//     const lastMonthCustomerCount =
//       lastMonthCustomers.length > 0 ? lastMonthCustomers[0].total : 0;
//     const thisMonthCustomerCount =
//       thisMonthCustomers.length > 0 ? thisMonthCustomers[0].total : 0;

//     const customerGrowthPercent =
//       lastMonthCustomerCount > 0
//         ? ((thisMonthCustomerCount - lastMonthCustomerCount) /
//             lastMonthCustomerCount) *
//           100
//         : 0;

//     return NextResponse.json({
//       success: true,
//       totalCustomers: customerCount,
//       totalOrders: totalOrders,
//       customerGrowth: {
//         percent: parseFloat(Math.abs(customerGrowthPercent).toFixed(2)),
//         trend: customerGrowthPercent >= 0 ? "up" : "down",
//       },
//       orderGrowth: {
//         percent: parseFloat(Math.abs(orderChangePercent).toFixed(2)),
//         trend: orderChangePercent >= 0 ? "up" : "down",
//       },
//     });
//   } catch (error: any) {
//     console.error("Error fetching metrics stats:", error);
//     return NextResponse.json(
//       { success: false, message: error.message },
//       { status: 500 }
//     );
//   }
// }

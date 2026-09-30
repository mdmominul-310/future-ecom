import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import MonthlyTarget from "@/models/MontlyTargetModel";

export async function GET() {
  try {
    await connectDB();

    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const monthStart = new Date(currentYear, currentMonth, 1);
    const monthEnd = new Date(currentYear, currentMonth + 1, 0);

    // 🟡 Fetch target from DB or create default if not exists
    let targetData = await MonthlyTarget.findOne();
    if (!targetData) {
      targetData = await MonthlyTarget.create({ target: 0 });
    }
    const monthlyTarget = targetData.target;

    // 🔵 Current Month Revenue
    const result = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: monthStart, $lte: monthEnd },
          status: "Delivered",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
          orderCount: { $sum: 1 },
        },
      },
    ]);

    // 🔵 Today's Revenue
    const dayStart = new Date(today.setHours(0, 0, 0, 0));
    const dayEnd = new Date(today.setHours(23, 59, 59, 999));

    const todayResult = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: dayStart, $lte: dayEnd },
          status: "Delivered",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
          orderCount: { $sum: 1 },
        },
      },
    ]);

    // 🔵 Previous Month Revenue (partial match to same date range)
    const prevMonthStart = new Date(currentYear, currentMonth - 1, 1);
    const prevMonthEnd = new Date(currentYear, currentMonth, 0);

    const dayOfMonth = Math.min(today.getDate(), prevMonthEnd.getDate());
    const prevMonthPartialEnd = new Date(prevMonthStart);
    prevMonthPartialEnd.setDate(dayOfMonth);

    const currentMonthPartialEnd = new Date(monthStart);
    currentMonthPartialEnd.setDate(dayOfMonth);

    const partialCurrentResult = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: monthStart, $lte: currentMonthPartialEnd },
          status: "Delivered",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
    ]);

    const partialPrevResult = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: prevMonthStart, $lte: prevMonthPartialEnd },
          status: "Delivered",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
    ]);

    // 🟢 Calculate values
    const currentRevenue = result.length > 0 ? result[0].totalRevenue : 0;
    const todayRevenue =
      todayResult.length > 0 ? todayResult[0].totalRevenue : 0;
    const partialCurrentRevenue = partialCurrentResult[0]?.totalRevenue || 0;
    const partialPrevRevenue = partialPrevResult[0]?.totalRevenue || 0;

    const progressPercentage = monthlyTarget
      ? (currentRevenue / monthlyTarget) * 100
      : 0;

    let percentChange = 0;
    if (partialPrevRevenue > 0) {
      percentChange =
        ((partialCurrentRevenue - partialPrevRevenue) / partialPrevRevenue) *
        100;
    }

    return NextResponse.json({
      success: true,
      data: {
        target: monthlyTarget,
        currentRevenue,
        todayRevenue,
        progressPercentage: parseFloat(progressPercentage.toFixed(2)),
        percentChange: parseFloat(percentChange.toFixed(2)),
        trend: percentChange >= 0 ? "up" : "down",
      },
    });
  } catch (error: any) {
    console.error("Error fetching monthly target data:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

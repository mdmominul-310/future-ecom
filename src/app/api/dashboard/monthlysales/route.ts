import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // Get year from query, default to current year
    const { searchParams } = new URL(req.url);
    const yearParam = searchParams.get("year");
    const targetYear = yearParam
      ? parseInt(yearParam)
      : new Date().getFullYear();

    const monthlySales = [];

    for (let month = 0; month < 12; month++) {
      const startDate = new Date(targetYear, month, 1);
      const endDate = new Date(targetYear, month + 1, 0, 23, 59, 59, 999);

      const result = await Order.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate },
            status: "Delivered",
          },
        },
        {
          $group: {
            _id: null,
            totalSales: { $sum: "$totalAmount" },
            orderCount: { $sum: 1 },
          },
        },
      ]);

      monthlySales.push({
        month: month + 1,
        sales: result.length > 0 ? result[0].totalSales || 0 : 0,
        orders: result.length > 0 ? result[0].orderCount || 0 : 0,
      });
    }

    return NextResponse.json({
      success: true,
      data: monthlySales,
      year: targetYear,
    });
  } catch (error: any) {
    console.error("Error fetching monthly sales data:", error);
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

//     // Get sales data for each month of the current year
//     const currentYear = new Date().getFullYear();
//     const monthlySales = [];

//     // For each month (0-11), get aggregate sales data
//     for (let month = 0; month < 12; month++) {
//       const startDate = new Date(currentYear, month, 1);
//       const endDate = new Date(currentYear, month + 1, 0);

//       const result = await Order.aggregate([
//         {
//           $match: {
//             createdAt: { $gte: startDate, $lte: endDate },
//             status: "Delivered", // Only count delivered orders
//           },
//         },
//         {
//           $group: {
//             _id: null,
//             totalSales: { $sum: "$totalAmount" },
//             orderCount: { $sum: 1 },
//           },
//         },
//       ]);

//       // Add results to the monthlySales array
//       monthlySales.push({
//         month: month + 1,
//         sales: result.length > 0 ? result[0].totalSales || 0 : 0,
//         orders: result.length > 0 ? result[0].orderCount || 0 : 0,
//       });
//     }

//     // Return the monthly sales data
//     return NextResponse.json({
//       success: true,
//       data: monthlySales,
//       year: currentYear,
//     });
//   } catch (error: any) {
//     console.error("Error fetching monthly sales data:", error);
//     return NextResponse.json(
//       { success: false, message: error.message },
//       { status: 500 }
//     );
//   }
// }

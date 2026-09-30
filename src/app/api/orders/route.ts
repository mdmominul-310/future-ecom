// api/orders/route.ts

import { auth } from "@/auth";
import { sendEmail } from "@/lib/mail/email";
import { connectDB } from "@/lib/mongodb";
import { generateInvoice } from "@/lib/utls/invoice";
import { Order } from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

// GET /api/orders (with pagination and search fix)
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return new Response("Unauthorized", { status: 401 });
  }
  await connectDB();

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search")?.toLowerCase() || "";
  const status = searchParams.get("status") || "";
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  // Pagination parameters
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = 20; // Orders per page
  const skip = (page - 1) * limit;

  const query: any = {};

  if (search) {
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(search);
    query.$or = [
      { orderNumber: { $regex: search, $options: "i" } },
      { "customer.name": { $regex: search, $options: "i" } },
      { "customer.phone": { $regex: search, $options: "i" } },
    ];
    // Correctly search by _id if the search string is a valid ObjectId
    if (isObjectId) {
      query.$or.push({ _id: search });
    }
  }

  if (status && status !== "All") {
    query.status = status;
  }

  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) {
      query.createdAt.$gte = new Date(startDate);
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      query.createdAt.$lte = end;
    }
  }

  try {
    // Get total count for pagination metadata
    const totalOrders = await Order.countDocuments(query);
    const totalPages = Math.ceil(totalOrders / limit);

    // Fetch the paginated orders
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const result = orders.map((order: any) => ({
      order,
      invoice: generateInvoice(order),
    }));

    // Return the structured response
    return NextResponse.json({
      orders: result,
      totalOrders,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching orders", error },
      { status: 500 }
    );
  }
}

// POST /api/orders (with your complete, original code)
export async function POST(req: Request) {
  await connectDB();

  try {
    const body = await req.json();

    // Sanitize data
    const sanitizedData = {
      ...body,
      advanceAmount:
        body.paymentMethod === "Cash On Delivery" ? 0 : body.advanceAmount || 0,
      ...(body.userId && { userId: body.userId }),
    };

    // Create the order
    const newOrder = await Order.create(sanitizedData);

    const invoiceData = generateInvoice(newOrder);

    // 🔁 Update soldCount of each product
    for (const item of newOrder.cartItems) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { soldCount: item.quantity } },
        { new: true }
      );
    }

    // 📩 Notify admins via email
    const adminUsers = await User.find({ role: "admin" });

    for (const admin of adminUsers) {
      await sendEmail({
        to: admin.email,
        subject: "🛒 New Order Created",
        html: `<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>🛒 New Order Notification</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    /* Base Styles */
    body {
      margin: 0;
      padding: 0;
      width: 100% !important;
      -webkit-font-smoothing: antialiased;
      font-family: 'Inter', Arial, sans-serif;
      background-color: #f4f4f7;
      color: #333;
    }
    table {
      border-collapse: collapse;
    }
    a {
      color: #3498db;
      text-decoration: none;
    }

    /* Main Wrapper */
    .wrapper {
      width: 100%;
      background-color: #f4f4f7;
      padding: 20px 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid #e0e0e0;
    }

    /* Header */
    .header {
      background-color: #2c3e50;
      color: #ffffff;
      padding: 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
    }

    /* Content */
    .content {
      padding: 30px;
    }
    .content h2 {
      color: #2c3e50;
      font-size: 20px;
      margin-top: 0;
      margin-bottom: 20px;
    }
    .content p {
      margin: 0 0 15px;
      line-height: 1.6;
    }

    /* Order Details Table */
    .order-details {
      width: 100%;
      margin: 20px 0;
    }
    .order-details td {
      padding: 12px;
      border-bottom: 1px solid #eeeeee;
      vertical-align: top;
    }
    .order-details td.label {
      font-weight: 600;
      color: #555;
      width: 150px;
    }

    /* Items List */
    .items-list-title {
      color: #2c3e50;
      font-size: 18px;
      margin-top: 30px;
      margin-bottom: 15px;
      border-top: 1px solid #e0e0e0;
      padding-top: 20px;
    }
    .item {
      display: block;
      width: 100%;
      padding: 15px 0;
      border-bottom: 1px solid #eeeeee;
    }
    .item-image {
      width: 80px;
      height: 80px;
      border-radius: 6px;
      margin-right: 15px;
    }
    .item-details p {
      margin: 0 0 5px;
    }
    .item-details .item-name {
      font-weight: 600;
      font-size: 16px;
    }

    /* Button */
    .button-container {
      text-align: left;
      margin-top: 25px;
    }
    .button {
      display: inline-block;
      padding: 12px 25px;
      background-color: #ff7f50; /* Coral/Orange */
      color: #ffffff !important; /* Important for email client compatibility */
      text-decoration: none;
      border-radius: 5px;
      font-weight: 600;
      text-align: center;
    }

    /* Footer */
    .footer {
      text-align: left;
      padding: 20px 30px;
      font-size: 14px;
      color: #555555;
      line-height: 1.6;
      border-top: 1px solid #e0e0e0;
      margin-top: 20px;
    }
    .footer p {
      margin: 0;
    }

    /* Responsive Styles */
    @media screen and (max-width: 600px) {
      .content {
        padding: 20px;
      }
      .footer {
        padding: 20px;
      }
      .item {
        display: table;
        width: 100%;
      }
      .item-image-cell, .item-details {
        display: table-cell;
        vertical-align: top;
      }
      .item-image-cell {
        width: 95px; /* image width + margin */
      }
    }
  </style>
</head>
<body>
  <div class="wrapper" style="width: 100%; background-color: #f4f4f7; padding: 20px 0;">
    <table class="container" width="600" align="center" cellpadding="0" cellspacing="0" role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e0e0e0;">
      <tr>
        <td class="header" style="background-color: #2c3e50; color: #ffffff; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px; font-weight: 700;">📦 New Order Received</h1>
        </td>
      </tr>
      <tr>
        <td class="content" style="padding: 30px;">
          <h2 style="color: #2c3e50; font-size: 20px; margin-top: 0; margin-bottom: 20px;">Assalamualaikum dear, ${
            admin.firstName || "Admin"
          },</h2>
          <p style="margin: 0 0 15px; line-height: 1.6;">A new order has just been placed. Here are the details:</p>

          <table class="order-details" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="width: 100%; margin: 20px 0;">
            <tr>
              <td class="label" style="padding: 12px; border-bottom: 1px solid #eeeeee; font-weight: 600; color: #555; width: 150px; vertical-align: top;">Order ID:</td>
              <td style="padding: 12px; border-bottom: 1px solid #eeeeee; vertical-align: top;">${
                newOrder._id
              }</td>
            </tr>
            <tr>
              <td class="label" style="padding: 12px; border-bottom: 1px solid #eeeeee; font-weight: 600; color: #555; width: 150px; vertical-align: top;">Customer:</td>
              <td style="padding: 12px; border-bottom: 1px solid #eeeeee; vertical-align: top;">${
                newOrder.customer?.name || "N/A"
              }</td>
            </tr>
            <tr>
              <td class="label" style="padding: 12px; border-bottom: 1px solid #eeeeee; font-weight: 600; color: #555; width: 150px; vertical-align: top;">Email:</td>
              <td style="padding: 12px; border-bottom: 1px solid #eeeeee; vertical-align: top;"><a href="mailto:${
                newOrder.customer?.email
              }" style="color: #3498db; text-decoration: none;">${
          newOrder.customer?.email || "N/A"
        }</a></td>
            </tr>
             <tr>
              <td class="label" style="padding: 12px; border-bottom: 1px solid #eeeeee; font-weight: 600; color: #555; width: 150px; vertical-align: top;">Phone:</td>
              <td style="padding: 12px; border-bottom: 1px solid #eeeeee; vertical-align: top;"><a href="tel:${
                newOrder.customer?.phone
              }" style="color: #3498db; text-decoration: none;">${
          newOrder.customer?.phone || "N/A"
        }</a></td>
            </tr>
            <tr>
              <td class="label" style="padding: 12px; border-bottom: 1px solid #eeeeee; font-weight: 600; color: #555; width: 150px; vertical-align: top;">Address:</td>
              <td style="padding: 12px; border-bottom: 1px solid #eeeeee; vertical-align: top;">${
                newOrder.customer?.address || "N/A"
              }</td>
            </tr>
            <tr>
              <td class="label" style="padding: 12px; border-bottom: 1px solid #eeeeee; font-weight: 600; color: #555; width: 150px; vertical-align: top;">Payment:</td>
              <td style="padding: 12px; border-bottom: 1px solid #eeeeee; vertical-align: top;">${
                newOrder.paymentMethod
              }</td>
            </tr>
            <tr>
              <td class="label" style="padding: 12px; border-bottom: 1px solid #eeeeee; font-weight: 600; color: #555; width: 150px; vertical-align: top;">Total:</td>
              <td style="padding: 12px; border-bottom: 1px solid #eeeeee; vertical-align: top;"><strong>BDT ${
                newOrder.totalAmount
              }</strong></td>
            </tr>
          </table>

          <h3 class="items-list-title" style="color: #2c3e50; font-size: 18px; margin-top: 30px; margin-bottom: 15px; border-top: 1px solid #e0e0e0; padding-top: 20px;">🛒 Ordered Items</h3>

          ${newOrder.cartItems
            .map(
              (item: any) => `
            <div class="item" style="display: block; width: 100%; padding: 15px 0; border-bottom: 1px solid #eeeeee;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td class="item-image-cell" width="95" valign="top">
                    <img src="${item.image?.url}" alt="${
                item.name
              }" class="item-image" style="width: 80px; height: 80px; border-radius: 6px; margin-right: 15px;" onerror="this.src='https://placehold.co/80x80/cccccc/ffffff?text=Img';">
                  </td>
                  <td class="item-details" valign="top" style="line-height: 1.5;">
                    <p class="item-name" style="font-weight: 600; font-size: 16px; margin: 0 0 5px;">${
                      item.name
                    }</p>
                    
                    ${
                      item.variant?.name
                        ? `<p style="margin: 0 0 5px; color: #555; font-weight: 600;">Variant: ${item.variant.name}</p>`
                        : ""
                    }
                    <p style="margin: 0 0 5px; color: #555;">Quantity: ${
                      item.quantity
                    }</p>
                    <p style="margin: 0 0 5px; color: #555;">Price: BDT ${
                      item.price
                    }</p>
                    <p style="margin: 0 0 5px; color: #555;">Color: <span style="color: ${
                      item.color?.value || "#000"
                    };">${item.color?.name || "N/A"}</span></p>
                    <p style="margin: 0 0 5px; color: #555;">Size: ${
                      item.size?.name || "N/A"
                    }</p>
                    <p style="margin: 0 0 5px; color: #555;">Discount: ${
                      item.discount || 0
                    }%</p>
                  </td>
                </tr>
              </table>
            </div>
          `
            )
            .join("")}

          <div class="button-container" style="text-align: left; margin-top: 25px;">
            <a href="https://www.maven-zone.com/dashboard/orders/${
              newOrder._id
            }" target="_blank" class="button" style="display: inline-block; padding: 12px 25px; background-color: #ff7f50; color: #ffffff !important; text-decoration: none; border-radius: 5px; font-weight: 600; text-align: center;">View Order Details</a>
          </div>
        </td>
      </tr>
      <tr>
        <td class="footer" style="text-align: left; padding: 20px 30px; font-size: 14px; color: #555555; line-height: 1.6; border-top: 1px solid #e0e0e0; margin-top: 20px;">
          <p style="margin: 0;">Best regards,<br>Maven Zone</p>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>`,
      });
    }

    return NextResponse.json({ order: newOrder, invoice: invoiceData });
  } catch (error) {
    console.error("[ORDER_POST]", error);
    return new Response("Something went wrong while creating the order", {
      status: 500,
    });
  }
}

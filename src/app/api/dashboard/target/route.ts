import { connectDB } from "@/lib/mongodb";
import MonthlyTarget from "@/models/MontlyTargetModel";
import { NextRequest, NextResponse } from "next/server";
// import { connectDB } from "@/lib/db";
// import MonthlyTarget from "@/models/MonthlyTarget";

export async function GET() {
  try {
    await connectDB();

    let data = await MonthlyTarget.findOne();

    if (!data) {
      data = await MonthlyTarget.create({ target: 0 });
    }

    return NextResponse.json({ target: data.target });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch target" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { target } = await req.json();

    if (typeof target !== "number" || target < 0) {
      return NextResponse.json({ error: "Invalid target" }, { status: 400 });
    }

    let data = await MonthlyTarget.findOne();

    if (data) {
      data.target = target;
      await data.save();
    } else {
      data = await MonthlyTarget.create({ target });
    }

    return NextResponse.json({
      message: "Target updated",
      target: data.target,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to update target" },
      { status: 500 }
    );
  }
}

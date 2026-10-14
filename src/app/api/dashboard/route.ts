import { NextResponse } from "next/server";
import { getDashboardData } from "@/server/dashboard";

export async function GET() {
  try {
    const data = await getDashboardData();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Dashboard data aggregation error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve dashboard metrics from database." },
      { status: 500 }
    );
  }
}

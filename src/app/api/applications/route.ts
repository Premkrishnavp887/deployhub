import { NextResponse } from "next/server";
import { listApplications, createApplication } from "@/server/applications";
import { validateApplicationInput } from "@/server/validation";

export async function GET() {
  try {
    const apps = await listApplications();
    return NextResponse.json(apps);
  } catch (error: unknown) {
    console.error("Failed to fetch applications:", error);
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const val = validateApplicationInput(body);
    if (!val.success || !val.data) {
      return NextResponse.json({ error: val.errors?.join(" ") || "Invalid input." }, { status: 400 });
    }

    const res = await createApplication(val.data);
    if (!res.success) {
      return NextResponse.json({ error: res.error }, { status: res.conflict ? 409 : 500 });
    }

    return NextResponse.json(res.data, { status: 201 });
  } catch (error: unknown) {
    console.error("Failed to create application:", error);
    return NextResponse.json({ error: "Failed to create application" }, { status: 500 });
  }
}

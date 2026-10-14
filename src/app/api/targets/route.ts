import { NextResponse } from "next/server";
import { listTargets, createTarget } from "@/server/targets";
import { validateTargetInput } from "@/server/validation";

export async function GET() {
  try {
    const targets = await listTargets();
    return NextResponse.json(targets);
  } catch (error: unknown) {
    console.error("Failed to fetch targets:", error);
    return NextResponse.json({ error: "Failed to fetch deployment targets" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const val = validateTargetInput(body);
    if (!val.success || !val.data) {
      return NextResponse.json({ error: val.errors?.join(" ") || "Invalid input." }, { status: 400 });
    }

    const res = await createTarget(val.data);
    if (!res.success) {
      const status = res.notFound ? 404 : res.conflict ? 409 : 500;
      return NextResponse.json({ error: res.error }, { status });
    }

    return NextResponse.json(res.data, { status: 201 });
  } catch (error: unknown) {
    console.error("Failed to create deployment target:", error);
    return NextResponse.json({ error: "Failed to create deployment target" }, { status: 500 });
  }
}

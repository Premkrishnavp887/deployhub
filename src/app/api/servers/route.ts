import { NextResponse } from "next/server";
import { listServers, createServer } from "@/server/servers";
import { validateServerInput } from "@/server/validation";

export async function GET() {
  try {
    const servers = await listServers();
    return NextResponse.json(servers);
  } catch (error: unknown) {
    console.error("Failed to fetch servers:", error);
    return NextResponse.json({ error: "Failed to fetch servers" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const val = validateServerInput(body);
    if (!val.success || !val.data) {
      return NextResponse.json({ error: val.errors?.join(" ") || "Invalid input." }, { status: 400 });
    }

    const res = await createServer(val.data);
    if (!res.success) {
      return NextResponse.json({ error: res.error }, { status: res.conflict ? 409 : 500 });
    }

    return NextResponse.json(res.data, { status: 201 });
  } catch (error: unknown) {
    console.error("Failed to create server:", error);
    return NextResponse.json({ error: "Failed to create server" }, { status: 500 });
  }
}

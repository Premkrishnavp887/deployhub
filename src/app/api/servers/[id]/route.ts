import { NextResponse } from "next/server";
import { getServerById, updateServer, deleteServer } from "@/server/servers";
import { validateServerInput } from "@/server/validation";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const server = await getServerById(id);
    if (!server) return NextResponse.json({ error: "Server not found." }, { status: 404 });
    return NextResponse.json(server);
  } catch (error: unknown) {
    console.error("Failed to retrieve server:", error);
    return NextResponse.json({ error: "Failed to retrieve server" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const val = validateServerInput(body);
    if (!val.success || !val.data) {
      return NextResponse.json({ error: val.errors?.join(" ") || "Invalid input." }, { status: 400 });
    }

    const res = await updateServer(id, val.data);
    if (!res.success) {
      const status = res.notFound ? 404 : res.conflict ? 409 : 500;
      return NextResponse.json({ error: res.error }, { status });
    }

    return NextResponse.json(res.data);
  } catch (error: unknown) {
    console.error("Failed to update server:", error);
    return NextResponse.json({ error: "Failed to update server" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const res = await deleteServer(id);
    if (!res.success) {
      const status = res.notFound ? 404 : res.conflict ? 409 : 500;
      return NextResponse.json({ error: res.error }, { status });
    }
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Failed to delete server:", error);
    return NextResponse.json({ error: "Failed to delete server" }, { status: 500 });
  }
}

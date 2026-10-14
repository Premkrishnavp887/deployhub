import { NextResponse } from "next/server";
import { getTargetById, updateTarget, toggleTargetEnabled, deleteTarget } from "@/server/targets";
import { validateTargetInput } from "@/server/validation";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const target = await getTargetById(id);
    if (!target) return NextResponse.json({ error: "Deployment target not found." }, { status: 404 });
    return NextResponse.json(target);
  } catch (error: unknown) {
    console.error("Failed to retrieve target:", error);
    return NextResponse.json({ error: "Failed to retrieve target" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const val = validateTargetInput(body);
    if (!val.success || !val.data) {
      return NextResponse.json({ error: val.errors?.join(" ") || "Invalid input." }, { status: 400 });
    }

    const res = await updateTarget(id, val.data);
    if (!res.success) {
      const status = res.notFound ? 404 : res.conflict ? 409 : 500;
      return NextResponse.json({ error: res.error }, { status });
    }

    return NextResponse.json(res.data);
  } catch (error: unknown) {
    console.error("Failed to update target:", error);
    return NextResponse.json({ error: "Failed to update target" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    if (typeof body.enabled !== "boolean") {
      return NextResponse.json({ error: "Field 'enabled' (boolean) is required." }, { status: 400 });
    }

    const res = await toggleTargetEnabled(id, body.enabled);
    if (!res.success) {
      const status = res.notFound ? 404 : 500;
      return NextResponse.json({ error: res.error }, { status });
    }

    return NextResponse.json(res.data);
  } catch (error: unknown) {
    console.error("Failed to toggle target:", error);
    return NextResponse.json({ error: "Failed to update target" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const res = await deleteTarget(id);
    if (!res.success) {
      const status = res.notFound ? 404 : res.conflict ? 409 : 500;
      return NextResponse.json({ error: res.error }, { status });
    }
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Failed to delete target:", error);
    return NextResponse.json({ error: "Failed to delete target" }, { status: 500 });
  }
}

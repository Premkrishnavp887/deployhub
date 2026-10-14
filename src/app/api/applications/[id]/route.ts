import { NextResponse } from "next/server";
import { getApplicationById, updateApplication, deleteApplication } from "@/server/applications";
import { validateApplicationInput } from "@/server/validation";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const app = await getApplicationById(id);
    if (!app) return NextResponse.json({ error: "Application not found." }, { status: 404 });
    return NextResponse.json(app);
  } catch (error: unknown) {
    console.error("Failed to retrieve application:", error);
    return NextResponse.json({ error: "Failed to retrieve application" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const val = validateApplicationInput(body);
    if (!val.success || !val.data) {
      return NextResponse.json({ error: val.errors?.join(" ") || "Invalid input." }, { status: 400 });
    }

    const res = await updateApplication(id, val.data);
    if (!res.success) {
      const status = res.notFound ? 404 : res.conflict ? 409 : 500;
      return NextResponse.json({ error: res.error }, { status });
    }

    return NextResponse.json(res.data);
  } catch (error: unknown) {
    console.error("Failed to update application:", error);
    return NextResponse.json({ error: "Failed to update application" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const res = await deleteApplication(id);
    if (!res.success) {
      const status = res.notFound ? 404 : res.conflict ? 409 : 500;
      return NextResponse.json({ error: res.error }, { status });
    }
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Failed to delete application:", error);
    return NextResponse.json({ error: "Failed to delete application" }, { status: 500 });
  }
}

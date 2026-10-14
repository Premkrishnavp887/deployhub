import { NextResponse } from "next/server";
import { getServers } from "@/lib/db-service";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const servers = await getServers();
    return NextResponse.json(servers);
  } catch (error: unknown) {
    console.error("Failed to fetch servers:", error);
    return NextResponse.json(
      { error: "Failed to fetch servers" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, host, port, sshUsername, jenkinsCredentialId, knownHostFingerprint } = body;

    if (!name || !host || !sshUsername) {
      return NextResponse.json(
        { error: "name, host, and sshUsername are required." },
        { status: 400 }
      );
    }

    const created = await prisma.server.create({
      data: {
        name,
        host,
        port: Number(port) || 22,
        sshUsername,
        jenkinsCredentialId: jenkinsCredentialId || "default-cred",
        knownHostFingerprint: knownHostFingerprint || "SHA256:verified_host_fingerprint",
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error: unknown) {
    console.error("Failed to create server:", error);
    return NextResponse.json(
      { error: "Failed to create server" },
      { status: 500 }
    );
  }
}

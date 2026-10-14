import { NextResponse } from "next/server";
import { getDeploymentTargets } from "@/lib/db-service";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const targets = await getDeploymentTargets();
    return NextResponse.json(targets);
  } catch (error: unknown) {
    console.error("Failed to fetch targets:", error);
    return NextResponse.json(
      { error: "Failed to fetch deployment targets" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, environment, applicationId, serverId, remotePath, composeFile, tagEnvVar, enabled, requireApproval } = body;

    if (!applicationId || !serverId || !remotePath) {
      return NextResponse.json(
        { error: "applicationId, serverId, and remotePath are required." },
        { status: 400 }
      );
    }

    const created = await prisma.deploymentTarget.create({
      data: {
        name: name || "Target",
        environment: environment || "DEVELOPMENT",
        applicationId,
        serverId,
        remotePath,
        composeFile: composeFile || "docker-compose.yml",
        tagEnvVar: tagEnvVar || "tag",
        enabled: enabled ?? true,
        requireApproval: requireApproval ?? false,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error: unknown) {
    console.error("Failed to create deployment target:", error);
    return NextResponse.json(
      { error: "Failed to create deployment target" },
      { status: 500 }
    );
  }
}

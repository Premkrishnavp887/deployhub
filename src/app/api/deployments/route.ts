import { NextResponse } from "next/server";
import { getDeployments } from "@/lib/db-service";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const deployments = await getDeployments();
    return NextResponse.json(deployments);
  } catch (error: unknown) {
    console.error("Failed to fetch deployments:", error);
    return NextResponse.json(
      { error: "Failed to fetch deployments" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { applicationId, targetId, branch, requestedTag, message } = body;

    if (!applicationId || !targetId || !branch || !requestedTag) {
      return NextResponse.json(
        { error: "applicationId, targetId, branch, and requestedTag are required." },
        { status: 400 }
      );
    }

    const target = await prisma.deploymentTarget.findUnique({
      where: { id: targetId },
    });

    if (!target) {
      return NextResponse.json(
        { error: "Deployment target not found." },
        { status: 404 }
      );
    }

    const deployment = await prisma.deployment.create({
      data: {
        applicationId,
        serverId: target.serverId,
        targetId,
        branch,
        requestedTag,
        commitSha: "c7e2b10",
        message: message || "Manual deployment from DeployHub",
        status: "RUNNING",
        startedAt: new Date(),
      },
    });

    return NextResponse.json(deployment, { status: 201 });
  } catch (error: unknown) {
    console.error("Failed to create deployment:", error);
    return NextResponse.json(
      { error: "Failed to create deployment" },
      { status: 500 }
    );
  }
}

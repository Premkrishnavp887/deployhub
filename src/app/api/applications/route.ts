import { NextResponse } from "next/server";
import { getApplications } from "@/lib/db-service";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const apps = await getApplications();
    return NextResponse.json(apps);
  } catch (error: unknown) {
    console.error("Failed to fetch applications:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, localPath, gitRemote, defaultBranch, imageName, composeFile, tagEnvVar, buildPlatform, noCache } = body;

    if (!name || !localPath || !imageName) {
      return NextResponse.json(
        { error: "name, localPath, and imageName are required." },
        { status: 400 }
      );
    }

    const created = await prisma.application.create({
      data: {
        name,
        localPath,
        gitRemote: gitRemote || "origin",
        defaultBranch: defaultBranch || "main",
        imageName,
        composeFile: composeFile || "docker-compose.yml",
        tagEnvVar: tagEnvVar || "tag",
        buildPlatform: buildPlatform || null,
        noCache: Boolean(noCache),
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error: unknown) {
    console.error("Failed to create application:", error);
    return NextResponse.json(
      { error: "Failed to create application" },
      { status: 500 }
    );
  }
}

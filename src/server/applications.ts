import { prisma } from "@/lib/prisma";
import { ApplicationInput } from "./validation";
import { ApplicationItem } from "@/lib/types";

export interface ServiceResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  notFound?: boolean;
  conflict?: boolean;
}

function mapToItem(a: {
  id: string;
  name: string;
  localPath: string;
  gitRemote: string;
  defaultBranch: string;
  imageName: string;
  composeFile: string;
  tagEnvVar: string;
  buildPlatform: string | null;
  noCache: boolean;
  createdAt: Date;
}): ApplicationItem {
  return {
    id: a.id,
    name: a.name,
    localPath: a.localPath,
    gitRemote: a.gitRemote,
    defaultBranch: a.defaultBranch,
    imageName: a.imageName,
    composeFile: a.composeFile,
    tagEnvVar: a.tagEnvVar,
    buildPlatform: a.buildPlatform,
    noCache: a.noCache,
    status: "Active",
    createdAt: a.createdAt.toISOString(),
  };
}

export async function listApplications(): Promise<ApplicationItem[]> {
  const apps = await prisma.application.findMany({
    orderBy: { createdAt: "desc" },
  });
  return apps.map(mapToItem);
}

export async function getApplicationById(id: string): Promise<ApplicationItem | null> {
  const app = await prisma.application.findUnique({ where: { id } });
  return app ? mapToItem(app) : null;
}

export async function createApplication(input: ApplicationInput): Promise<ServiceResult<ApplicationItem>> {
  try {
    const existing = await prisma.application.findUnique({
      where: { name: input.name },
    });
    if (existing) {
      return { success: false, conflict: true, error: `Application "${input.name}" already exists.` };
    }

    const created = await prisma.application.create({
      data: {
        name: input.name,
        localPath: input.localPath,
        gitRemote: input.gitRemote || "origin",
        defaultBranch: input.defaultBranch || "main",
        imageName: input.imageName,
        composeFile: input.composeFile || "docker-compose.yml",
        tagEnvVar: input.tagEnvVar || "tag",
        buildPlatform: input.buildPlatform || null,
        noCache: input.noCache ?? false,
      },
    });

    return { success: true, data: mapToItem(created) };
  } catch (error) {
    console.error("Failed to create application:", error);
    return { success: false, error: "Failed to create application in database." };
  }
}

export async function updateApplication(
  id: string,
  input: ApplicationInput
): Promise<ServiceResult<ApplicationItem>> {
  try {
    const current = await prisma.application.findUnique({ where: { id } });
    if (!current) {
      return { success: false, notFound: true, error: "Application not found." };
    }

    const collision = await prisma.application.findFirst({
      where: { name: input.name, NOT: { id } },
    });
    if (collision) {
      return { success: false, conflict: true, error: `Application name "${input.name}" is already taken.` };
    }

    const updated = await prisma.application.update({
      where: { id },
      data: {
        name: input.name,
        localPath: input.localPath,
        gitRemote: input.gitRemote || "origin",
        defaultBranch: input.defaultBranch || "main",
        imageName: input.imageName,
        composeFile: input.composeFile || "docker-compose.yml",
        tagEnvVar: input.tagEnvVar || "tag",
        buildPlatform: input.buildPlatform || null,
        noCache: input.noCache ?? false,
      },
    });

    return { success: true, data: mapToItem(updated) };
  } catch (error) {
    console.error(`Failed to update application ${id}:`, error);
    return { success: false, error: "Failed to update application in database." };
  }
}

export async function deleteApplication(id: string): Promise<ServiceResult<null>> {
  try {
    const current = await prisma.application.findUnique({ where: { id } });
    if (!current) {
      return { success: false, notFound: true, error: "Application not found." };
    }

    const [targetCount, deployCount] = await Promise.all([
      prisma.deploymentTarget.count({ where: { applicationId: id } }),
      prisma.deployment.count({ where: { applicationId: id } }),
    ]);

    if (targetCount > 0 || deployCount > 0) {
      return {
        success: false,
        conflict: true,
        error: `Cannot delete application: it is referenced by ${targetCount} target(s) and ${deployCount} deployment(s).`,
      };
    }

    await prisma.application.delete({ where: { id } });
    return { success: true, data: null };
  } catch (error) {
    console.error(`Failed to delete application ${id}:`, error);
    return { success: false, error: "Failed to delete application from database." };
  }
}

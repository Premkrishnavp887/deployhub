import { prisma } from "@/lib/prisma";
import { TargetInput } from "./validation";
import { DeploymentTargetItem, EnvironmentType } from "@/lib/types";
import { ServiceResult } from "./applications";

function mapToItem(t: {
  id: string;
  name: string;
  environment: string;
  applicationId: string;
  serverId: string;
  remotePath: string;
  composeFile: string;
  tagEnvVar: string;
  enabled: boolean;
  requireApproval: boolean;
  application?: { name: string };
  server?: { name: string };
}): DeploymentTargetItem {
  return {
    id: t.id,
    name: t.name,
    environment: t.environment as EnvironmentType,
    applicationId: t.applicationId,
    applicationName: t.application?.name,
    serverId: t.serverId,
    serverName: t.server?.name,
    remotePath: t.remotePath,
    composeFile: t.composeFile,
    tagEnvVar: t.tagEnvVar,
    enabled: t.enabled,
    requireApproval: t.requireApproval,
    autoHealthCheck: true,
  };
}

export async function listTargets(): Promise<DeploymentTargetItem[]> {
  const targets = await prisma.deploymentTarget.findMany({
    include: { application: true, server: true },
    orderBy: { createdAt: "desc" },
  });
  return targets.map(mapToItem);
}

export async function getTargetById(id: string): Promise<DeploymentTargetItem | null> {
  const target = await prisma.deploymentTarget.findUnique({
    where: { id },
    include: { application: true, server: true },
  });
  return target ? mapToItem(target) : null;
}

export async function createTarget(input: TargetInput): Promise<ServiceResult<DeploymentTargetItem>> {
  try {
    const [app, srv] = await Promise.all([
      prisma.application.findUnique({ where: { id: input.applicationId } }),
      prisma.server.findUnique({ where: { id: input.serverId } }),
    ]);

    if (!app) return { success: false, notFound: true, error: "Referenced application does not exist." };
    if (!srv) return { success: false, notFound: true, error: "Referenced server does not exist." };

    const collision = await prisma.deploymentTarget.findFirst({
      where: { applicationId: input.applicationId, serverId: input.serverId, name: input.name },
    });
    if (collision) {
      return { success: false, conflict: true, error: `Target "${input.name}" already exists on this server.` };
    }

    const created = await prisma.deploymentTarget.create({
      data: {
        name: input.name,
        environment: input.environment,
        applicationId: input.applicationId,
        serverId: input.serverId,
        remotePath: input.remotePath,
        composeFile: input.composeFile || "docker-compose.yml",
        tagEnvVar: input.tagEnvVar || "tag",
        enabled: input.enabled ?? true,
        requireApproval: input.requireApproval ?? false,
      },
      include: { application: true, server: true },
    });

    return { success: true, data: mapToItem(created) };
  } catch (error) {
    console.error("Failed to create deployment target:", error);
    return { success: false, error: "Failed to create deployment target in database." };
  }
}

export async function updateTarget(id: string, input: TargetInput): Promise<ServiceResult<DeploymentTargetItem>> {
  try {
    const current = await prisma.deploymentTarget.findUnique({ where: { id } });
    if (!current) return { success: false, notFound: true, error: "Deployment target not found." };

    const [app, srv] = await Promise.all([
      prisma.application.findUnique({ where: { id: input.applicationId } }),
      prisma.server.findUnique({ where: { id: input.serverId } }),
    ]);

    if (!app) return { success: false, notFound: true, error: "Referenced application does not exist." };
    if (!srv) return { success: false, notFound: true, error: "Referenced server does not exist." };

    const collision = await prisma.deploymentTarget.findFirst({
      where: { applicationId: input.applicationId, serverId: input.serverId, name: input.name, NOT: { id } },
    });
    if (collision) {
      return { success: false, conflict: true, error: `Target "${input.name}" already exists on this server.` };
    }

    const updated = await prisma.deploymentTarget.update({
      where: { id },
      data: {
        name: input.name,
        environment: input.environment,
        applicationId: input.applicationId,
        serverId: input.serverId,
        remotePath: input.remotePath,
        composeFile: input.composeFile || "docker-compose.yml",
        tagEnvVar: input.tagEnvVar || "tag",
        enabled: input.enabled ?? true,
        requireApproval: input.requireApproval ?? false,
      },
      include: { application: true, server: true },
    });

    return { success: true, data: mapToItem(updated) };
  } catch (error) {
    console.error(`Failed to update deployment target ${id}:`, error);
    return { success: false, error: "Failed to update deployment target in database." };
  }
}

export async function toggleTargetEnabled(id: string, enabled: boolean): Promise<ServiceResult<DeploymentTargetItem>> {
  try {
    const current = await prisma.deploymentTarget.findUnique({ where: { id } });
    if (!current) return { success: false, notFound: true, error: "Deployment target not found." };

    const updated = await prisma.deploymentTarget.update({
      where: { id },
      data: { enabled },
      include: { application: true, server: true },
    });
    return { success: true, data: mapToItem(updated) };
  } catch (error) {
    console.error(`Failed to toggle target ${id}:`, error);
    return { success: false, error: "Failed to update target status." };
  }
}

export async function deleteTarget(id: string): Promise<ServiceResult<null>> {
  try {
    const current = await prisma.deploymentTarget.findUnique({ where: { id } });
    if (!current) return { success: false, notFound: true, error: "Deployment target not found." };

    const deployCount = await prisma.deployment.count({ where: { targetId: id } });
    if (deployCount > 0) {
      return {
        success: false,
        conflict: true,
        error: `Cannot delete target: it is referenced by ${deployCount} deployment record(s).`,
      };
    }

    await prisma.deploymentTarget.delete({ where: { id } });
    return { success: true, data: null };
  } catch (error) {
    console.error(`Failed to delete target ${id}:`, error);
    return { success: false, error: "Failed to delete target from database." };
  }
}

import { prisma } from "@/lib/prisma";
import { ServerInput } from "./validation";
import { ServerItem } from "@/lib/types";
import { ServiceResult } from "./applications";

function mapToItem(s: {
  id: string;
  name: string;
  host: string;
  port: number;
  sshUsername: string;
  jenkinsCredentialId: string;
  knownHostFingerprint: string;
  createdAt: Date;
}): ServerItem {
  return {
    id: s.id,
    name: s.name,
    host: s.host,
    port: s.port,
    sshUsername: s.sshUsername,
    jenkinsCredentialId: s.jenkinsCredentialId,
    knownHostFingerprint: s.knownHostFingerprint,
    status: "Online",
    createdAt: s.createdAt.toISOString(),
  };
}

export async function listServers(): Promise<ServerItem[]> {
  const servers = await prisma.server.findMany({
    orderBy: { createdAt: "desc" },
  });
  return servers.map(mapToItem);
}

export async function getServerById(id: string): Promise<ServerItem | null> {
  const server = await prisma.server.findUnique({ where: { id } });
  return server ? mapToItem(server) : null;
}

export async function createServer(input: ServerInput): Promise<ServiceResult<ServerItem>> {
  try {
    const existing = await prisma.server.findUnique({
      where: { name: input.name },
    });
    if (existing) {
      return { success: false, conflict: true, error: `Server "${input.name}" already exists.` };
    }

    const created = await prisma.server.create({
      data: {
        name: input.name,
        host: input.host,
        port: input.port,
        sshUsername: input.sshUsername,
        jenkinsCredentialId: input.jenkinsCredentialId,
        knownHostFingerprint: input.knownHostFingerprint,
      },
    });

    return { success: true, data: mapToItem(created) };
  } catch (error) {
    console.error("Failed to create server:", error);
    return { success: false, error: "Failed to create server in database." };
  }
}

export async function updateServer(
  id: string,
  input: ServerInput
): Promise<ServiceResult<ServerItem>> {
  try {
    const current = await prisma.server.findUnique({ where: { id } });
    if (!current) {
      return { success: false, notFound: true, error: "Server not found." };
    }

    const collision = await prisma.server.findFirst({
      where: { name: input.name, NOT: { id } },
    });
    if (collision) {
      return { success: false, conflict: true, error: `Server name "${input.name}" is already taken.` };
    }

    const updated = await prisma.server.update({
      where: { id },
      data: {
        name: input.name,
        host: input.host,
        port: input.port,
        sshUsername: input.sshUsername,
        jenkinsCredentialId: input.jenkinsCredentialId,
        knownHostFingerprint: input.knownHostFingerprint,
      },
    });

    return { success: true, data: mapToItem(updated) };
  } catch (error) {
    console.error(`Failed to update server ${id}:`, error);
    return { success: false, error: "Failed to update server in database." };
  }
}

export async function deleteServer(id: string): Promise<ServiceResult<null>> {
  try {
    const current = await prisma.server.findUnique({ where: { id } });
    if (!current) {
      return { success: false, notFound: true, error: "Server not found." };
    }

    const [targetCount, deployCount] = await Promise.all([
      prisma.deploymentTarget.count({ where: { serverId: id } }),
      prisma.deployment.count({ where: { serverId: id } }),
    ]);

    if (targetCount > 0 || deployCount > 0) {
      return {
        success: false,
        conflict: true,
        error: `Cannot delete server: it is referenced by ${targetCount} target(s) and ${deployCount} deployment(s).`,
      };
    }

    await prisma.server.delete({ where: { id } });
    return { success: true, data: null };
  } catch (error) {
    console.error(`Failed to delete server ${id}:`, error);
    return { success: false, error: "Failed to delete server from database." };
  }
}

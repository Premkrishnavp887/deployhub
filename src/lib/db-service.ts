import { prisma } from "./prisma";
import {
  ApplicationItem,
  ServerItem,
  DeploymentTargetItem,
  DeploymentItem,
} from "./types";

export async function getApplications(): Promise<ApplicationItem[]> {
  try {
    const dbApps = await prisma.application.findMany({
      orderBy: { createdAt: "asc" },
    });
    return dbApps.map((a) => ({
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
    }));
  } catch (error) {
    console.error("Error fetching applications from database:", error);
    return [];
  }
}

export async function getServers(): Promise<ServerItem[]> {
  try {
    const dbServers = await prisma.server.findMany({
      orderBy: { createdAt: "asc" },
    });
    return dbServers.map((s) => ({
      id: s.id,
      name: s.name,
      host: s.host,
      port: s.port,
      sshUsername: s.sshUsername,
      jenkinsCredentialId: s.jenkinsCredentialId,
      knownHostFingerprint: s.knownHostFingerprint,
      status: "Offline",
      createdAt: s.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error("Error fetching servers from database:", error);
    return [];
  }
}

export async function getDeploymentTargets(): Promise<DeploymentTargetItem[]> {
  try {
    const dbTargets = await prisma.deploymentTarget.findMany({
      include: { application: true, server: true },
      orderBy: { createdAt: "asc" },
    });
    return dbTargets.map((t) => ({
      id: t.id,
      name: t.name,
      environment: t.environment,
      applicationId: t.applicationId,
      applicationName: t.application.name,
      serverId: t.serverId,
      serverName: t.server.name,
      remotePath: t.remotePath,
      composeFile: t.composeFile,
      tagEnvVar: t.tagEnvVar,
      enabled: t.enabled,
      requireApproval: t.requireApproval,
      autoHealthCheck: true,
    }));
  } catch (error) {
    console.error("Error fetching deployment targets from database:", error);
    return [];
  }
}

export async function getDeployments(): Promise<DeploymentItem[]> {
  try {
    const dbDeployments = await prisma.deployment.findMany({
      include: { application: true, target: true },
      orderBy: { createdAt: "desc" },
    });
    return dbDeployments.map((d) => {
      const mins = d.durationSeconds ? Math.floor(d.durationSeconds / 60) : 0;
      const secs = d.durationSeconds ? d.durationSeconds % 60 : 0;
      return {
        id: d.id,
        displayId: d.jenkinsBuildNumber ? `#${d.jenkinsBuildNumber}` : `#${d.id.slice(-4)}`,
        applicationId: d.applicationId,
        applicationName: d.application.name,
        environment: d.target?.environment || "DEVELOPMENT",
        branch: d.branch,
        requestedTag: d.requestedTag,
        commitSha: d.commitSha,
        message: d.message,
        status: d.status,
        durationSeconds: d.durationSeconds,
        durationFormatted: d.durationSeconds ? `${mins}m ${secs}s` : undefined,
        jenkinsBuildNumber: d.jenkinsBuildNumber,
        jenkinsBuildUrl: d.jenkinsBuildUrl,
        createdAt: d.createdAt.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }) + `, ${d.createdAt.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`,
      };
    });
  } catch (error) {
    console.error("Error fetching deployments from database:", error);
    return [];
  }
}


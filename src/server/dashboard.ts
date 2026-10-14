import { prisma } from "@/lib/prisma";
import {
  DashboardData,
  DeploymentItem,
  DeploymentOverviewPoint,
  DeploymentStatusType,
} from "@/lib/types";

export async function getDashboardData(): Promise<DashboardData> {
  const now = new Date();
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  const [
    appCount,
    serverCount,
    targetCount,
    deployCount,
    activeTargetCount,
    prevAppCountRaw,
    prevDeployCountRaw,
    statusGroups,
    recentOverviewDeploys,
    recentDeploymentsRaw,
  ] = await Promise.all([
    prisma.application.count(),
    prisma.server.count(),
    prisma.deploymentTarget.count(),
    prisma.deployment.count(),
    prisma.deploymentTarget.count({ where: { enabled: true } }),
    prisma.application.count({ where: { createdAt: { lt: startOfThisMonth } } }),
    prisma.deployment.count({
      where: { createdAt: { gte: startOfLastMonth, lt: startOfThisMonth } },
    }),
    prisma.deployment.groupBy({
      by: ["status"],
      _count: { status: true },
    }),
    prisma.deployment.findMany({
      where: { createdAt: { gte: fourteenDaysAgo } },
      select: { createdAt: true, status: true },
      orderBy: { createdAt: "asc" },
    }),
    prisma.deployment.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { application: true, target: true },
    }),
  ]);

  const prevAppCount = prevAppCountRaw > 0 ? prevAppCountRaw : null;
  const prevDeployCount = prevDeployCountRaw > 0 ? prevDeployCountRaw : null;

  const statusMap: Record<string, number> = {};
  for (const group of statusGroups) {
    statusMap[group.status] = group._count.status;
  }

  const successful = statusMap["SUCCESS"] || 0;
  const failed = statusMap["FAILURE"] || 0;
  const running = statusMap["RUNNING"] || 0;
  const cancelled = statusMap["ABORTED"] || 0;

  const overviewMap = new Map<string, { success: number; failed: number; total: number; date: string }>();
  for (const d of recentOverviewDeploys) {
    const label = d.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const fullDate = d.createdAt.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const current = overviewMap.get(label) || { success: 0, failed: 0, total: 0, date: fullDate };
    current.total += 1;
    if (d.status === "SUCCESS") current.success += 1;
    if (d.status === "FAILURE") current.failed += 1;
    overviewMap.set(label, current);
  }

  const overviewSeries: DeploymentOverviewPoint[] = Array.from(overviewMap.entries()).map(
    ([label, val]) => ({
      label,
      date: val.date,
      success: val.success,
      failed: val.failed,
      total: val.total,
    })
  );

  const recentDeployments: DeploymentItem[] = recentDeploymentsRaw.map((d) => {
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
      status: d.status as DeploymentStatusType,
      durationSeconds: d.durationSeconds,
      durationFormatted: d.durationSeconds ? `${mins}m ${secs}s` : undefined,
      jenkinsBuildNumber: d.jenkinsBuildNumber,
      jenkinsBuildUrl: d.jenkinsBuildUrl,
      createdAt:
        d.createdAt.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }) +
        `, ${d.createdAt.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        })}`,
    };
  });

  return {
    metrics: {
      appCount,
      serverCount,
      targetCount,
      deployCount,
      onlineServerCount: 0,
      activeTargetCount,
      prevAppCount,
      prevDeployCount,
    },
    statusSummary: {
      successful,
      failed,
      running,
      cancelled,
      total: deployCount,
    },
    overviewSeries,
    recentDeployments,
  };
}

export type EnvironmentType = "DEVELOPMENT" | "STAGING" | "PRODUCTION" | "OTHER";

export type DeploymentStatusType = "QUEUED" | "RUNNING" | "SUCCESS" | "FAILURE" | "ABORTED";

export interface ApplicationItem {
  id: string;
  name: string;
  localPath: string;
  gitRemote: string;
  defaultBranch: string;
  imageName: string;
  composeFile: string;
  tagEnvVar: string;
  buildPlatform?: string | null;
  noCache: boolean;
  status: "Active" | "Disabled";
  createdAt?: string;
}

export interface ServerItem {
  id: string;
  name: string;
  host: string;
  port: number;
  sshUsername: string;
  jenkinsCredentialId: string;
  knownHostFingerprint: string;
  status: "Online" | "Offline";
  createdAt?: string;
}

export interface DeploymentTargetItem {
  id: string;
  name: string;
  environment: EnvironmentType;
  applicationId: string;
  applicationName?: string;
  serverId: string;
  serverName?: string;
  remotePath: string;
  composeFile: string;
  tagEnvVar: string;
  enabled: boolean;
  requireApproval: boolean;
  autoHealthCheck?: boolean;
}

export interface DeploymentItem {
  id: string;
  displayId?: string; // e.g. #128
  applicationId: string;
  applicationName: string;
  serverId?: string;
  serverName?: string;
  targetId?: string;
  environment: EnvironmentType;
  branch: string;
  requestedTag: string;
  commitSha?: string | null;
  message: string;
  status: DeploymentStatusType;
  durationSeconds?: number | null;
  durationFormatted?: string;
  jenkinsBuildNumber?: number | null;
  jenkinsBuildUrl?: string | null;
  startedAt?: string | null;
  finishedAt?: string | null;
  createdAt: string;
}

export interface DashboardMetrics {
  appCount: number | null;
  serverCount: number | null;
  targetCount: number | null;
  deployCount: number | null;
  onlineServerCount?: number | null;
  activeTargetCount?: number | null;
  prevAppCount?: number | null;
  prevDeployCount?: number | null;
}

export interface DeploymentOverviewPoint {
  label: string;
  date: string;
  success: number;
  failed: number;
  total: number;
}

export interface DeploymentStatusSummary {
  successful: number;
  failed: number;
  running: number;
  cancelled: number;
  total: number;
}

export interface DashboardData {
  metrics: DashboardMetrics;
  statusSummary: DeploymentStatusSummary;
  overviewSeries: DeploymentOverviewPoint[];
  recentDeployments: DeploymentItem[];
}

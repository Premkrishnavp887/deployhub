export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: string[];
}

export interface ApplicationInput {
  name: string;
  localPath: string;
  gitRemote?: string;
  defaultBranch?: string;
  imageName: string;
  composeFile?: string;
  tagEnvVar?: string;
  buildPlatform?: string | null;
  noCache?: boolean;
}

export function validateApplicationInput(raw: unknown): ValidationResult<ApplicationInput> {
  if (!raw || typeof raw !== "object") return { success: false, errors: ["Invalid request body."] };
  const b = raw as Record<string, unknown>;
  const errors: string[] = [];

  const name = typeof b.name === "string" ? b.name.trim() : "";
  if (!name || name.length < 2 || name.length > 100) {
    errors.push("Application name must be between 2 and 100 characters.");
  }

  const localPath = typeof b.localPath === "string" ? b.localPath.trim() : "";
  if (!localPath || !localPath.startsWith("/")) {
    errors.push("Project path must be an absolute Unix filesystem path (e.g. /home/user/project).");
  } else if (localPath.includes("\0") || /[;&|`$]/.test(localPath)) {
    errors.push("Project path contains invalid or unsafe characters.");
  }

  const imageName = typeof b.imageName === "string" ? b.imageName.trim() : "";
  if (!imageName || imageName.length > 255) {
    errors.push("Docker image name is required and cannot exceed 255 characters.");
  } else if (/\s/.test(imageName) || /[;&|`$]/.test(imageName)) {
    errors.push("Docker image name cannot contain spaces or shell metacharacters.");
  }

  const composeFile = typeof b.composeFile === "string" && b.composeFile.trim()
    ? b.composeFile.trim() : "docker-compose.yml";
  if (composeFile.includes("/") || composeFile.includes("..")) {
    errors.push("Compose filename must be a filename without directory traversal.");
  }

  const defaultBranch = typeof b.defaultBranch === "string" && b.defaultBranch.trim()
    ? b.defaultBranch.trim() : "main";
  const gitRemote = typeof b.gitRemote === "string" && b.gitRemote.trim() ? b.gitRemote.trim() : "origin";
  const tagEnvVar = typeof b.tagEnvVar === "string" && b.tagEnvVar.trim() ? b.tagEnvVar.trim() : "tag";
  const buildPlatform = typeof b.buildPlatform === "string" && b.buildPlatform.trim()
    ? b.buildPlatform.trim() : null;

  if (errors.length > 0) return { success: false, errors };

  return {
    success: true,
    data: {
      name, localPath, gitRemote, defaultBranch, imageName, composeFile,
      tagEnvVar, buildPlatform, noCache: Boolean(b.noCache),
    },
  };
}

export interface ServerInput {
  name: string;
  host: string;
  port: number;
  sshUsername: string;
  jenkinsCredentialId: string;
  knownHostFingerprint: string;
}

export function validateServerInput(raw: unknown): ValidationResult<ServerInput> {
  if (!raw || typeof raw !== "object") return { success: false, errors: ["Invalid request body."] };
  const b = raw as Record<string, unknown>;
  const errors: string[] = [];

  const name = typeof b.name === "string" ? b.name.trim() : "";
  if (!name || name.length < 2 || name.length > 100) {
    errors.push("Server name must be between 2 and 100 characters.");
  }

  const host = typeof b.host === "string" ? b.host.trim() : "";
  if (!host || /\s/.test(host) || /[;&|`$]/.test(host)) {
    errors.push("Valid hostname or IP address is required (no spaces or command characters).");
  }

  const port = Number(b.port ?? 22);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    errors.push("SSH Port must be an integer between 1 and 65535.");
  }

  const sshUsername = typeof b.sshUsername === "string" ? b.sshUsername.trim() : "";
  if (!sshUsername || !/^[a-zA-Z0-9_.-]{1,64}$/.test(sshUsername)) {
    errors.push("SSH username must be a valid POSIX username (1-64 characters).");
  }

  const jenkinsCredentialId = typeof b.jenkinsCredentialId === "string"
    ? b.jenkinsCredentialId.trim() : "";
  if (!jenkinsCredentialId || jenkinsCredentialId.length > 100) {
    errors.push("Jenkins credential ID reference is required.");
  }

  const knownHostFingerprint = typeof b.knownHostFingerprint === "string"
    ? b.knownHostFingerprint.trim() : "";
  if (!knownHostFingerprint) {
    errors.push("A verified SSH host fingerprint is required.");
  } else if (knownHostFingerprint.includes("PRIVATE KEY") || knownHostFingerprint.includes("password")) {
    errors.push("Never store private keys or passwords in the database.");
  }

  if (errors.length > 0) return { success: false, errors };
  return {
    success: true,
    data: { name, host, port, sshUsername, jenkinsCredentialId, knownHostFingerprint },
  };
}

export interface TargetInput {
  name: string;
  applicationId: string;
  serverId: string;
  environment: "DEVELOPMENT" | "STAGING" | "PRODUCTION" | "OTHER";
  remotePath: string;
  composeFile?: string;
  tagEnvVar?: string;
  enabled?: boolean;
  requireApproval?: boolean;
}

const VALID_ENVIRONMENTS = ["DEVELOPMENT", "STAGING", "PRODUCTION", "OTHER"] as const;

export function validateTargetInput(raw: unknown): ValidationResult<TargetInput> {
  if (!raw || typeof raw !== "object") return { success: false, errors: ["Invalid request body."] };
  const b = raw as Record<string, unknown>;
  const errors: string[] = [];

  const name = typeof b.name === "string" ? b.name.trim() : "";
  if (!name || name.length < 2 || name.length > 100) {
    errors.push("Target name must be between 2 and 100 characters.");
  }

  const applicationId = typeof b.applicationId === "string" ? b.applicationId.trim() : "";
  if (!applicationId) errors.push("Application selection is required.");

  const serverId = typeof b.serverId === "string" ? b.serverId.trim() : "";
  if (!serverId) errors.push("Server selection is required.");

  const env = String(b.environment ?? "").toUpperCase() as TargetInput["environment"];
  if (!VALID_ENVIRONMENTS.includes(env)) {
    errors.push(`Environment must be one of: ${VALID_ENVIRONMENTS.join(", ")}`);
  }

  const remotePath = typeof b.remotePath === "string" ? b.remotePath.trim() : "";
  if (!remotePath || !remotePath.startsWith("/")) {
    errors.push("Remote deployment path must be an absolute path (e.g. /home/deploy/app).");
  } else if (remotePath.includes("\0") || /[;&|`$]/.test(remotePath)) {
    errors.push("Remote deployment path contains invalid or unsafe characters.");
  }

  const composeFile = typeof b.composeFile === "string" && b.composeFile.trim()
    ? b.composeFile.trim() : "docker-compose.yml";
  if (composeFile.includes("/") || composeFile.includes("..")) {
    errors.push("Compose filename must be a filename without directory traversal.");
  }

  const tagEnvVar = typeof b.tagEnvVar === "string" && b.tagEnvVar.trim()
    ? b.tagEnvVar.trim() : "tag";

  if (errors.length > 0) return { success: false, errors };
  return {
    success: true,
    data: {
      name, applicationId, serverId, environment: env, remotePath, composeFile,
      tagEnvVar, enabled: b.enabled !== undefined ? Boolean(b.enabled) : true,
      requireApproval: Boolean(b.requireApproval),
    },
  };
}

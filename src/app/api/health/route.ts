import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export type ServiceState = "Connected" | "Disconnected" | "Not Configured" | "Unknown";

export interface SystemHealthResponse {
  postgres: { state: ServiceState; detail: string };
  jenkins: { state: ServiceState; detail: string };
  wslAgent: { state: ServiceState; detail: string };
  ssh: { state: ServiceState; detail: string };
  teams: { state: ServiceState; detail: string };
}

export async function GET() {
  // 1. PostgreSQL check
  let pgState: ServiceState = "Unknown";
  let pgDetail = "Database responsive";
  try {
    await prisma.$queryRaw`SELECT 1`;
    pgState = "Connected";
  } catch {
    pgState = "Disconnected";
    pgDetail = "Cannot reach PostgreSQL service";
  }

  // 2. Jenkins controller check
  let jenkinsState: ServiceState = "Not Configured";
  let jenkinsDetail = process.env.JENKINS_URL || "http://localhost:8080";
  if (process.env.JENKINS_URL) {
    try {
      const res = await fetch(`${process.env.JENKINS_URL}/api/json`, {
        signal: AbortSignal.timeout(1000),
      });
      jenkinsState = res.ok ? "Connected" : "Disconnected";
    } catch {
      jenkinsState = "Disconnected";
      jenkinsDetail = "Offline (connection refused on 8080)";
    }
  }

  // 3. Build Agent check (verify Docker socket exists)
  let agentState: ServiceState = "Not Configured";
  let agentDetail = "Docker socket not detected";
  try {
    const fs = await import("fs");
    if (fs.existsSync("/var/run/docker.sock")) {
      agentState = "Connected";
      agentDetail = "Local Docker daemon socket active";
    }
  } catch {
    agentState = "Unknown";
    agentDetail = "Unable to check Docker socket";
  }

  // 4. SSH Host connectivity check (verify if SSH server records exist)
  let sshState: ServiceState = "Not Configured";
  let sshDetail = "No remote SSH hosts registered";
  try {
    const serverCount = await prisma.server.count();
    if (serverCount > 0) {
      sshDetail = `${serverCount} server(s) registered (connectivity check deferred)`;
      sshState = "Unknown";
    }
  } catch {
    sshState = "Unknown";
    sshDetail = "Unable to query server configuration";
  }

  // 5. Microsoft Teams Webhook check
  const hasTeamsWebhook = Boolean(process.env.TEAMS_WEBHOOK_URL);
  const teamsState: ServiceState = hasTeamsWebhook ? "Connected" : "Not Configured";
  const teamsDetail = hasTeamsWebhook
    ? "Webhook URL configured"
    : "TEAMS_WEBHOOK_URL not set in environment";

  const response: SystemHealthResponse = {
    postgres: { state: pgState, detail: pgDetail },
    jenkins: { state: jenkinsState, detail: jenkinsDetail },
    wslAgent: { state: agentState, detail: agentDetail },
    ssh: { state: sshState, detail: sshDetail },
    teams: { state: teamsState, detail: teamsDetail },
  };

  return NextResponse.json(response);
}

-- CreateEnum
CREATE TYPE "DeploymentStatus" AS ENUM ('QUEUED', 'RUNNING', 'SUCCESS', 'FAILURE', 'ABORTED');

-- CreateEnum
CREATE TYPE "Environment" AS ENUM ('DEVELOPMENT', 'STAGING', 'PRODUCTION', 'OTHER');

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "localPath" TEXT NOT NULL,
    "gitRemote" TEXT NOT NULL DEFAULT 'origin',
    "defaultBranch" TEXT NOT NULL DEFAULT 'main',
    "imageName" TEXT NOT NULL,
    "composeFile" TEXT NOT NULL DEFAULT 'docker-compose.yml',
    "tagEnvVar" TEXT NOT NULL DEFAULT 'tag',
    "buildPlatform" TEXT,
    "noCache" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Server" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "host" TEXT NOT NULL,
    "port" INTEGER NOT NULL DEFAULT 22,
    "sshUsername" TEXT NOT NULL,
    "jenkinsCredentialId" TEXT NOT NULL,
    "knownHostFingerprint" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Server_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeploymentTarget" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "environment" "Environment" NOT NULL DEFAULT 'OTHER',
    "applicationId" TEXT NOT NULL,
    "serverId" TEXT NOT NULL,
    "remotePath" TEXT NOT NULL,
    "composeFile" TEXT NOT NULL DEFAULT 'docker-compose.yml',
    "tagEnvVar" TEXT NOT NULL DEFAULT 'tag',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "requireApproval" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeploymentTarget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deployment" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "serverId" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "branch" TEXT NOT NULL,
    "requestedTag" TEXT NOT NULL,
    "commitSha" TEXT,
    "message" TEXT NOT NULL,
    "status" "DeploymentStatus" NOT NULL DEFAULT 'QUEUED',
    "jenkinsBuildNumber" INTEGER,
    "jenkinsBuildUrl" TEXT,
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "durationSeconds" INTEGER,
    "healthCheckPassed" BOOLEAN,
    "notificationStatus" TEXT,
    "failureSummary" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Deployment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Application_name_key" ON "Application"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Server_name_key" ON "Server"("name");

-- CreateIndex
CREATE UNIQUE INDEX "DeploymentTarget_applicationId_serverId_name_key" ON "DeploymentTarget"("applicationId", "serverId", "name");

-- CreateIndex
CREATE INDEX "Deployment_createdAt_idx" ON "Deployment"("createdAt");

-- CreateIndex
CREATE INDEX "Deployment_status_createdAt_idx" ON "Deployment"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Deployment_applicationId_requestedTag_idx" ON "Deployment"("applicationId", "requestedTag");

-- AddForeignKey
ALTER TABLE "DeploymentTarget" ADD CONSTRAINT "DeploymentTarget_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeploymentTarget" ADD CONSTRAINT "DeploymentTarget_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Server"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deployment" ADD CONSTRAINT "Deployment_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deployment" ADD CONSTRAINT "Deployment_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Server"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deployment" ADD CONSTRAINT "Deployment_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "DeploymentTarget"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

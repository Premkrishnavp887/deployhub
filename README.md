# DeployHub starter

DeployHub is a WSL-first deployment management portal backed by Jenkins.

## Architecture

- Next.js UI/API: application, server, deployment-target and deployment management.
- PostgreSQL + Prisma: persistent configuration and deployment history.
- Jenkins controller: stores pipeline definitions and credentials.
- WSL deployment agent: executes Git/Docker/SSH commands with access to your existing WSL project folders.
- Remote Linux servers: receive Docker image archives and run Docker Compose.
- Microsoft Teams Workflow: deployment notifications.

**Important:** This is a starter scaffold, not a production-ready deployment system. Do not connect it to production servers until authentication, authorization, input validation, secret handling, host-key verification, and pipeline tests have been reviewed.

## Why a WSL agent?

A Jenkins controller container cannot automatically see arbitrary WSL directories such as `/home/prem/SAM/sustainability-connect`. Run a dedicated Jenkins agent in WSL with access to the Docker CLI/engine and the registered project folders. Keep deployment credentials in Jenkins Credentials. Avoid mounting the Docker socket into the controller.

## Prerequisites

- WSL2 Linux distribution
- Node.js LTS and npm
- Docker CLI connected to Docker Desktop or a Docker Engine available from WSL
- Docker Compose
- Java compatible with your chosen Jenkins LTS release, if running the inbound agent directly from WSL
- Jenkins LTS controller
- PostgreSQL (included in the local Compose file)

## Local app setup

```bash
cp .env.example .env
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

Open http://localhost:3000.

The initial UI is a scaffold. The database schema and Jenkins contract are defined, but registration forms, authentication, encrypted secrets, and deployment API wiring still need implementation.

## Start PostgreSQL

```bash
docker compose up -d postgres
```

## Jenkins setup contract

Create a Jenkins Pipeline job named `deployhub-deploy` pointing to this repository's `Jenkinsfile`.

Configure a dedicated agent label `wsl-deploy-agent`. The agent must be able to read only the registered local project directories and use Docker, SSH, and SCP. Add credentials in Jenkins Credentials:

- SSH private-key credentials for each registered server
- A Teams Workflow webhook as a Secret Text credential (optional)
- SSH known-hosts configuration / verified host keys for registered servers

The Jenkinsfile is intentionally a guarded scaffold. It refuses uncommitted Git changes, validates common parameters, builds and transfers the image, and deploys with Compose. Test against a disposable development server first.

## First implementation milestones

1. Implement server-side validation and CRUD APIs for Applications, Servers, Deployment Targets.
2. Add authentication before exposing the UI on a network.
3. Implement Jenkins API client and deployment history updates.
4. Stream Jenkins console output to the UI by polling from the backend.
5. Add Teams notifications, health checks, and tag collision prevention.
6. Add concurrency locks per local project and deployment target.
# deployhub

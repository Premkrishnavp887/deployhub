pipeline {
  agent { label 'wsl-deploy-agent' }

  options {
    timestamps()
    disableConcurrentBuilds()
    timeout(time: 60, unit: 'MINUTES')
    buildDiscarder(logRotator(numToKeepStr: '30'))
  }

  parameters {
    string(name: 'APP_PATH', defaultValue: '', description: 'Registered absolute WSL project path')
    string(name: 'GIT_REMOTE', defaultValue: 'origin', description: 'Configured Git remote name')
    string(name: 'BRANCH', defaultValue: '', description: 'Branch to deploy')
    string(name: 'IMAGE_NAME', defaultValue: '', description: 'Full image name without tag')
    string(name: 'IMAGE_TAG', defaultValue: '', description: 'Manual tag, e.g. dev-64')
    string(name: 'BUILD_PLATFORM', defaultValue: 'linux/amd64', description: 'Docker build platform; blank for native')
    booleanParam(name: 'NO_CACHE', defaultValue: false, description: 'Build without cache')
    string(name: 'SERVER_HOST', defaultValue: '', description: 'Registered server host')
    string(name: 'SERVER_PORT', defaultValue: '22', description: 'Registered SSH port')
    string(name: 'REMOTE_USER', defaultValue: '', description: 'Registered SSH username')
    string(name: 'REMOTE_PATH', defaultValue: '', description: 'Registered remote deployment directory')
    string(name: 'COMPOSE_FILE', defaultValue: 'docker-compose.yml', description: 'Compose file relative to remote path')
    string(name: 'TAG_ENV_VAR', defaultValue: 'tag', description: 'Compose interpolation variable')
    string(name: 'DEPLOYMENT_MESSAGE', defaultValue: '', description: 'Reason for deployment')
    string(name: 'SSH_CREDENTIAL_ID', defaultValue: '', description: 'Jenkins SSH private-key credential ID')
  }

  environment {
    ARCHIVE_PATH = ''
    DEPLOY_START_EPOCH = ''
  }

  stages {
    stage('Validate parameters') {
      steps {
        script {
          ['APP_PATH', 'BRANCH', 'IMAGE_NAME', 'IMAGE_TAG', 'SERVER_HOST', 'REMOTE_USER', 'REMOTE_PATH', 'SSH_CREDENTIAL_ID'].each { key ->
            if (!params[key]?.trim()) error("Required parameter is empty: ${key}")
          }
          if (!(params.IMAGE_TAG ==~ /^[A-Za-z0-9_][A-Za-z0-9_.-]{0,127}$/)) {
            error('IMAGE_TAG contains unsupported characters')
          }
          if (!(params.TAG_ENV_VAR ==~ /^[A-Za-z_][A-Za-z0-9_]*$/)) {
            error('TAG_ENV_VAR must be a valid environment variable name')
          }
          if (!(params.SERVER_PORT ==~ /^[0-9]{1,5}$/) || params.SERVER_PORT.toInteger() < 1 || params.SERVER_PORT.toInteger() > 65535) {
            error('SERVER_PORT must be between 1 and 65535')
          }
          if (params.APP_PATH.startsWith('/') == false || params.APP_PATH.contains('..')) {
            error('APP_PATH must be an approved absolute path and must not contain ..')
          }
          if (params.REMOTE_PATH.startsWith('/') == false || params.REMOTE_PATH.contains('..')) {
            error('REMOTE_PATH must be an approved absolute path and must not contain ..')
          }
          if (params.COMPOSE_FILE.contains('..') || params.COMPOSE_FILE.startsWith('/')) {
            error('COMPOSE_FILE must be a relative path without ..')
          }
          env.ARCHIVE_PATH = "${pwd(tmp: true)}/deployhub-${env.BUILD_NUMBER}.tar.gz"
          env.DEPLOY_START_EPOCH = "${System.currentTimeMillis()}"
        }
      }
    }

    stage('Validate Git working tree') {
      steps {
        dir("${params.APP_PATH}") {
          sh '''#!/usr/bin/env bash
            set -euo pipefail
            git rev-parse --show-toplevel
            git remote get-url "$GIT_REMOTE"
            if [[ -n "$(git status --porcelain)" ]]; then
              echo "ERROR: Working tree is not clean. Commit/stash changes before deploying."
              git status --short
              exit 1
            fi
            git fetch "$GIT_REMOTE" "$BRANCH"
            git checkout "$BRANCH"
            git pull --ff-only "$GIT_REMOTE" "$BRANCH"
            test -f Dockerfile
            git rev-parse HEAD > "$WORKSPACE/DEPLOYHUB_COMMIT_SHA"
          '''
        }
      }
    }

    stage('Build image') {
      steps {
        dir("${params.APP_PATH}") {
          sh '''#!/usr/bin/env bash
            set -euo pipefail
            args=(-t "${IMAGE_NAME}:${IMAGE_TAG}")
            if [[ -n "${BUILD_PLATFORM}" ]]; then args+=(--platform "${BUILD_PLATFORM}"); fi
            if [[ "${NO_CACHE}" == "true" ]]; then args+=(--no-cache); fi
            docker build "${args[@]}" .
            docker image inspect "${IMAGE_NAME}:${IMAGE_TAG}" >/dev/null
          '''
        }
      }
    }

    stage('Package image') {
      steps {
        sh '''#!/usr/bin/env bash
          set -euo pipefail
          docker save "${IMAGE_NAME}:${IMAGE_TAG}" | gzip -1 > "${ARCHIVE_PATH}"
          test -s "${ARCHIVE_PATH}"
          ls -lh "${ARCHIVE_PATH}"
        '''
      }
    }

    stage('Transfer and deploy') {
      steps {
        sshagent(credentials: [params.SSH_CREDENTIAL_ID]) {
          sh '''#!/usr/bin/env bash
            set -euo pipefail
            # Strict host-key checking is required. Provision verified entries
            # in the deployment agent's known_hosts before enabling deployments.
            ssh_opts=(-p "${SERVER_PORT}" -o BatchMode=yes -o StrictHostKeyChecking=yes)
            scp_opts=(-P "${SERVER_PORT}" -o BatchMode=yes -o StrictHostKeyChecking=yes)
            archive_name="$(basename "${ARCHIVE_PATH}")"
            scp "${scp_opts[@]}" "${ARCHIVE_PATH}" "${REMOTE_USER}@${SERVER_HOST}:${REMOTE_PATH}/${archive_name}"
            ssh "${ssh_opts[@]}" "${REMOTE_USER}@${SERVER_HOST}" \
              "bash -s -- '${REMOTE_PATH}' '${archive_name}' '${TAG_ENV_VAR}' '${IMAGE_TAG}' '${COMPOSE_FILE}'" <<'REMOTE_SCRIPT'
            set -euo pipefail
            remote_path="$1"
            archive_name="$2"
            tag_var="$3"
            image_tag="$4"
            compose_file="$5"
            cd "$remote_path"
            echo ">> Loading image archive: $archive_name"
            gzip -dc "$archive_name" | docker load
            export "$tag_var=$image_tag"
            echo ">> Running Docker Compose"
            docker compose -f "$compose_file" up -d
            echo ">> Compose status"
            docker compose -f "$compose_file" ps
            rm -f -- "$archive_name"
            echo "REMOTE_DEPLOY_OK"
REMOTE_SCRIPT
          '''
        }
      }
    }
  }

  post {
    always {
      script {
        def commit = fileExists('DEPLOYHUB_COMMIT_SHA') ? readFile('DEPLOYHUB_COMMIT_SHA').trim() : 'unknown'
        echo "DeployHub result=${currentBuild.currentResult}; appPath=${params.APP_PATH}; branch=${params.BRANCH}; tag=${params.IMAGE_TAG}; commit=${commit}; message=${params.DEPLOYMENT_MESSAGE}"
      }
      sh '''#!/usr/bin/env bash
        rm -f -- "${ARCHIVE_PATH:-}" || true
      '''
    }
    success {
      echo 'REMOTE_DEPLOY_OK: deployment pipeline completed.'
    }
    failure {
      echo 'Deployment failed. Inspect the stage logs above.'
    }
  }
}

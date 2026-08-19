#!/usr/bin/env bash
set -euo pipefail
REPO_NAME="${1:-ten-day-readiness-tracker}"
VISIBILITY="${2:---private}"
if ! command -v gh >/dev/null 2>&1; then
  echo "GitHub CLI (gh) is required: https://cli.github.com/"
  exit 1
fi
if ! gh auth status >/dev/null 2>&1; then
  echo "Run: gh auth login"
  exit 1
fi
gh repo create "$REPO_NAME" "$VISIBILITY" --source=. --remote=origin --push
printf '\nCreated and pushed: %s\n' "$REPO_NAME"

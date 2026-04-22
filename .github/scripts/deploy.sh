#!/usr/bin/env bash

set -Eeuo pipefail

export PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:$PATH"

TARGET_BRANCH="${TARGET_BRANCH:-deploy}"
REPO_DIR="${REPO_DIR:-$HOME/blog.itjustbong}"
LOCK_FILE="${LOCK_FILE:-/tmp/blog-itjustbong-deploy.lock}"

exec 9>"$LOCK_FILE"
flock -n 9 || {
  echo "Another deployment is already running."
  exit 1
}

cd "$REPO_DIR"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Not a git repository: $REPO_DIR" >&2
  exit 1
fi

if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "Working tree is dirty. Refusing to deploy." >&2
  exit 1
fi

git fetch origin "$TARGET_BRANCH"

if ! git show-ref --verify --quiet "refs/remotes/origin/$TARGET_BRANCH"; then
  echo "Remote branch origin/$TARGET_BRANCH does not exist." >&2
  exit 1
fi

force_deploy=0
current_branch="$(git branch --show-current || true)"

if [ "$current_branch" != "$TARGET_BRANCH" ]; then
  if git show-ref --verify --quiet "refs/heads/$TARGET_BRANCH"; then
    git checkout "$TARGET_BRANCH"
  else
    git checkout -b "$TARGET_BRANCH" --track "origin/$TARGET_BRANCH"
  fi
  force_deploy=1
fi

ahead_count="$(git rev-list --count "origin/$TARGET_BRANCH..HEAD")"
behind_count="$(git rev-list --count "HEAD..origin/$TARGET_BRANCH")"

if [ "$ahead_count" -ne 0 ]; then
  echo "Local $TARGET_BRANCH has commits not on origin/$TARGET_BRANCH. Refusing to deploy." >&2
  exit 1
fi

if [ "$behind_count" -eq 0 ] && [ "$force_deploy" -eq 0 ]; then
  echo "No new commits on origin/$TARGET_BRANCH. Skipping rebuild."
  exit 0
fi

git pull --ff-only origin "$TARGET_BRANCH"

docker compose up -d --build

for port in 3000 3001 3002 3003; do
  for attempt in $(seq 1 30); do
    if curl -fsS "http://127.0.0.1:$port" >/dev/null; then
      echo "Health check passed on port $port."
      break
    fi

    if [ "$attempt" -eq 30 ]; then
      echo "Health check failed on port $port." >&2
      exit 1
    fi

    sleep 2
  done
done

echo "Deployed commit: $(git rev-parse --short HEAD)"
docker compose ps

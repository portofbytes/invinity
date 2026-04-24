#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# Invinity → GitHub Pages deploy.
#
# What it does (idempotent — safe to re-run):
#   1. Verifies prerequisites (git, gh, node).
#   2. Inits a local git repo if missing and commits.
#   3. Creates the GitHub repo (if missing) and pushes.
#   4. Enables GitHub Pages with "GitHub Actions" as the build source.
#   5. Syncs repo secrets + variables from deploy.env.
#   6. Pushes to main. The .github/workflows/deploy.yml workflow then builds
#      the static export and publishes to Pages automatically — every future
#      push triggers a fresh deploy.
#
# Prereqs (install once per machine):
#   - git   (https://git-scm.com)
#   - gh    (https://cli.github.com) → run `gh auth login` once
#   - node 20+
#
# Usage:
#   cp scripts/deploy.env.example scripts/deploy.env
#   # edit scripts/deploy.env
#   bash scripts/deploy.sh
# ---------------------------------------------------------------------------
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

if [[ -f "$SCRIPT_DIR/deploy.env" ]]; then
  # shellcheck disable=SC1091
  set -a; source "$SCRIPT_DIR/deploy.env"; set +a
fi

# --- Required ---------------------------------------------------------------
: "${GITHUB_REPO:?Set GITHUB_REPO=owner/repo (e.g. vik/invinity)}"

GIT_BRANCH="${GIT_BRANCH:-main}"
COMMIT_MESSAGE="${COMMIT_MESSAGE:-chore: deploy $(date -u +%Y-%m-%dT%H:%M:%SZ)}"
REPO_VISIBILITY="${REPO_VISIBILITY:-private}"   # or "public"

# Public (non-secret) keys → GitHub Actions *variables*
REPO_VARS=(
  BASE_PATH
  NEXT_PUBLIC_SITE_URL
  NEXT_PUBLIC_ANALYTICS_ID
  SQUARESPACE_STORE_URL
  SANITY_PROJECT_ID
  SANITY_DATASET
  EMAIL_FROM
  EMAIL_TO_HOUSE
  FORMSPREE_ENDPOINT
  CUSTOM_DOMAIN
)
# Sensitive keys → GitHub Actions *secrets*
REPO_SECRETS=(
  SQUARESPACE_API_KEY
  SANITY_READ_TOKEN
  RESEND_API_KEY
)

# --- Helpers ----------------------------------------------------------------
say()  { printf '\033[1;36m==>\033[0m %s\n' "$*"; }
warn() { printf '\033[1;33m!!\033[0m  %s\n' "$*" >&2; }
die()  { printf '\033[1;31mxx\033[0m  %s\n' "$*" >&2; exit 1; }
need() { command -v "$1" >/dev/null 2>&1 || die "Missing binary: $1"; }

# --- 1. Prereqs -------------------------------------------------------------
say "Checking prerequisites"
need git
need gh
need node
gh auth status >/dev/null 2>&1 || die "Run 'gh auth login' first"

cd "$ROOT_DIR"

# --- 2. Local git -----------------------------------------------------------
if [[ ! -d .git ]]; then
  say "Initializing git repo"
  git init -b "$GIT_BRANCH"
fi
git checkout -B "$GIT_BRANCH" >/dev/null

if [[ -n "$(git status --porcelain)" ]]; then
  say "Committing pending changes"
  git add -A
  git commit -m "$COMMIT_MESSAGE"
fi

# --- 3. GitHub repo ---------------------------------------------------------
if ! git remote get-url origin >/dev/null 2>&1; then
  if gh repo view "$GITHUB_REPO" >/dev/null 2>&1; then
    say "Repo $GITHUB_REPO already exists — attaching origin"
    git remote add origin "https://github.com/$GITHUB_REPO.git"
  else
    say "Creating GitHub repo $GITHUB_REPO ($REPO_VISIBILITY)"
    gh repo create "$GITHUB_REPO" "--$REPO_VISIBILITY" --source=. --remote=origin
  fi
fi

# --- 4. Enable GitHub Pages (source: GitHub Actions) ------------------------
say "Enabling GitHub Pages with Actions as source"
gh api -X POST "repos/$GITHUB_REPO/pages" \
  -f "build_type=workflow" >/dev/null 2>&1 || \
  gh api -X PUT "repos/$GITHUB_REPO/pages" \
    -f "build_type=workflow" >/dev/null 2>&1 || \
  warn "Pages may already be enabled — check repo Settings → Pages"

# --- 5. Sync variables + secrets -------------------------------------------
say "Syncing repo variables"
for KEY in "${REPO_VARS[@]}"; do
  VAL="${!KEY:-}"
  if [[ -z "$VAL" ]]; then
    warn "  skip var $KEY (not set)"
    continue
  fi
  gh variable set "$KEY" --repo "$GITHUB_REPO" --body "$VAL" >/dev/null
  say "  var  $KEY"
done

say "Syncing repo secrets"
for KEY in "${REPO_SECRETS[@]}"; do
  VAL="${!KEY:-}"
  if [[ -z "$VAL" ]]; then
    warn "  skip secret $KEY (not set)"
    continue
  fi
  gh secret set "$KEY" --repo "$GITHUB_REPO" --body "$VAL" >/dev/null
  say "  sec  $KEY"
done

# --- 6. Push — Actions takes over -------------------------------------------
say "Pushing to origin/$GIT_BRANCH"
git push -u origin "$GIT_BRANCH"

say "Done. GitHub Actions is now building + publishing to Pages."
say "Watch progress: gh run watch --repo $GITHUB_REPO"
say ""
say "Custom domain? Add CUSTOM_DOMAIN=yourdomain.com to deploy.env, re-run,"
say "then point an A record at 185.199.108.153 (also .109/.110/.111) or a"
say "CNAME to <user>.github.io at your DNS provider."

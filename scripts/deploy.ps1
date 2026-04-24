# ---------------------------------------------------------------------------
# Invinity -> GitHub Pages deploy (Windows PowerShell version).
#
# Runs from cmd or PowerShell. Equivalent to scripts/deploy.sh.
#
# Prereqs (install once per machine):
#   - git        (https://git-scm.com)
#   - gh         (https://cli.github.com)  ->  gh auth login
#   - node 20+   (https://nodejs.org)
#
# Usage from cmd:
#   copy scripts\deploy.env.example scripts\deploy.env
#   REM edit scripts\deploy.env
#   powershell -ExecutionPolicy Bypass -File scripts\deploy.ps1
#
# Usage from PowerShell:
#   Copy-Item scripts\deploy.env.example scripts\deploy.env
#   # edit scripts\deploy.env
#   .\scripts\deploy.ps1
# ---------------------------------------------------------------------------
$ErrorActionPreference = 'Stop'

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$rootDir   = Split-Path -Parent $scriptDir
$envFile   = Join-Path $scriptDir 'deploy.env'

function Say  ($m) { Write-Host "==> $m" -ForegroundColor Cyan }
function Warn ($m) { Write-Host "!!  $m" -ForegroundColor Yellow }
function Die  ($m) { Write-Host "xx  $m" -ForegroundColor Red; exit 1 }
function Need ($cmd) {
  if (-not (Get-Command $cmd -ErrorAction SilentlyContinue)) {
    Die "Missing binary: $cmd"
  }
}

# --- Load deploy.env --------------------------------------------------------
$cfg = @{}
if (Test-Path $envFile) {
  Get-Content $envFile | ForEach-Object {
    $line = $_.Trim()
    if ($line -and -not $line.StartsWith('#') -and $line.Contains('=')) {
      $parts = $line -split '=', 2
      $k = $parts[0].Trim()
      $v = $parts[1].Trim().Trim('"').Trim("'")
      $cfg[$k] = $v
      # Also expose as env var for the commit message etc.
      Set-Item -Path "Env:$k" -Value $v
    }
  }
} else {
  Die "scripts\deploy.env not found. Copy deploy.env.example and fill it in."
}

# --- Required --------------------------------------------------------------
if (-not $cfg.GITHUB_REPO) { Die 'GITHUB_REPO not set in deploy.env' }
$GITHUB_REPO      = $cfg.GITHUB_REPO
$GIT_BRANCH       = if ($cfg.GIT_BRANCH)       { $cfg.GIT_BRANCH }       else { 'main' }
$REPO_VISIBILITY  = if ($cfg.REPO_VISIBILITY)  { $cfg.REPO_VISIBILITY }  else { 'private' }
$COMMIT_MESSAGE   = if ($cfg.COMMIT_MESSAGE)   { $cfg.COMMIT_MESSAGE }   else { "chore: deploy $(Get-Date -Format o)" }

# Public (non-secret) keys -> repo variables
$REPO_VARS = @(
  'BASE_PATH',
  'NEXT_PUBLIC_SITE_URL',
  'NEXT_PUBLIC_ANALYTICS_ID',
  'SQUARESPACE_STORE_URL',
  'SANITY_PROJECT_ID',
  'SANITY_DATASET',
  'EMAIL_FROM',
  'EMAIL_TO_HOUSE',
  'FORMSPREE_ENDPOINT',
  'CUSTOM_DOMAIN'
)
# Sensitive -> repo secrets
$REPO_SECRETS = @(
  'SQUARESPACE_API_KEY',
  'SANITY_READ_TOKEN',
  'RESEND_API_KEY'
)

# --- 1. Prereqs ------------------------------------------------------------
Say 'Checking prerequisites'
Need 'git'
Need 'gh'
Need 'node'

& gh auth status *> $null
if ($LASTEXITCODE -ne 0) { Die "Run 'gh auth login' first" }

Set-Location $rootDir

# --- 2. Local git ----------------------------------------------------------
if (-not (Test-Path .git)) {
  Say 'Initializing git repo'
  git init -b $GIT_BRANCH | Out-Null
}
git checkout -B $GIT_BRANCH | Out-Null

$status = git status --porcelain
if ($status) {
  Say 'Committing pending changes'
  git add -A
  git commit -m $COMMIT_MESSAGE | Out-Null
}

# --- 3. GitHub repo --------------------------------------------------------
$hasOrigin = $true
try { git remote get-url origin *> $null } catch { $hasOrigin = $false }
if ($LASTEXITCODE -ne 0) { $hasOrigin = $false }

if (-not $hasOrigin) {
  & gh repo view $GITHUB_REPO *> $null
  if ($LASTEXITCODE -eq 0) {
    Say "Repo $GITHUB_REPO already exists - attaching origin"
    git remote add origin "https://github.com/$GITHUB_REPO.git"
  } else {
    Say "Creating GitHub repo $GITHUB_REPO ($REPO_VISIBILITY)"
    & gh repo create $GITHUB_REPO "--$REPO_VISIBILITY" --source=. --remote=origin
  }
}

# --- 4. Enable GitHub Pages (source: GitHub Actions) -----------------------
Say 'Enabling GitHub Pages with Actions as source'
& gh api -X POST "repos/$GITHUB_REPO/pages" -f 'build_type=workflow' *> $null
if ($LASTEXITCODE -ne 0) {
  & gh api -X PUT "repos/$GITHUB_REPO/pages" -f 'build_type=workflow' *> $null
  if ($LASTEXITCODE -ne 0) {
    Warn 'Pages may already be configured - check repo Settings -> Pages'
  }
}

# --- 5. Sync variables + secrets -------------------------------------------
Say 'Syncing repo variables'
foreach ($k in $REPO_VARS) {
  $v = $cfg[$k]
  if (-not $v) { Warn "  skip var $k (not set)"; continue }
  & gh variable set $k --repo $GITHUB_REPO --body $v | Out-Null
  Say "  var  $k"
}

Say 'Syncing repo secrets'
foreach ($k in $REPO_SECRETS) {
  $v = $cfg[$k]
  if (-not $v) { Warn "  skip secret $k (not set)"; continue }
  & gh secret set $k --repo $GITHUB_REPO --body $v | Out-Null
  Say "  sec  $k"
}

# --- 6. Push — Actions takes over ------------------------------------------
Say "Pushing to origin/$GIT_BRANCH"
git push -u origin $GIT_BRANCH

Say 'Done. GitHub Actions is now building + publishing to Pages.'
Say "Watch progress:  gh run watch --repo $GITHUB_REPO"

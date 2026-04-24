# ---------------------------------------------------------------------------
# Invinity bootstrap deploy (Windows, any machine).
#
# ONE command from cmd (or PowerShell):
#
#   powershell -ExecutionPolicy Bypass -Command ^
#     "iwr https://raw.githubusercontent.com/portofbytes/invinity/main/scripts/bootstrap.ps1 | iex"
#
# (cmd note: ^ line-continues. You can also paste as one line.)
#
# What it does:
#   1. Verifies prereqs (git, gh, node).
#   2. Clones (or fast-pulls) portofbytes/invinity into a dedicated Windows
#      directory: %USERPROFILE%\invinity  (override with INVINITY_DIR).
#   3. On first run: copies deploy.env.example -> deploy.env and opens it in
#      Notepad so you can fill in secrets. Waits for Notepad to close.
#   4. Runs scripts\deploy.ps1 to push variables/secrets into the repo and
#      trigger the GitHub Actions build + Pages publish.
# ---------------------------------------------------------------------------
$ErrorActionPreference = 'Stop'

# --- Configurable ----------------------------------------------------------
$repo      = 'portofbytes/invinity'
$branch    = 'main'
$targetDir = $env:INVINITY_DIR
if (-not $targetDir) {
  $targetDir = Join-Path $env:USERPROFILE 'invinity'
}

function Say  ($m) { Write-Host "==> $m" -ForegroundColor Cyan }
function Warn ($m) { Write-Host "!!  $m" -ForegroundColor Yellow }
function Die  ($m) { Write-Host "xx  $m" -ForegroundColor Red; exit 1 }
function Need ($c) {
  if (-not (Get-Command $c -ErrorAction SilentlyContinue)) { Die "Missing binary: $c" }
}

# --- 1. Prereqs ------------------------------------------------------------
Say 'Checking prerequisites (git, gh, node)'
Need 'git'
Need 'gh'
Need 'node'

& gh auth status *> $null
if ($LASTEXITCODE -ne 0) {
  Warn "gh CLI is not authenticated."
  Say  "Launching 'gh auth login' now..."
  & gh auth login
  if ($LASTEXITCODE -ne 0) { Die 'gh auth login did not complete' }
}

# --- 2. Clone or update ----------------------------------------------------
if (Test-Path (Join-Path $targetDir '.git')) {
  Say "Updating existing checkout at $targetDir"
  Push-Location $targetDir
  try {
    git fetch origin $branch
    git checkout $branch
    git pull --ff-only origin $branch
  } finally { Pop-Location }
} else {
  Say "Cloning $repo into $targetDir"
  $parent = Split-Path -Parent $targetDir
  if (-not (Test-Path $parent)) { New-Item -ItemType Directory -Force -Path $parent | Out-Null }
  git clone --branch $branch "https://github.com/$repo.git" $targetDir
}

Set-Location $targetDir

# Repo root for this Next.js project is the `site/` subdir if the top-level
# is a monorepo-style layout; fall back to the repo root itself otherwise.
$siteDir = if (Test-Path (Join-Path $targetDir 'site\package.json')) {
  Join-Path $targetDir 'site'
} else { $targetDir }
Set-Location $siteDir

# --- 3. deploy.env ---------------------------------------------------------
$envFile    = Join-Path $siteDir 'scripts\deploy.env'
$envExample = Join-Path $siteDir 'scripts\deploy.env.example'

if (-not (Test-Path $envFile)) {
  if (-not (Test-Path $envExample)) { Die "deploy.env.example missing in repo" }
  Copy-Item $envExample $envFile
  Say "Created $envFile from example."
  Say "Opening Notepad — fill in values, save, and close to continue."
  Start-Process -Wait notepad.exe $envFile
}

# --- 4. Run the deploy -----------------------------------------------------
$deploy = Join-Path $siteDir 'scripts\deploy.ps1'
if (-not (Test-Path $deploy)) { Die "deploy.ps1 missing at $deploy" }

Say "Running deploy.ps1"
& $deploy

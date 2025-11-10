# Simple script to push frontend to Marine repository
Write-Host "Pushing Frontend to Marine Repository..." -ForegroundColor Cyan

$repoPath = "F:\Placements\Marine internship project\Marine"

# Check if Marine repo exists, if not clone it
if (-Not (Test-Path $repoPath)) {
    Write-Host "Cloning Marine repository..." -ForegroundColor Yellow
    Set-Location "F:\Placements\Marine internship project"
    git clone https://github.com/NishantDX/Marine.git
}

# Navigate to repo
Set-Location $repoPath
Write-Host "Current location: $(Get-Location)" -ForegroundColor Gray

# Create frontend folder
Write-Host "Creating frontend folder..." -ForegroundColor Yellow
if (Test-Path ".\frontend") {
    Remove-Item ".\frontend" -Recurse -Force
}
New-Item -ItemType Directory -Path ".\frontend" | Out-Null

# Copy files
Write-Host "Copying frontend files..." -ForegroundColor Yellow
$source = "F:\Placements\Marine internship project\frontend\my-app"

Copy-Item "$source\*" ".\frontend\" -Recurse -Exclude "node_modules",".next","package-lock.json",".env.local"

# Copy docs to root
Write-Host "Copying documentation..." -ForegroundColor Yellow
Copy-Item "$source\AGENT_WORKFLOW.md" ".\AGENT_WORKFLOW.md" -Force -ErrorAction SilentlyContinue
Copy-Item "$source\REFLECTION.md" ".\REFLECTION.md" -Force -ErrorAction SilentlyContinue
Copy-Item "F:\Placements\Marine internship project\Marine-Root-README.md" ".\README.md" -Force -ErrorAction SilentlyContinue

# Git operations
Write-Host "Adding files to git..." -ForegroundColor Yellow
git add .

Write-Host "Committing..." -ForegroundColor Yellow
git commit -m "feat: Add FuelEU Maritime Compliance frontend with full functionality"

Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host ""
Write-Host "SUCCESS! Frontend pushed to https://github.com/NishantDX/Marine" -ForegroundColor Green

# PowerShell script to push frontend to Marine repository
# Author: GitHub Copilot
# Date: November 8, 2025

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  FuelEU Maritime - Frontend Push Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$sourcePath = "F:\Placements\Marine internship project\frontend\my-app"
$repoPath = "F:\Placements\Marine internship project\Marine"
$frontendDest = "$repoPath\frontend"

# Step 1: Check if repo exists
Write-Host "[1/7] Checking if Marine repository exists..." -ForegroundColor Yellow
if (-Not (Test-Path $repoPath)) {
    Write-Host "❌ Repository not found at: $repoPath" -ForegroundColor Red
    Write-Host "Please clone the repository first:" -ForegroundColor Yellow
    Write-Host "  git clone https://github.com/NishantDX/Marine.git" -ForegroundColor White
    exit 1
}
Write-Host "✅ Repository found!" -ForegroundColor Green
Write-Host ""

# Step 2: Navigate to repo
Write-Host "[2/7] Navigating to repository..." -ForegroundColor Yellow
Set-Location $repoPath
Write-Host "✅ Current directory: $(Get-Location)" -ForegroundColor Green
Write-Host ""

# Step 3: Check git status
Write-Host "[3/7] Checking git status..." -ForegroundColor Yellow
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "⚠️  Warning: Repository has uncommitted changes:" -ForegroundColor Yellow
    git status --short
    Write-Host ""
    $continue = Read-Host "Continue anyway? (y/n)"
    if ($continue -ne "y") {
        Write-Host "❌ Aborted by user" -ForegroundColor Red
        exit 1
    }
}
Write-Host "✅ Git status checked!" -ForegroundColor Green
Write-Host ""

# Step 4: Create frontend folder
Write-Host "[4/7] Creating frontend folder structure..." -ForegroundColor Yellow
if (Test-Path $frontendDest) {
    Write-Host "⚠️  Frontend folder already exists. Removing old version..." -ForegroundColor Yellow
    Remove-Item -Path $frontendDest -Recurse -Force
}
New-Item -ItemType Directory -Force -Path $frontendDest | Out-Null
Write-Host "✅ Frontend folder created!" -ForegroundColor Green
Write-Host ""

# Step 5: Copy files (excluding node_modules, .next, etc.)
Write-Host "[5/7] Copying frontend files..." -ForegroundColor Yellow
Write-Host "    Source: $sourcePath" -ForegroundColor Gray
Write-Host "    Destination: $frontendDest" -ForegroundColor Gray
Write-Host ""

$excludeDirs = @("node_modules", ".next", ".git")
$excludeFiles = @("package-lock.json", ".env.local")

Get-ChildItem -Path $sourcePath -Recurse | ForEach-Object {
    $relativePath = $_.FullName.Substring($sourcePath.Length)
    $destPath = Join-Path $frontendDest $relativePath
    
    # Skip excluded directories
    $skip = $false
    foreach ($dir in $excludeDirs) {
        if ($_.FullName -like "*\$dir\*" -or $_.Name -eq $dir) {
            $skip = $true
            break
        }
    }
    
    # Skip excluded files
    foreach ($file in $excludeFiles) {
        if ($_.Name -eq $file) {
            $skip = $true
            break
        }
    }
    
    if (-not $skip) {
        if ($_.PSIsContainer) {
            New-Item -ItemType Directory -Force -Path $destPath | Out-Null
        } else {
            Copy-Item -Path $_.FullName -Destination $destPath -Force
        }
    }
}

Write-Host "✅ Files copied successfully!" -ForegroundColor Green
Write-Host ""

# Step 6: Copy documentation to root
Write-Host "[6/7] Copying documentation files to repository root..." -ForegroundColor Yellow

# Copy AGENT_WORKFLOW.md if it doesn't exist in root
if (Test-Path "$sourcePath\AGENT_WORKFLOW.md") {
    Copy-Item "$sourcePath\AGENT_WORKFLOW.md" "$repoPath\AGENT_WORKFLOW.md" -Force
    Write-Host "    ✓ AGENT_WORKFLOW.md copied" -ForegroundColor Gray
}

# Copy REFLECTION.md if it doesn't exist in root
if (Test-Path "$sourcePath\REFLECTION.md") {
    Copy-Item "$sourcePath\REFLECTION.md" "$repoPath\REFLECTION.md" -Force
    Write-Host "    ✓ REFLECTION.md copied" -ForegroundColor Gray
}

# Copy main README if exists
if (Test-Path "F:\Placements\Marine internship project\Marine-Root-README.md") {
    Copy-Item "F:\Placements\Marine internship project\Marine-Root-README.md" "$repoPath\README.md" -Force
    Write-Host "    ✓ Main README.md copied" -ForegroundColor Gray
}

Write-Host "✅ Documentation copied!" -ForegroundColor Green
Write-Host ""

# Step 7: Git operations
Write-Host "[7/7] Committing and pushing to GitHub..." -ForegroundColor Yellow
Write-Host ""

# Add files
Write-Host "    Adding files to git..." -ForegroundColor Gray
git add frontend/
git add AGENT_WORKFLOW.md
git add REFLECTION.md
git add README.md

# Show what will be committed
Write-Host ""
Write-Host "    Files to be committed:" -ForegroundColor Cyan
git status --short
Write-Host ""

# Commit
Write-Host "    Creating commit..." -ForegroundColor Gray
git commit -m "feat: Add FuelEU Maritime Compliance frontend with full functionality"

# Push
Write-Host ""
Write-Host "    Pushing to GitHub..." -ForegroundColor Gray
git push origin main

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  ✅ SUCCESS!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Frontend successfully pushed to:" -ForegroundColor White
Write-Host "  https://github.com/NishantDX/Marine" -ForegroundColor Cyan
Write-Host ""
Write-Host "Repository structure:" -ForegroundColor White
Write-Host "  Marine/" -ForegroundColor Gray
Write-Host "  ├── frontend/          (✅ Added)" -ForegroundColor Green
Write-Host "  ├── backend/           (Existing)" -ForegroundColor Gray
Write-Host "  ├── README.md          (✅ Updated)" -ForegroundColor Green
Write-Host "  ├── AGENT_WORKFLOW.md  (✅ Added)" -ForegroundColor Green
Write-Host "  └── REFLECTION.md      (✅ Added)" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Visit https://github.com/NishantDX/Marine" -ForegroundColor White
Write-Host "  2. Verify all files are present" -ForegroundColor White
Write-Host "  3. Update repository description" -ForegroundColor White
Write-Host ""

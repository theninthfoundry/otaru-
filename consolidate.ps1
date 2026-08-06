# consolidate.ps1
# 1. Verify we are in the correct directory (C:\Users\namir\OneDrive\Desktop\otaru)
$currentDir = Get-Location
if ($currentDir.Path -notlike "*otaru") {
    Write-Error "Please run this script from the C:\Users\namir\OneDrive\Desktop\otaru root directory."
    exit
}

Write-Host "Starting repository consolidation..." -ForegroundColor Green

# 2. Create a temporary folder
$tempDir = Join-Path $currentDir.Path "temp_consolidation"
if (Test-Path $tempDir) {
    Remove-Item -Recurse -Force $tempDir
}
New-Item -ItemType Directory -Path $tempDir | Out-Null

# 3. Move all contents of otaru- to the temporary folder
Write-Host "Staging new project files from otaru-..." -ForegroundColor Cyan
Get-ChildItem -Path "otaru-" -Force | ForEach-Object {
    Move-Item -Path $_.FullName -Destination $tempDir -Force
}

# 4. Remove all legacy files and folders from root (except .git, consolidate.ps1, and the temp folder)
Write-Host "Cleaning legacy files..." -ForegroundColor Cyan
Get-ChildItem -Path "." -Force | ForEach-Object {
    $name = $_.Name
    if ($name -ne ".git" -and $name -ne "consolidate.ps1" -and $name -ne "temp_consolidation" -and $name -ne "otaru-") {
        Remove-Item -Path $_.FullName -Recurse -Force
    }
}

# 5. Remove the now-empty otaru- folder
if (Test-Path "otaru-") {
    Remove-Item -Path "otaru-" -Recurse -Force
}

# 6. Move new files from the temp folder to root
Write-Host "Moving new project files to root..." -ForegroundColor Cyan
Get-ChildItem -Path $tempDir -Force | ForEach-Object {
    Move-Item -Path $_.FullName -Destination $currentDir.Path -Force
}

# 7. Cleanup the temp folder
Remove-Item -Path $tempDir -Recurse -Force

Write-Host "Consolidation completed successfully! Please run 'npm install' to update dependencies." -ForegroundColor Green

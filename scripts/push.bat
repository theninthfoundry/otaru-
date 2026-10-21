@echo off
setlocal enabledelayedexpansion
echo ==========================================================
echo  House of Otaru - 40 Atomic Commits Release Pipeline
echo ==========================================================

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0make-40-commits.ps1"

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Pipeline encountered an error.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo ==========================================================
echo  Pushing commits to origin/main...
echo ==========================================================
git push origin main

echo.
echo ==========================================================
echo  All commits successfully synchronized and pushed.
echo ==========================================================
pause

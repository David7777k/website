<#
start.ps1

Simple helper to start the frontend and backend on Windows (PowerShell).

What it does:
- Opens one PowerShell window for the backend and one for the frontend
- Creates a Python virtual environment in `backend/.venv` and installs requirements if missing
- Starts the backend with uvicorn on port 8000
- Starts the frontend with `yarn start` (falls back to `npm start`)

Usage:
  Right-click -> Run with PowerShell (or from a PowerShell prompt run `./start.ps1`)

#>

$Root = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "Starting project from: $Root"

# Backend command: create venv if needed, install requirements, run uvicorn
$backendScript = @"
Set-Location -Path '$Root\backend'
if (-not (Test-Path '.venv')) {
    Write-Host 'Creating Python virtual environment (.venv) and installing requirements (this may take a minute)...'
    python -m venv .venv
    & '.\.venv\Scripts\pip.exe' install --upgrade pip
    & '.\.venv\Scripts\pip.exe' install -r requirements.txt
}
Write-Host 'Starting backend (uvicorn) on http://localhost:8000'
& '.\.venv\Scripts\python.exe' -m uvicorn server:app --reload --port 8000
"@

Start-Process -FilePath 'powershell.exe' -ArgumentList '-NoExit', '-Command', $backendScript -WorkingDirectory "$Root\backend"

# Frontend command: use yarn if available, otherwise npm
$frontendScript = @"
Set-Location -Path '$Root\frontend'
if (Test-Path 'yarn.lock') {
    Write-Host 'Detected yarn.lock -> running: yarn start'
    yarn start
} else {
    Write-Host 'No yarn.lock -> running: npm start'
    npm start
}
"@

Start-Process -FilePath 'powershell.exe' -ArgumentList '-NoExit', '-Command', $frontendScript -WorkingDirectory "$Root\frontend"

Write-Host "Launched frontend and backend in separate PowerShell windows."

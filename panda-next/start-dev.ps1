<#
start-dev.ps1

Automates development startup for the panda-next app on Windows (PowerShell).

What it does:
- ensures .env exists (copies from .env.example if missing)
- runs npm install
- runs prisma generate and prisma migrate dev
- runs prisma seed script
- starts Next dev server

Run from the `panda-next` folder or double-click the script in Explorer.
#>

$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location -Path $Root

Write-Host "Working dir: $Root"

if (-not (Test-Path '.env')) {
    if (Test-Path '.env.example') {
        Copy-Item '.env.example' '.env'
        Write-Host "Copied .env.example -> .env (edit .env to add provider keys if needed)"
    } else {
        Write-Host "No .env.example found; create .env manually if needed"
    }
}

Write-Host 'Installing npm dependencies (this may take a few minutes)...'
npm install

Write-Host 'Generating Prisma client...'
npx prisma generate

Write-Host 'Applying Prisma migrations (dev)...'
npx prisma migrate dev --name init

Write-Host 'Running seed script...'
npm run prisma:seed

Write-Host 'Starting Next dev server...'
npm run dev

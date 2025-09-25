<#
start.ps1

Улучшенный helper для запуска сервисов проекта на Windows (PowerShell).

Возможности:
- Интерактивное меню или запуск по флагу
- Открывает отдельные PowerShell-окна для backend, frontend и panda-next
- Автоматически создаёт виртуальное окружение для backend и устанавливает зависимости
- Автоматически устанавливает зависимости для frontend и panda-next если нужно

Примеры:
  ./start.ps1          # интерактивное меню
  ./start.ps1 -All     # запустить backend, frontend и panda-next
  ./start.ps1 -Backend # запустить только backend
  ./start.ps1 -Install # установить зависимости для всех компонентов

#>

param(
    [switch]$All,
    [switch]$Backend,
    [switch]$Frontend,
    [switch]$PandaNext,
    [switch]$Install
)

$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
Write-Host "Project root: $Root"

function Start-BackendWindow {
    $script = @'
Set-Location -Path .
if (-not (Test-Path '.venv')) {
    python -m venv .venv
    .\.venv\Scripts\pip.exe install --upgrade pip
    .\.venv\Scripts\pip.exe install -r requirements.txt
}
.
.venv\Scripts\python.exe -m uvicorn server:app --reload --port 8000
'@
    Start-Process -FilePath 'powershell.exe' -ArgumentList '-NoExit','-Command',$script -WorkingDirectory "$Root\backend"
}

function Start-FrontendWindow {
    $script = @'
Set-Location -Path .
if (Test-Path 'yarn.lock') {
    yarn install
    yarn start
} else {
    if (-not (Test-Path 'node_modules')) { npm install }
    npm start
}
'@
    Start-Process -FilePath 'powershell.exe' -ArgumentList '-NoExit','-Command',$script -WorkingDirectory "$Root\frontend"
}

function Start-PandaNextWindow {
    $script = @'
Set-Location -Path .
if (-not (Test-Path 'node_modules')) {
    npm install
}
npm run dev
'@
    Start-Process -FilePath 'powershell.exe' -ArgumentList '-NoExit','-Command',$script -WorkingDirectory "$Root\panda-next"
}

function Install-AllDeps {
    Push-Location "$Root\backend"
    if (-not (Test-Path '.venv')) { python -m venv .venv }
    .\.venv\Scripts\pip.exe install --upgrade pip
    .\.venv\Scripts\pip.exe install -r requirements.txt
    Pop-Location

    Push-Location "$Root\frontend"
    if (Test-Path 'yarn.lock') { yarn install } else { npm install }
    Pop-Location

    Push-Location "$Root\panda-next"
    npm install
    Pop-Location
}

if ($Install) { Install-AllDeps; return }
if ($All) { Start-BackendWindow; Start-FrontendWindow; Start-PandaNextWindow; return }
if ($Backend) { Start-BackendWindow; return }
if ($Frontend) { Start-FrontendWindow; return }
if ($PandaNext) { Start-PandaNextWindow; return }

# interactive menu
Write-Host "Select: 1) backend 2) frontend 3) panda-next 4) all 5) install 0) exit"
$choice = Read-Host "Choice"
switch ($choice) {
    '1' { Start-BackendWindow }
    '2' { Start-FrontendWindow }
    '3' { Start-PandaNextWindow }
    '4' { Start-BackendWindow; Start-FrontendWindow; Start-PandaNextWindow }
    '5' { Install-AllDeps }
    default { Write-Host 'Exit' }
}

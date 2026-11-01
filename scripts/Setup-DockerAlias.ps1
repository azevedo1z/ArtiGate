<#
.SYNOPSIS
    Prepares the local ArtiGate Docker environment and optionally starts it.

.DESCRIPTION
    Checks Docker and the SQL Server host port, configures the artigate function
    in the current PowerShell profile, and starts the Compose stack unless
    -SkipUp is specified. Node.js runs inside the containers, so a host Node.js
    installation is not required by this setup.

.PARAMETER SkipUp
    Configures the profile and performs prerequisite checks without starting Compose.

.EXAMPLE
    powershell -ExecutionPolicy Bypass -File .\scripts\Setup-DockerAlias.ps1

.EXAMPLE
    powershell -ExecutionPolicy Bypass -File .\scripts\Setup-DockerAlias.ps1 -SkipUp
#>

[CmdletBinding()]
param(
    [Parameter(Mandatory = $false)]
    [switch]$SkipUp
)

$ErrorActionPreference = 'Stop'
$composeFile = (Resolve-Path (Join-Path $PSScriptRoot '..\compose.yaml')).Path
$composeDirectory = Split-Path -Parent $composeFile
$dockerPortOwners = @('com.docker.backend', 'wslrelay', 'vpnkit', 'docker-proxy')

function Write-Step([string]$Message) {
    Write-Host "[Setup-ArtiGate] $Message"
}

function Write-Notice([string]$Message) {
    Write-Host "[Setup-ArtiGate] WARNING: $Message" -ForegroundColor Yellow
}

function Write-Failure([string]$Message) {
    Write-Host "[Setup-ArtiGate] ERROR: $Message" -ForegroundColor Red
}

# In Windows PowerShell 5.1, native stderr can become a terminating error under Stop.
function Invoke-Quietly([scriptblock]$Command) {
    $previousPreference = $ErrorActionPreference
    $ErrorActionPreference = 'Continue'
    try {
        & $Command *> $null
        return $LASTEXITCODE -eq 0
    }
    finally {
        $ErrorActionPreference = $previousPreference
    }
}

function Get-DotEnvValue([string]$Path, [string]$Name) {
    $pattern = '^\s*' + [regex]::Escape($Name) + '\s*=\s*(.*?)\s*$'
    $line = Get-Content -LiteralPath $Path | Where-Object { $_ -match $pattern } | Select-Object -First 1
    if (-not $line) {
        return $null
    }

    $value = [regex]::Match($line, $pattern).Groups[1].Value
    if ($value.Length -ge 2 -and (($value[0] -eq '"' -and $value[$value.Length - 1] -eq '"') -or ($value[0] -eq "'" -and $value[$value.Length - 1] -eq "'"))) {
        $value = $value.Substring(1, $value.Length - 2)
    }

    return $value
}

# 1. Docker CLI and daemon
Write-Step 'Checking Docker...'

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Failure 'Docker CLI was not found. Install Docker Desktop: https://www.docker.com/products/docker-desktop/'
    exit 1
}

if (-not (Invoke-Quietly { docker info })) {
    Write-Failure 'Docker Engine is not responding. Start Docker Desktop, wait until it is ready, then run this setup again.'
    exit 1
}

if (-not (Invoke-Quietly { docker compose version })) {
    Write-Failure 'Docker Compose v2 is unavailable. Update or repair Docker Desktop, then run this setup again.'
    exit 1
}

# 2. Host SQL Server port
Write-Step 'Checking host port 1433...'

$localSqlServer = Get-Service -Name 'MSSQLSERVER' -ErrorAction SilentlyContinue
if ($localSqlServer -and $localSqlServer.Status -eq 'Running') {
    Write-Failure 'The local MSSQLSERVER service may occupy port 1433, which this Compose stack publishes for its SQL Server container.'
    Write-Failure "Stop that service in an elevated PowerShell (Stop-Service MSSQLSERVER), or use another SQL Server port, then retry."
    exit 1
}

$portListener = Get-NetTCPConnection -LocalPort 1433 -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1
if ($portListener) {
    $ownerName = (Get-Process -Id $portListener.OwningProcess -ErrorAction SilentlyContinue).ProcessName
    if ($ownerName -and $dockerPortOwners -notcontains $ownerName) {
        Write-Failure "Port 1433 is occupied by '$ownerName' (PID $($portListener.OwningProcess)). Free the port, then retry."
        exit 1
    }
}

# 3. Install/update the current user's profile function
Write-Step "Configuring 'artigate' in $PROFILE..."

$escapedComposeFile = $composeFile.Replace("'", "''")
$functionDefinition = "function artigate { docker compose -f '$escapedComposeFile' @args }"

if (-not (Test-Path -LiteralPath $PROFILE)) {
    $profileDirectory = Split-Path -Parent $PROFILE
    New-Item -ItemType Directory -Path $profileDirectory -Force | Out-Null
    New-Item -ItemType File -Path $PROFILE -Force | Out-Null
}

$profileContent = [System.IO.File]::ReadAllText($PROFILE)
$functionPattern = '(?m)^function\s+artigate\s*\{(?:[^\r\n]*\}|(?s:.*?^\}))'
if ([regex]::IsMatch($profileContent, $functionPattern)) {
    $profileContent = [regex]::Replace(
        $profileContent,
        $functionPattern,
        [System.Text.RegularExpressions.MatchEvaluator]{ param($match) $functionDefinition },
        1
    )
} else {
    if ($profileContent.Length -gt 0 -and -not $profileContent.EndsWith("`n")) {
        $profileContent += "`r`n"
    }
    $profileContent += $functionDefinition + "`r`n"
}

[System.IO.File]::WriteAllText($PROFILE, $profileContent, [System.Text.UTF8Encoding]::new($true))
Write-Step "Configured 'artigate' for $composeFile. Open a new PowerShell session to load it."

$executionPolicy = Get-ExecutionPolicy
if ($executionPolicy -eq 'Restricted' -or $executionPolicy -eq 'AllSigned') {
    Write-Notice "The current execution policy ('$executionPolicy') can prevent PowerShell from loading `$PROFILE, so 'artigate' will not be available automatically."
    Write-Notice 'To allow local scripts for your account: Set-ExecutionPolicy -Scope CurrentUser RemoteSigned'
}

Write-Notice "This function is installed only in this PowerShell profile ($($PSVersionTable.PSEdition) $($PSVersionTable.PSVersion)). Run setup again in another PowerShell edition if you use one."

# 4. Optional Compose startup
if ($SkipUp) {
    Write-Step "Setup complete. Start the stack later with: artigate up -d"
    exit 0
}

$envFile = Join-Path $composeDirectory '.env'
if (-not (Test-Path -LiteralPath $envFile)) {
    Write-Failure "Required file not found: $envFile"
    Write-Failure "Create it from the template: Copy-Item '$(Join-Path $composeDirectory '.env.example')' '$envFile', then set SQLSERVER_SA_PASSWORD and JWT_SECRET."
    exit 1
}

$sqlPassword = Get-DotEnvValue -Path $envFile -Name 'SQLSERVER_SA_PASSWORD'
$jwtSecret = Get-DotEnvValue -Path $envFile -Name 'JWT_SECRET'
if ([string]::IsNullOrWhiteSpace($sqlPassword) -or $sqlPassword.Contains('<')) {
    Write-Failure 'Set a real SQLSERVER_SA_PASSWORD in .env before starting the stack.'
    exit 1
}
$passwordCategories = 0
if ($sqlPassword -cmatch '[A-Z]') { $passwordCategories++ }
if ($sqlPassword -cmatch '[a-z]') { $passwordCategories++ }
if ($sqlPassword -match '\d') { $passwordCategories++ }
if ($sqlPassword -match '[^a-zA-Z0-9]') { $passwordCategories++ }
if ($sqlPassword.Length -lt 8 -or $passwordCategories -lt 3) {
    Write-Failure 'SQLSERVER_SA_PASSWORD must be at least 8 characters and include 3 of these 4 groups: uppercase, lowercase, digits, symbols.'
    exit 1
}
if ($sqlPassword.Contains(';')) {
    Write-Failure 'SQLSERVER_SA_PASSWORD cannot contain semicolons because Compose places it in a semicolon-delimited SQL Server URL.'
    exit 1
}
if ([string]::IsNullOrWhiteSpace($jwtSecret) -or $jwtSecret.Contains('<') -or $jwtSecret.Length -lt 32) {
    Write-Failure 'Set a JWT_SECRET of at least 32 characters in .env before starting the stack.'
    exit 1
}

Write-Step 'Validating the Compose configuration...'
if (-not (Invoke-Quietly { docker compose -f $composeFile config --quiet })) {
    Write-Failure 'Compose configuration is invalid. Check .env and compose.yaml, then retry.'
    exit 1
}

Write-Step 'Starting the ArtiGate development stack...'
$previousPreference = $ErrorActionPreference
$ErrorActionPreference = 'Continue'
docker compose -f $composeFile up -d
$upExitCode = $LASTEXITCODE
$ErrorActionPreference = $previousPreference

if ($upExitCode -ne 0) {
    Write-Failure "docker compose up failed with exit code $upExitCode. Inspect services with: artigate logs"
    exit 2
}

Write-Step 'ArtiGate stack started.'
Write-Step '  Frontend : http://localhost:3001'
Write-Step '  API      : http://localhost:3000'
Write-Step '  SQLServer: localhost,1433'
Write-Step 'Follow initialization with: artigate logs -f migrations'
exit 0

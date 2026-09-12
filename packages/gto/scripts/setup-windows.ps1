#Requires -Version 5.1
<#
setup-windows.ps1 — solver appliance setup for the Windows desktop.

Idempotent: safe to re-run anytime. Pulls the latest CI-published image,
(re)creates the solver container, opens the firewall port,
and publishes the solver at a named HTTPS URL on the tailnet.

Run from an ELEVATED PowerShell (firewall rule needs admin):
  irm https://raw.githubusercontent.com/JulienDanh/straddle/main/packages/gto/scripts/setup-windows.ps1 | iex
or clone the repo and run:
  .\packages\gto\scripts\setup-windows.ps1

Requires (checked, not installed by this script):
  - Docker Desktop running           (winget install Docker.DockerDesktop)
  - Tailscale logged in              (winget install Tailscale.Tailscale)
#>

$ErrorActionPreference = "Stop"
$Image = "ghcr.io/juliendanh/gto-server:latest"

# --- prerequisites -----------------------------------------------------------
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "Docker is missing. Run: winget install Docker.DockerDesktop" -ForegroundColor Red
    exit 1
}
if (-not (Get-Command tailscale -ErrorAction SilentlyContinue)) {
    Write-Host "Tailscale is missing. Run: winget install Tailscale.Tailscale" -ForegroundColor Red
    exit 1
}

# --- firewall (admin) ---------------------------------------------------------
if (-not (Get-NetFirewallRule -DisplayName "gto-solver" -ErrorAction SilentlyContinue)) {
    try {
        New-NetFirewallRule -DisplayName "gto-solver" -Direction Inbound -Action Allow -Protocol TCP -LocalPort 8080 | Out-Null
        Write-Host "firewall: inbound TCP 8080 allowed"
    } catch {
        Write-Host "firewall: could not add rule (not admin?) — allow 8080 manually if solves are unreachable" -ForegroundColor Yellow
    }
}

# --- solver container ----------------------------------------------------------
Write-Host "pulling $Image ..."
docker pull $Image
if (docker ps -a --format "{{.Names}}" | Where-Object { $_ -eq "gto-solver" }) {
    docker rm -f gto-solver | Out-Null
}
docker run -d --restart unless-stopped -p 8080:8080 --name gto-solver $Image | Out-Null
Write-Host "solver: $(docker ps --filter name=gto-solver --format '{{.Status}}')"

# --- watchtower removal (abandoned) ------------------------------------------------
# containrrr/watchtower crash-loops on modern daemons (old client API) and the
# image is unmaintained. Updates are manual: re-run this script — it pulls the
# latest CI image and recreates the solver.
if (docker ps -a --format "{{.Names}}" | Where-Object { $_ -eq "watchtower" }) {
    docker rm -f watchtower | Out-Null
    Write-Host "watchtower: removed"
}

# --- named HTTPS URL on the tailnet ----------------------------------------------
# https://<machine>.<tailnet>.ts.net — re-running when already serving is fine
$serve = tailscale serve --bg 8080 2>&1
Write-Host "tailscale serve: $serve"
Write-Host "tailnet serve status:" (tailscale serve status 2>&1)

# --- ssh access for the agent (Mac) -----------------------------------------------
# Enables the Windows OpenSSH server and installs the study laptop's key,
# so the Mac can run remote commands (docker, solves) over the tailnet.
$AgentKey = "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIDXkCuBpzEyHPPuitJw3R45BZOL0TK2zi537azoYHFuk agent-mac"

$cap = Get-WindowsCapability -Online -Name "OpenSSH.Server*"
if ($cap.State -ne "Installed") {
    Add-WindowsCapability -Online -Name "OpenSSH.Server~~~~0.0.1.0" | Out-Null
    Write-Host "ssh: OpenSSH server installed"
}
if ((Get-Service sshd -ErrorAction SilentlyContinue).Status -ne "Running") {
    Start-Service sshd
}
Set-Service -Name sshd -StartupType Automatic

$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if ($isAdmin) {
    # sshd routes admin accounts here by default
    $keyFile = "C:\ProgramData\ssh\administrators_authorized_keys"
    if (-not (Test-Path $keyFile) -or -not (Select-String -Path $keyFile -SimpleMatch $AgentKey -Quiet)) {
        Add-Content -Path $keyFile -Value $AgentKey
        icacls $keyFile /inheritance:r /grant "Administrators:F" /grant "SYSTEM:F" | Out-Null
        Write-Host "ssh: agent key added (admin)"
    }
} else {
    New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.ssh" | Out-Null
    $keyFile = "$env:USERPROFILE\.ssh\authorized_keys"
    if (-not (Test-Path $keyFile) -or -not (Select-String -Path $keyFile -SimpleMatch $AgentKey -Quiet)) {
        Add-Content -Path $keyFile -Value $AgentKey
        Write-Host "ssh: agent key added (user)"
    }
}
Write-Host "ssh: server $(Get-Service sshd).Status; log in as $env:USERNAME"

# --- summary ----------------------------------------------------------------------
$ip = tailscale ip -4
Write-Host ""
Write-Host "solver HTTP   : http://${ip}:8080/health"
Write-Host "solver HTTPS  : see serve status above"
Write-Host "updates       : re-run this script (pulls latest image, recreates solver)"

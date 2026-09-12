#Requires -RunAsAdministrator
<#
setup-ssh.ps1 — enable the Windows OpenSSH server and install the agent key.

Standalone version of the SSH section of setup-windows.ps1, so the slow
OpenSSH feature install can run (and be debugged) on its own. Idempotent:
safe to re-run; skips anything already in place.

Run from an ELEVATED PowerShell:
  irm https://raw.githubusercontent.com/JulienDanh/straddle/main/packages/gto/scripts/setup-ssh.ps1 | iex
or from a repo clone:
  .\packages\gto\scripts\setup-ssh.ps1

After it prints "log in as <name>", the Mac connects with:
  ssh <name>@<tailscale-ip>
#>

$ErrorActionPreference = "Stop"
$AgentKey = "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIDXkCuBpzEyHPPuitJw3R45BZOL0TK2zi537azoYHFuk agent-mac"

Write-Host "1/4 checking OpenSSH server capability (this can take a minute)..."
$cap = Get-WindowsCapability -Online -Name "OpenSSH.Server*"
if ($cap.State -ne "Installed") {
    Write-Host "      installing OpenSSH server (slow: downloads from Windows Update)..."
    Add-WindowsCapability -Online -Name "OpenSSH.Server~~~~0.0.1.0" | Out-Null
    Write-Host "      installed"
} else {
    Write-Host "      already installed"
}

Write-Host "2/4 starting sshd service..."
if ((Get-Service sshd -ErrorAction SilentlyContinue).Status -ne "Running") {
    Start-Service sshd
}
Set-Service -Name sshd -StartupType Automatic
Write-Host "      sshd is $((Get-Service sshd).Status), starts at boot"

Write-Host "3/4 installing the agent key..."
$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if ($isAdmin) {
    # sshd routes admin logins to this file by default
    $keyFile = "C:\ProgramData\ssh\administrators_authorized_keys"
    if (-not (Test-Path $keyFile) -or -not (Select-String -Path $keyFile -SimpleMatch $AgentKey -Quiet)) {
        Add-Content -Path $keyFile -Value $AgentKey
        icacls $keyFile /inheritance:r /grant "Administrators:F" /grant "SYSTEM:F" | Out-Null
        Write-Host "      key added to $keyFile (admin account)"
    } else {
        Write-Host "      key already present"
    }
} else {
    New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.ssh" | Out-Null
    $keyFile = "$env:USERPROFILE\.ssh\authorized_keys"
    if (-not (Test-Path $keyFile) -or -not (Select-String -Path $keyFile -SimpleMatch $AgentKey -Quiet)) {
        Add-Content -Path $keyFile -Value $AgentKey
        Write-Host "      key added to $keyFile (user account)"
    } else {
        Write-Host "      key already present"
    }
}

Write-Host "4/4 checking the firewall rule for port 22..."
if (-not (Get-NetFirewallRule -DisplayName "OpenSSH-Server-In-TCP" -ErrorAction SilentlyContinue)) {
    New-NetFirewallRule -DisplayName "OpenSSH-Server-In-TCP" -Direction Inbound -Action Allow -Protocol TCP -LocalPort 22 | Out-Null
    Write-Host "      firewall rule added"
} else {
    Write-Host "      firewall rule present"
}

Write-Host ""
Write-Host "done — log in as: $env:USERNAME"

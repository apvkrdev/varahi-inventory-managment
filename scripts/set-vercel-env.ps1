<#
set-vercel-env.ps1

Usage:
  - Adds environment variables to a Vercel project using Vercel CLI.
  - Requires `vercel` CLI installed and `VERCEL_TOKEN` available.

Examples:
  $env:VERCEL_TOKEN = '...' ; ./scripts/set-vercel-env.ps1 -ProjectName 'varahi-inventory-managment' -Scope 'your-org'
#>

param(
    [string]$ProjectName = "varahi-inventory-managment",
    [string]$Scope = $null,
    [string]$MongodbUri = $null,
    [string]$NextAuthSecret = $null,
    [string]$NextAuthUrl = $null,
    [string]$VercelToken = $env:VERCEL_TOKEN
)

function PromptIfNull([string]$val, [string]$prompt) {
    if ([string]::IsNullOrEmpty($val)) { return Read-Host -Prompt $prompt }
    return $val
}

$Scope = PromptIfNull $Scope "Vercel scope (org/team)"
$MongodbUri = PromptIfNull $MongodbUri "MONGODB_URI"
$NextAuthSecret = PromptIfNull $NextAuthSecret "NEXTAUTH_SECRET"
$NextAuthUrl = PromptIfNull $NextAuthUrl "NEXTAUTH_URL"

Write-Host "Adding env vars to Vercel project: $ProjectName (scope: $Scope)" -ForegroundColor Cyan

# The vercel CLI supports adding environment variables. Example commands:
vercel env add MONGODB_URI "$MongodbUri" preview --token "$VercelToken" --scope "$Scope" --confirm
vercel env add NEXTAUTH_SECRET "$NextAuthSecret" preview --token "$VercelToken" --scope "$Scope" --confirm
vercel env add NEXTAUTH_URL "$NextAuthUrl" preview --token "$VercelToken" --scope "$Scope" --confirm

Write-Host "Vercel env commands executed (check Vercel dashboard to confirm)." -ForegroundColor Cyan

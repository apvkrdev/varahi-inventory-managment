<#
set-github-secrets.ps1

Usage:
  - Run interactively and enter values when prompted, or pass parameters.
  - Requires GitHub CLI (`gh`) installed and authenticated.

Examples:
  ./scripts/set-github-secrets.ps1
  ./scripts/set-github-secrets.ps1 -Repo "apvkrdev/varahi-inventory-managment" -DevNextAuthSecret "..." -DevNextAuthUrl "https://..." -DevMongodbUri "mongodb+srv://..."
#>

param(
    [string]$Repo = "apvkrdev/varahi-inventory-managment",
    [string]$DevNextAuthSecret = $null,
    [string]$DevNextAuthUrl = $null,
    [string]$DevMongodbUri = $null,
    [string]$VercelToken = $null,
    [string]$VercelOrgId = $null,
    [string]$VercelProjectIdDev = $null
)

function PromptIfNull([string]$val, [string]$prompt) {
    if ([string]::IsNullOrEmpty($val)) {
        return Read-Host -Prompt $prompt
    }
    return $val
}

$DevNextAuthSecret = PromptIfNull $DevNextAuthSecret "DEV_NEXTAUTH_SECRET"
$DevNextAuthUrl = PromptIfNull $DevNextAuthUrl "DEV_NEXTAUTH_URL"
$DevMongodbUri = PromptIfNull $DevMongodbUri "DEV_MONGODB_URI"
$VercelToken = PromptIfNull $VercelToken "VERCEL_TOKEN (optional, only needed if you intend to set Vercel via CLI)"
$VercelOrgId = PromptIfNull $VercelOrgId "VERCEL_ORG_ID (optional)"
$VercelProjectIdDev = PromptIfNull $VercelProjectIdDev "VERCEL_PROJECT_ID_DEV (optional)"

Write-Host "Setting GitHub Actions secrets for repository: $Repo" -ForegroundColor Cyan

function SetSecret([string]$name, [string]$value) {
    Write-Host "Setting secret: $name" -NoNewline
    gh secret set $name --repo $Repo --body "$value" | Out-Null
    if ($LASTEXITCODE -eq 0) { Write-Host " - OK" -ForegroundColor Green } else { Write-Host " - FAILED" -ForegroundColor Red }
}

SetSecret -name 'DEV_NEXTAUTH_SECRET' -value $DevNextAuthSecret
SetSecret -name 'DEV_NEXTAUTH_URL' -value $DevNextAuthUrl
SetSecret -name 'DEV_MONGODB_URI' -value $DevMongodbUri

if ($VercelToken) { SetSecret -name 'VERCEL_TOKEN' -value $VercelToken }
if ($VercelOrgId) { SetSecret -name 'VERCEL_ORG_ID' -value $VercelOrgId }
if ($VercelProjectIdDev) { SetSecret -name 'VERCEL_PROJECT_ID_DEV' -value $VercelProjectIdDev }

Write-Host "All requested secrets processed." -ForegroundColor Cyan

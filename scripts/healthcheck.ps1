Write-Host "Probing SubPulse Health Endpoints..." -ForegroundColor Yellow
Invoke-RestMethod -Uri "http://localhost:5500/health" | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:5500/ready" | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:5500/live" | ConvertTo-Json

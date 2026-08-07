Write-Host "Tearing down SubPulse containers and pruning volumes..." -ForegroundColor Red
docker compose down -v --remove-orphans
docker system prune -f

#!/bin/sh
echo "Tearing down SubPulse containers and pruning volumes..."
docker compose down -v --remove-orphans
docker system prune -f

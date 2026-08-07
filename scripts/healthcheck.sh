#!/bin/sh
echo "Probing SubPulse Health Endpoints..."
curl -s http://localhost:5500/health
curl -s http://localhost:5500/ready
curl -s http://localhost:5500/live

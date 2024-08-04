@echo off
cd "C:\Program Files (x86)\Metalforce\GearChecker"

echo "------------------------------------------------------------------------------------------------" >> start_log.txt
echo Started: %DATE% %TIME% >> start_log.txt

pm2 start "C:\Program Files (x86)\Metalforce\GearChecker\ecosystem.config.js" >> start_log.txt
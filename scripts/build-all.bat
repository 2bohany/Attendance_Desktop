@echo off
echo Building Attendance Desktop App...
call npm run build -w @attendance/backend
call npm run build:electron -w @attendance/desktop
call npm run build:renderer -w @attendance/desktop
echo Build complete.

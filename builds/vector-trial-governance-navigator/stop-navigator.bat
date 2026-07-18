@echo off
REM Stops the navigator server immediately, without waiting for the idle
REM auto-shutdown timeout.
setlocal enabledelayedexpansion
set FOUND=0
for /f "tokens=5" %%p in ('netstat -ano ^| findstr :8765 ^| findstr LISTENING') do (
  echo Stopping navigator server (PID %%p)...
  taskkill /PID %%p /F >nul 2>&1
  set FOUND=1
)
if "%FOUND%"=="0" (
  echo No navigator server found listening on port 8765.
)
pause

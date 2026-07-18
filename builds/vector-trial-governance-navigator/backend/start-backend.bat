@echo off
REM Starts the local LLM backend on http://localhost:8766
REM Requires a .env file in this folder with ANTHROPIC_API_KEY set
REM (copy .env.example to .env first).
cd /d "%~dp0"
if not exist ".env" (
  echo No .env file found. Copy .env.example to .env and add your ANTHROPIC_API_KEY first.
  pause
  exit /b 1
)
uvicorn app:app --host 127.0.0.1 --port 8766
pause

@echo off
REM Starts the Vector Trial Governance Navigator local server and opens it
REM in your browser. It auto-shuts-down after 15 minutes of no requests —
REM see serve.py to change the timeout, or run:
REM   python serve.py 1800
REM for a custom idle timeout (in seconds).
cd /d "%~dp0"
python serve.py
pause

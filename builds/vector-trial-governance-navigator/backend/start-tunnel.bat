@echo off
REM Exposes the local backend (must already be running via start-backend.bat)
REM publicly via a Cloudflare quick tunnel, so the real ChatGPT GPT's Actions
REM can reach it. Prints a URL like https://random-words.trycloudflare.com —
REM paste that into action.schema.json's servers[0].url AND into the GPT's
REM Actions config in the ChatGPT builder. This URL changes every time you
REM restart the tunnel (no Cloudflare account = no stable custom domain).
"C:\Users\HP\bin\cloudflared.exe" tunnel --url http://localhost:8766
pause

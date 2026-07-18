"""
Local static server for the Vector Trial Governance Navigator infographic.

Serves this folder on http://localhost:8765/app.html and auto-shuts down
after IDLE_TIMEOUT seconds of no requests, so it doesn't linger as a
permanent background process — start it right before a GPT session, and
it cleans itself up on its own once you're done.

Usage:
    python serve.py [idle_timeout_seconds]   (default 900 = 15 minutes)
"""
from __future__ import annotations

import http.server
import socketserver
import sys
import threading
import time
import webbrowser

PORT = 8765
IDLE_TIMEOUT = int(sys.argv[1]) if len(sys.argv) > 1 else 900
CHECK_INTERVAL = 15

last_request_time = time.time()
lock = threading.Lock()


class TrackedHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, fmt, *args):
        pass  # keep the console quiet; comment out to debug

    def do_GET(self):
        global last_request_time
        with lock:
            last_request_time = time.time()
        super().do_GET()


def watchdog(httpd: socketserver.TCPServer) -> None:
    while True:
        time.sleep(CHECK_INTERVAL)
        with lock:
            idle_for = time.time() - last_request_time
        if idle_for > IDLE_TIMEOUT:
            print(f"[navigator-server] idle for {int(idle_for)}s (limit {IDLE_TIMEOUT}s) — shutting down.")
            httpd.shutdown()
            return


def main() -> None:
    try:
        httpd = socketserver.ThreadingTCPServer(("127.0.0.1", PORT), TrackedHandler)
    except OSError as e:
        print(f"[navigator-server] could not bind to port {PORT} — is it already running? ({e})")
        webbrowser.open(f"http://localhost:{PORT}/app.html")
        return

    t = threading.Thread(target=watchdog, args=(httpd,), daemon=True)
    t.start()

    url = f"http://localhost:{PORT}/app.html"
    print(f"[navigator-server] serving on {url}")
    print(f"[navigator-server] will auto-shut-down after {IDLE_TIMEOUT}s ({IDLE_TIMEOUT//60} min) of no requests.")
    webbrowser.open(url)

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        httpd.server_close()
        print("[navigator-server] stopped.")


if __name__ == "__main__":
    main()

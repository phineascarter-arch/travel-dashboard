import http.server
import os
import socketserver
import sys

PORT = int(os.environ.get('PORT') or (sys.argv[1] if len(sys.argv) > 1 else 8420))


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        super().end_headers()


class ReusableTCPServer(socketserver.TCPServer):
    allow_reuse_address = True


with ReusableTCPServer(("", PORT), NoCacheHandler) as httpd:
    httpd.serve_forever()

import http from "http";

const PORT = 8081;
const TIMEOUT_MS = 120_000;

export class OAuthReceiver {

    getRedirectUri(){
        return 'http://localhost:${PORT}';
    }

    waitForCode(expectedState) {
        return new Promise((resolve, reject) => {
            const server = http.createServer((req, res) => {
                const url   = new URL(req.url, `http://localhost:${PORT}`);
                const code  = url.searchParams.get('code');
                const state = url.searchParams.get('state');
 
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end('You have now authenticated :) You may close this window.');
 
                server.close();
 
                if (state !== expectedState) {
                    reject(new Error('OAuth state mismatch'));
                    return;
                }
                if (!code) {
                    reject(new Error('No authorization code in redirect'));
                    return;
                }
                resolve(code);
            });
 
            server.listen(PORT);
 
            setTimeout(() => {
                server.close();
                reject(new Error(`Timed out waiting for OAuth callback after ${TIMEOUT_MS / 1000}s`));
            }, TIMEOUT_MS);
        });
    }

}
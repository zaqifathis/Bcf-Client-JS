import { BcfException } from './BcfException';

export class BcfHttpClient {

    /**
     * @param {import('./auth/FoundationClient.js').FoundationClient} foundation
     * @param {string} baseUrl  e.g. 'http://localhost:8080' (no trailing slash)
     */
    constructor(foundation, baseUrl) {
        this.foundation = foundation;
        this.baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    }

    // ------------------------------------------------

    async get(path) {
        return this._send('GET', path, null);
    }

    async post(path, body) {
        return this._send('POST', path, body);
    }
 
    async put(path, body) {
        return this._send('PUT', path, body);
    }
 
    async delete(path) {
        return this._send('DELETE', path, null);
    }

    /**
     * GET binary data (application/octet-stream).
     * Used for: snapshot, bitmap, document download, snippet download.
     * @param {string} path
     * @returns {Promise<Buffer>}
     */
    async getBinary(path) {
        const token = await this.foundation.getAccessToken();
        const url   = `${this.baseUrl}${path}`;
 
        const res = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept':        'application/octet-stream'
            }
        });
 
        if (!res.ok) {
            const text = await res.text().catch(() => '');
            throw new BcfException(res.status, `HTTP ${res.status} for: ${url} — ${text}`);
        }
 
        return Buffer.from(await res.arrayBuffer());
    }

    /**
     * POST binary data (application/octet-stream).
     * Used for: document upload.
     * @param {string} path
     * @param {Buffer} buffer
     * @returns {Promise<any>}
     */
    async postBinary(path, buffer) {
        return this._sendBinary('POST', path, buffer);
    }

    /**
     * PUT binary data (application/octet-stream).
     * Used for: snippet upload.
     * @param {string} path
     * @param {Buffer} buffer
     * @returns {Promise<any>}
     */
    async putBinary(path, buffer) {
        return this._sendBinary('PUT', path, buffer);
    }

    // ------------------------------------------------

    async _send(method, path, body) {
        const token = await this.foundation.getAccessToken();
        const url   = `${this.baseUrl}${path}`;
 
        const res = await fetch(url, {
            method,
            headers: {
                'Accept':        'application/json',
                'Authorization': `Bearer ${token}`,
                ...(body ? { 'Content-Type': 'application/json' } : {})
            },
            ...(body ? { body: JSON.stringify(body) } : {})
        });
 
        if (res.status === 204) return null;
 
        if (!res.ok) {
            const text = await res.text().catch(() => '');
            throw new BcfException(res.status, this._errorMessage(res.status, url, text));
        }
 
        const contentType = res.headers.get('content-type') ?? '';
        if (!contentType.includes('application/json')) return null;
 
        return res.json();
    }

    async _sendBinary(method, path, buffer) {
        const token = await this.foundation.getAccessToken();
        const url   = `${this.baseUrl}${path}`;
 
        const res = await fetch(url, {
            method,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type':  'application/octet-stream',
                'Accept':        'application/json'
            },
            body: buffer
        });
 
        if (res.status === 204 || res.status === 200 && method === 'PUT') return null;
 
        if (!res.ok) {
            const text = await res.text().catch(() => '');
            throw new BcfException(res.status, this._errorMessage(res.status, url, text));
        }
 
        const contentType = res.headers.get('content-type') ?? '';
        if (!contentType.includes('application/json')) return null;
 
        return res.json();
    }

    _errorMessage(status, url, body) {
        const d = body ? ` — ${body}` : '';
        switch (status) {
            case 401: return `Unauthorized — check credentials. URL: ${url}${d}`;
            case 403: return `Forbidden — no permission. URL: ${url}${d}`;
            case 404: return `Not found. URL: ${url}${d}`;
            case 409: return `Conflict — GUID already exists. URL: ${url}${d}`;
            case 500: return `Server error. URL: ${url}${d}`;
            default:  return `HTTP ${status} for: ${url}${d}`;
        }
    }
}
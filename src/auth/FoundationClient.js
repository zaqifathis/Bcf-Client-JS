import { OAuthReceiver } from './OauthReceiver';
import { BcfException } from '../BcfException';
import open from 'open';
import {randomUUID} from 'crypto';

const REQUIRED_FLOW = 'authorization_code_grant';
const AUTH_ENDPOINT = 'foundation/1.1/auth';

export class FoundationClient {

    /**
     * @param {string} baseUrl 
     * @param {string} clientId
     * @param {string} clientSecret
     */

    constructor (baseUrl, clientId, clientSecret) {
        this.baseUrl = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';
        this.clientId = clientId;
        this.clientSecret = clientSecret;

        this._authUrl = null;
        this._tokenUrl = null;

        this._accessToken = null;
        this._refreshToken = null;
        this._accessTokenExpiresOn = 0;
        this._refreshTokenExpiresOn = Number.MAX_SAFE_INTEGER;
    }


    // ── PUBLIC ────────────────────────────────────────────────────────────────

    async getAccessToken() {
        const now = this._epochSeconds();
        if (this._accessToken && this._accessTokenExpiresOn > now) {
            return this._accessToken;
        } else if (this._refreshToken && this._refreshTokenExpiresOn > now) {
            await this._refreshAccessToken();
        } else {
            await this.login();
        }
        return this._accessToken;
    }

    async getAuthMethods() {
        return (await this.getAuthInfo()).supported_oauth2_flows;
    }
 
    async getAuthInfo() {
        const res = await fetch(this.baseUrl + AUTH_ENDPOINT, {
            headers: { Accept: 'application/json' }
        });
        if (!res.ok)
            throw new BcfException(res.status,
                `Failed to fetch auth info — HTTP ${res.status}`);
        return res.json();
    }
 
    async login() {
        const authInfo = await this.getAuthInfo();
        this._validateAuthFlow(authInfo.supported_oauth2_flows);
 
        this._authUrl  = authInfo.oauth2_auth_url;
        this._tokenUrl = authInfo.oauth2_token_url;
 
        const receiver    = new OAuthReceiver();
        const state       = randomUUID();
        const redirectUri = receiver.getRedirectUri();
        const browserUrl  = this._buildAuthUrl(this._authUrl, state, redirectUri);
 
        console.log('>> Opening browser for login...');
        await open(browserUrl);
 
        const code = await receiver.waitForCode(state);
        await this._exchangeCodeForToken(code, redirectUri);
        console.log('>> Login successful.');
    }

    // ── PRIVATE ────────────────────────────────────────────────────────────────

    async _exchangeCodeForToken(code, redirectUri) {
        const body = new URLSearchParams({
            grant_type:   'authorization_code',
            code,
            redirect_uri: redirectUri
        });
        await this._postToTokenEndpoint(body);
    }

    async _refreshAccessToken() {
        const body = new URLSearchParams({
            grant_type:    'refresh_token',
            refresh_token: this._refreshToken
        });
        await this._postToTokenEndpoint(body);
    }

    async _postToTokenEndpoint(formBody) {
        const res = await fetch(this._tokenUrl, {
            method:  'POST',
            headers: {
                'Content-Type':  'application/x-www-form-urlencoded',
                'Authorization': this._buildBasicAuthHeader()
            },
            body: formBody.toString()
        });
        if (!res.ok)
            throw new BcfException(res.status,
                `Token exchange failed — HTTP ${res.status}`);
        this._setTokensFromResponse(await res.json());
    }
 
    _setTokensFromResponse(json) {
        const now = this._epochSeconds();
        this._accessToken          = json.access_token;
        this._refreshToken         = json.refresh_token;
        this._accessTokenExpiresOn = now + json.expires_in;
        if (json.refresh_token_expires_in)
            this._refreshTokenExpiresOn = now + json.refresh_token_expires_in;
    }
 
    _validateAuthFlow(supportedFlows) {
        if (!supportedFlows?.includes(REQUIRED_FLOW))
            throw new BcfException(-1,
                `Server does not support 'authorization_code_grant'. Supported: ${supportedFlows}`);
    }
 
    _buildAuthUrl(authEndpoint, state, redirectUri) {
        const params = new URLSearchParams({
            client_id:     this.clientId,
            response_type: 'code',
            state,
            redirect_uri:  redirectUri
        });
        const sep = authEndpoint.includes('?') ? '&' : '?';
        return `${authEndpoint}${sep}${params.toString()}`;
    }
 
    _buildBasicAuthHeader() {
        const encoded = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
        return `Basic ${encoded}`;
    }

    _epochSeconds() {
        return Math.floor(Date.now() / 1000);
    }
}
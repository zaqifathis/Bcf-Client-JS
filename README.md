# bcf-client-js

A JavaScript client library for the **BCF REST API 3.0** (BIM Collaboration Format).  
Implements the full [buildingSMART BCF API spec](https://github.com/buildingSMART/BCF-API) — authentication, projects, topics, comments, viewpoints, documents, and more.

---

## Requirements

- Node.js >= 18.0.0
- ES Modules (`"type": "module"` in your `package.json`)
- A running BCF server that supports `authorization_code_grant`

---

## Installation

```bash
npm install @openfabtwin-bim/bcf-client
```

---

## Quick Start

```js
import { FoundationClient } from '@openfabtwin-bim/bcf-client/auth';
import { BcfClient }        from '@openfabtwin-bim/bcf-client';

// 1. Create the auth client
const foundation = new FoundationClient(
  'https://your-bcf-server.example.com/',
  'your-client-id',
  'your-client-secret'
);

// 2. Create the BCF client and resolve the API version
const bcf = new BcfClient(foundation, '3.0');
await bcf.resolveVersion(); // triggers browser login on first use

// 3. Use the sub-clients
const projects = await bcf.project.getAllProjects();
console.log(projects);
```

> `resolveVersion()` must be called **once** before using any sub-client.  
> It discovers the server's BCF base URL, triggers OAuth login if needed, and wires all clients.

---

## Architecture

```
BcfClient
├── FoundationClient      ← OAuth 2.0 auth (authorization_code_grant)
│   └── OAuthReceiver     ← Temporary localhost:8081 server to catch OAuth redirect
├── BcfHttpClient         ← Thin HTTP layer (GET, POST, PUT, DELETE, binary)
└── Sub-clients (wired after resolveVersion())
    ├── project           → ProjectClient
    ├── topic             → TopicClient
    ├── comment           → CommentClient
    ├── viewpoint         → ViewpointClient
    ├── document          → DocumentClient
    ├── documentReference → DocumentReferenceClient
    ├── event             → EventClient
    ├── file              → FileClient
    ├── relatedTopic      → RelatedTopicClient
    └── snippet           → SnippetClient
```

---

## Authentication

Authentication is handled by `FoundationClient`. It implements the BCF Foundation API auth flow:

1. `GET /foundation/1.1/auth` — discovers OAuth endpoints
2. Opens browser for login (`authorization_code_grant`)
3. Catches the redirect code via a temporary local server on `localhost:8081`
4. Exchanges code for access + refresh tokens
5. Auto-refreshes tokens on expiry — transparent to callers

```js
const foundation = new FoundationClient(baseUrl, clientId, clientSecret);
const token = await foundation.getAccessToken(); // login triggered automatically
```

---

## Project Structure

```
src/
├── BcfClient.js              ← Main entry point
├── BcfHttpClient.js          ← HTTP layer (JSON + binary)
├── BcfException.js           ← Error class
├── queryBuilder.js           ← OData query string builder ($filter, $orderby, etc.)
├── auth/
│   ├── FoundationClient.js   ← OAuth 2.0 auth flow
│   └── OauthReceiver.js      ← Local redirect server (localhost:8081)
└── client/
    ├── ProjectClient.js
    ├── TopicClient.js
    ├── CommentClient.js
    ├── ViewpointClient.js
    ├── DocumentClient.js
    ├── DocumentReferenceClient.js
    ├── EventClient.js
    ├── FileClient.js
    ├── RelatedTopicClient.js
    └── SnippetClient.js
```

---

## License
MIT


## Acknowledgment
This work is funded by the German Federal Ministry for Economic Affairs and Climate Action
(BMWK) through the central innovation programme for small and medium-sized enterprises
(ZIM-program), with funding provided under grant number 16KN106902.

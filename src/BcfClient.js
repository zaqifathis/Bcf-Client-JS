import { BcfException } from './BcfException';
import { BcfHttpClient } from './BcfHttpClient.js';
import { ProjectClient } from './client/ProjectClient.js';
import { TopicClient } from './client/TopicClient.js';
import { CommentClient } from './client/CommentClient.js';
import { ViewpointClient } from './client/ViewpointClient.js';
import { DocumentClient } from './client/DocumentClient.js';
import { DocumentReferenceClient } from './client/DocumentReferenceClient.js';
import { EventClient } from './client/EventClient.js';
import { FileClient } from './client/FileClient.js';
import { RelatedTopicClient } from './client/RelatedTopicClient.js';
import { SnippetClient } from './client/SnippetClient.js';


const VERSIONS_ENDPOINT = 'foundation/versions';
const TARGET_API_ID     = 'bcf';

export class BcfClient {

    /**
     * @param {import('./auth/FoundationClient.js').FoundationClient} foundation
     * @param {string} targetVersion  e.g. '3.0'
     *
     * @example
     * const bcf = new BcfClient(foundation, '3.0');
     * await bcf.resolveVersion();
     * await bcf.project.getAllProjects();
     */
    constructor(foundation, targetVersion) {
        this.foundation = foundation;
        this.targetVersion = targetVersion;

        this.project = null;
        this.topic = null;
        this.comment = null;
        this.viewpoint = null;
        this.document = null;
        this.documentReference = null;
        this.event = null;
        this.file = null;
        this.relatedTopic = null;
        this.snippet = null;
    }

    /**
     * Resolves BCF base URL, triggers login if needed, wires all client fields.
     * Must be called once before using any client field.
     * @returns {Promise<void>}
     */
    async resolveVersion() {
        const versions = await this.getVersions();

        const bcf = versions.versions?.find(v =>
            v.api_id === TARGET_API_ID && v.version_id === this.targetVersion
        );

        if (!bcf)
            throw new BcfException(-1,
                `Server does not support BCF ${this.targetVersion}. ` +
                `Available: ${versions.versions?.map(v => `${v.api_id} ${v.version_id}`).join(', ')}`);

        const baseUrl = this.foundation.baseUrl.endsWith('/') ? this.foundation.baseUrl.slice(0, -1) : this.foundation.baseUrl;
        const http = new BcfHttpClient(this.foundation, baseUrl);

        this.project   = new ProjectClient(http, this.targetVersion);
        this.topic     = new TopicClient(http, this.targetVersion);
        this.comment   = new CommentClient(http, this.targetVersion);
        this.viewpoint = new ViewpointClient(http, this.targetVersion);
        this.document = new DocumentClient(http, this.targetVersion);
        this.documentReference = new DocumentReferenceClient(http, this.targetVersion);
        this.event = new EventClient(http, this.targetVersion);
        this.file = new FileClient(http, this.targetVersion);
        this.relatedTopic = new RelatedTopicClient(http, this.targetVersion);
        this.snippet = new SnippetClient(http, this.targetVersion);

    }

    async getVersions() {
        const url = this.foundation.baseUrl + VERSIONS_ENDPOINT;
        const res = await fetch(url, { headers: { Accept: 'application/json' } });
        if (!res.ok)
            throw new BcfException(res.status,
                `Failed to fetch versions — HTTP ${res.status}`);
        return res.json();
    }

}
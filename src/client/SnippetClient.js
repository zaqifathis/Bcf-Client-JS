

export class SnippetClient {

    /**
     * @param {import('../BcfHttpClient.js').BcfHttpClient} http
     * @param {string} version
     */
    constructor(http, version) {
        this.http = http;
        this.version = version;
    }

    /**
     * GET /bcf/{version}/projects/{project_id}/topics/{topic_id}/snippet
     * Returns the BIM snippet as a binary Buffer.
     * @param {string} projectId
     * @param {string} topicId
     * @returns {Promise<Buffer>}
     */
    async getTopicSnippet(projectId, topicId) {
        return this.http.getBinary(
            `/bcf/${this.version}/projects/${projectId}/topics/${topicId}/snippet`);
    }


    /**
     * PUT /bcf/{version}/projects/{project_id}/topics/{topic_id}/snippet
     * Uploads a binary BIM snippet file.
     * @param {string} projectId
     * @param {string} topicId
     * @param {Buffer} fileBuffer - binary snippet content
     * @returns {Promise<void>}
     */
    async updateTopicSnippet(projectId, topicId, fileBuffer) {
        return this.http.putBinary(
            `/bcf/${this.version}/projects/${projectId}/topics/${topicId}/snippet`,
            fileBuffer);
    }
    
}
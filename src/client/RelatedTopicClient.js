/**
 * @typedef {Object} RelatedTopicGET
 * @property {string} related_topic_guid  - required
 */
 
/**
 * @typedef {Object} RelatedTopicPUT
 * @property {string} related_topic_guid  - required
 */
 
export class RelatedTopicClient {

    /**
     * @param {import('../BcfHttpClient.js').BcfHttpClient} http
     * @param {string} version
     */
    constructor(http, version) {
        this.http = http;
        this.version = version;
    }


    /**
     * GET /bcf/{version}/projects/{project_id}/topics/{topic_id}/related_topics
     * @param {string} projectId
     * @param {string} topicId
     * @returns {Promise<RelatedTopicGET[]>}
     */
    async getRelatedTopics(projectId, topicId) {
        return this.http.get(
            `/bcf/${this.version}/projects/${projectId}/topics/${topicId}/related_topics`);
    }

    /**
     * PUT /bcf/{version}/projects/{project_id}/topics/{topic_id}/related_topics
     * Replaces the full list of related topics.
     * @param {string}           projectId
     * @param {string}           topicId
     * @param {RelatedTopicPUT[]} payload  - full replacement list
     * @returns {Promise<RelatedTopicGET[]>}
     */
    async updateRelatedTopics(projectId, topicId, payload) {
        return this.http.put(
            `/bcf/${this.version}/projects/${projectId}/topics/${topicId}/related_topics`,
            payload);
    }

}
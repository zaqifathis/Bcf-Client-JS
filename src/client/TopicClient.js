
import { buildQueryString, FULL_QUERY} from `../queryBuilder.js;`

/**
 * @typedef {Object} TopicGET
 * @property {string}   guid
 * @property {string}   title
 * @property {string}   [topic_type]
 * @property {string}   [topic_status]
 * @property {string[]} [labels]
 * @property {string}   [creation_date]
 * @property {string}   [creation_author]
 * @property {string}   [modified_date]
 * @property {string}   [modified_author]
 * @property {string}   [assigned_to]
 * @property {string}   [description]
 * @property {string}   [priority]
 * @property {string}   [due_date]
 * @property {string}   [stage]
 * @property {number}   [index]
 * @property {string[]} [related_topics]
 */

/**
 * @typedef {Object} TopicPOST
 * @property {string}   title   - required
 * @property {string}   [guid]
 * @property {string}   [topic_type]
 * @property {string}   [topic_status]
 * @property {string[]} [labels]
 * @property {string}   [assigned_to]
 * @property {string}   [description]
 * @property {string}   [priority]
 * @property {string}   [due_date]
 * @property {string}   [stage]
 * @property {number}   [index]
 * @property {string[]} [related_topics]
 */

/**
 * @typedef {Object} TopicPUT
 * @property {string}   title   - required
 * @property {string}   [topic_type]
 * @property {string}   [topic_status]
 * @property {string[]} [labels]
 * @property {string}   [assigned_to]
 * @property {string}   [description]
 * @property {string}   [priority]
 * @property {string}   [due_date]
 * @property {string}   [stage]
 * @property {number}   [index]
 * @property {string[]} [related_topics]
 */

/**
 * @typedef {Object} TopicQuery
 * @property {string} [$filter]   
 * @property {string} [$orderby]  
 * @property {number} [$top]      
 * @property {number} [$skip]     
 */

export class TopicClient {

    /**
     * @param {import('../BcfHttpClient.js').BcfHttpClient} http
     * @param {string} version
     */
    constructor(http, version) {
        this.http = http;
        this.version = version;
    }

    /**
     * POST /bcf/{version}/projects/{project_id}/topics
     * @param {string}    projectId
     * @param {TopicPOST} payload
     * @returns {Promise<TopicGET>}
     */
    async createTopic(projectId, payload) {
        return this.http.post(`/bcf/${this.version}/projects/${projectId}/topics`, payload);
    }

    /**
     * DELETE /bcf/{version}/projects/{project_id}/topics/{topic_id}
     * @param {string} projectId
     * @param {string} topicId
     * @returns {Promise<void>}
     */
    async deleteTopic(projectId, topicId) {
        return this.http.delete(
            `/bcf/${this.version}/projects/${projectId}/topics/${topicId}`);
    }

    /**
     * GET /bcf/{version}/projects/{project_id}/topics/{topic_id}
     * @param {string} projectId
     * @param {string} topicId
     * @returns {Promise<TopicGET>}
     */
    async getTopicById(projectId, topicId) {
        return this.http.get(`/bcf/${this.version}/projects/${projectId}/topics/${topicId}`);
    }

    /**
     * GET /bcf/{version}/projects/{project_id}/topics
     * @param {string}     projectId
     * @param {TopicQuery} [query]
     * @returns {Promise<TopicGET[]>}
     */
    async getTopics(projectId, query = {}) {
        return this.http.get(`/bcf/${this.version}/projects/${projectId}/topics${buildQueryString(query, FULL_QUERY)}`);
    }

    /**
     * PUT /bcf/{version}/projects/{project_id}/topics/{topic_id}
     * @param {string}   projectId
     * @param {string}   topicId
     * @param {TopicPUT} payload
     * @returns {Promise<TopicGET>}
     */
    async updateTopic(projectId, topicId, payload) {
        return this.http.put(
            `/bcf/${this.version}/projects/${projectId}/topics/${topicId}`, payload);
    }
    
}

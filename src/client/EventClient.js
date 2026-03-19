
import { buildQueryString, FULL_QUERY} from `../queryBuilder.js;`

/**
 * @typedef {Object} EventAction
 * @property {string} changed_attribute  - name of the changed field
 * @property {string} [old_value]
 * @property {string} [new_value]
 */
 
/**
 * @typedef {Object} TopicEventGET
 * @property {string}        topic_guid  - required
 * @property {string}        date        - required, ISO 8601
 * @property {string}        author      - required
 * @property {EventAction[]} [actions]
 */
 
/**
 * @typedef {Object} CommentEventGET
 * @property {string}        comment_guid - required
 * @property {string}        topic_guid   - required
 * @property {string}        date         - required, ISO 8601
 * @property {string}        author       - required
 * @property {EventAction[]} [actions]
 */
 
/**
 * @typedef {Object} EventQuery
 * @property {string} [$filter]
 * @property {string} [$orderby]
 * @property {number} [$top]
 * @property {number} [$skip]
 */

export class EventClient {

    /**
     * @param {import('../BcfHttpClient.js').BcfHttpClient} http
     * @param {string} version
     */
    constructor(http, version) {
        this.http = http;
        this.version = version;
    }

     /**
     * GET /bcf/{version}/projects/{project_id}/topics/{topic_id}/comments/{comment_id}/events
     * Get comment events for a specific comment.
     * @param {string}     projectId
     * @param {string}     topicId
     * @param {string}     commentId
     * @param {EventQuery} [query]
     * @returns {Promise<CommentEventGET[]>}
     */
    async getCommentEvent(projectId, topicId, commentId, query = {}) {
        return this.http.get(
            `/bcf/${this.version}/projects/${projectId}/topics/${topicId}/comments/${commentId}/events${this._qs(query)}`);
    }

    /**
     * GET /bcf/{version}/projects/{project_id}/topics/comments/events
     * Get all comment events for a project.
     * @param {string}     projectId
     * @param {EventQuery} [query]
     * @returns {Promise<CommentEventGET[]>}
     */
    async getCommentEvents(projectId, query = {}) {
        return this.http.get(
            `/bcf/${this.version}/projects/${projectId}/topics/comments/events${this._qs(query)}`);
    }

    /**
     * GET /bcf/{version}/projects/{project_id}/topics/events
     * Get all topic events for a project.
     * @param {string}     projectId
     * @param {EventQuery} [query]
     * @returns {Promise<TopicEventGET[]>}
     */
    async getEvents(projectId, query = {}) {
        return this.http.get(
            `/bcf/${this.version}/projects/${projectId}/topics/events${buildQueryString(query, FULL_QUERY)}`);
    }

    /**
     * GET /bcf/{version}/projects/{project_id}/topics/{topic_id}/events
     * Get topic events for a specific topic.
     * @param {string}     projectId
     * @param {string}     topicId
     * @param {EventQuery} [query]
     * @returns {Promise<TopicEventGET[]>}
     */
    async getTopicEvents(projectId, topicId, query = {}) {
        return this.http.get(
            `/bcf/${this.version}/projects/${projectId}/topics/${topicId}/events${buildQueryString(query, FULL_QUERY)}`);
    }
    
}
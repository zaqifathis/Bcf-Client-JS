
import { buildQueryString, FILTER_ONLY} from `../queryBuilder.js;`

/**
 * @typedef {Object} CommentGET
 * @property {string} guid
 * @property {string} date
 * @property {string} author
 * @property {string} comment
 * @property {string} topic_guid
 * @property {string} [modified_date]
 * @property {string} [modified_author]
 * @property {string} [viewpoint_guid]
 * @property {string} [reply_to_comment_guid]
 * @property {Object} [authorization]
 * @property {string[]} [authorization.comment_actions]
 */

/**
 * @typedef {Object} CommentPOST
 * @property {string} comment   - required
 * @property {string} [guid]
 * @property {string} [viewpoint_guid]
 * @property {string} [reply_to_comment_guid]
 */

/**
 * @typedef {Object} CommentPUT
 * @property {string} comment    - required
 * @property {string} [viewpoint_guid]
 */

/**
 * @typedef {Object} CommentQuery
 * @property {string} [$filter]  
 * @property {string} [$orderby]  
 */

export class CommentClient {

    /**
     * @param {import('../BcfHttpClient.js').BcfHttpClient} http
     * @param {string} version
     */
    constructor(http, version) {
        this.http = http;
        this.version = version;
    }
    

    /**
     * POST /bcf/{version}/projects/{project_id}/topics/{topic_id}/comments
     * @param {string}      projectId
     * @param {string}      topicId
     * @param {CommentPOST} payload
     * @returns {Promise<CommentGET>}
     */
    async createComment(projectId, topicId, payload) {
        return this.http.post(
            `/bcf/${this.version}/projects/${projectId}/topics/${topicId}/comments`, payload);
    }

    /**
     * DELETE /bcf/{version}/projects/{project_id}/topics/{topic_id}/comments/{comment_id}
     * @param {string} projectId
     * @param {string} topicId
     * @param {string} commentId
     * @returns {Promise<void>}
     */
    async deleteComment(projectId, topicId, commentId) {
        return this.http.delete(
            `/bcf/${this.version}/projects/${projectId}/topics/${topicId}/comments/${commentId}`);
    }

    /**
     * GET /bcf/{version}/projects/{project_id}/topics/{topic_id}/comments/{comment_id}
     * @param {string} projectId
     * @param {string} topicId
     * @param {string} commentId
     * @returns {Promise<CommentGET>}
     */
    async getCommentById(projectId, topicId, commentId) {
        return this.http.get(
            `/bcf/${this.version}/projects/${projectId}/topics/${topicId}/comments/${commentId}`);
    }

    /**
     * GET /bcf/{version}/projects/{project_id}/topics/{topic_id}/comments
     * @param {string}       projectId
     * @param {string}       topicId
     * @param {CommentQuery} [query]
     * @returns {Promise<CommentGET[]>}
     */
    async getTopicComment(projectId, topicId, query = {}) {
        return this.http.get(
            `/bcf/${this.version}/projects/${projectId}/topics/${topicId}/comments${buildQueryString(query, FILTER_ONLY)}`);
    }

    /**
     * PUT /bcf/{version}/projects/{project_id}/topics/{topic_id}/comments/{comment_id}
     * @param {string}     projectId
     * @param {string}     topicId
     * @param {string}     commentId
     * @param {CommentPUT} payload
     * @returns {Promise<CommentGET>}
     */
    async updateComment(projectId, topicId, commentId, payload) {
        return this.http.put(
            `/bcf/${this.version}/projects/${projectId}/topics/${topicId}/comments/${commentId}`,
            payload);
    }

}
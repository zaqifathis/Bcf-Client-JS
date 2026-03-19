/**
 * @typedef {Object} DocumentReferenceGET
 * @property {string} guid                - required
 * @property {string} [document_guid]     
 * @property {string} [url]               - external URL reference
 * @property {string} [description]
 */
 
/**
 * @typedef {Object} DocumentReferencePOST
 * @property {string} [guid]
 * @property {string} [document_guid]
 * @property {string} [url]
 * @property {string} [description]
 */
 
/**
 * @typedef {Object} DocumentReferencePUT
 * @property {string} [document_guid]
 * @property {string} [url]
 * @property {string} [description]
 */

export class DocumentReferenceClient {

    /**
     * @param {import('../BcfHttpClient.js').BcfHttpClient} http
     * @param {string} version
     */
    constructor(http, version) {
        this.http = http;
        this.version = version;
    }


    /**
     * POST /bcf/{version}/projects/{project_id}/topics/{topic_id}/document_references
     * @param {string}               projectId
     * @param {string}               topicId
     * @param {DocumentReferencePOST} payload
     * @returns {Promise<DocumentReferenceGET>}
     */
    async createDocumentReference(projectId, topicId, payload) {
        return this.http.post(
            `/bcf/${this.version}/projects/${projectId}/topics/${topicId}/document_references`,
            payload);
    }

    /**
     * GET /bcf/{version}/projects/{project_id}/topics/{topic_id}/document_references
     * @param {string} projectId
     * @param {string} topicId
     * @returns {Promise<DocumentReferenceGET[]>}
     */
    async getDocumentReferences(projectId, topicId) {
        return this.http.get(
            `/bcf/${this.version}/projects/${projectId}/topics/${topicId}/document_references`);
    }

     /**
     * PUT /bcf/{version}/projects/{project_id}/topics/{topic_id}/document_references/{document_reference_id}
     * @param {string}              projectId
     * @param {string}              topicId
     * @param {string}              documentReferenceId
     * @param {DocumentReferencePUT} payload
     * @returns {Promise<DocumentReferenceGET>}
     */
    async updateDocumentReference(projectId, topicId, documentReferenceId, payload) {
        return this.http.put(
            `/bcf/${this.version}/projects/${projectId}/topics/${topicId}/document_references/${documentReferenceId}`,
            payload);
    }

}
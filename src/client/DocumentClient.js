/**
 * @typedef {Object} DocumentGET
 * @property {string} guid      - required
 * @property {string} filename  - required
 */

export class DocumentClient{

    /**
     * @param {import('../BcfHttpClient.js').BcfHttpClient} http
     * @param {string} version
     */
    constructor(http, version) {
        this.http = http;
        this.version = version;
    }

    /**
     * POST /bcf/{version}/projects/{project_id}/documents
     * Uploads a binary document file.
     * @param {string} projectId
     * @param {string} guid       - desired GUID for the document
     * @param {Buffer} fileBuffer - binary file content
     * @returns {Promise<DocumentGET>}
     */
    async createDocument(projectId, guid, fileBuffer) {
        return this.http.postBinary(
            `/bcf/${this.version}/projects/${projectId}/documents?guid=${guid}`,
            fileBuffer);
    }

    /**
     * GET /bcf/{version}/projects/{project_id}/documents
     * @param {string} projectId
     * @returns {Promise<DocumentGET[]>}
     */
    async getDocuments(projectId) {
        return this.http.get(
            `/bcf/${this.version}/projects/${projectId}/documents`);
    }

    /**
     * GET /bcf/{version}/projects/{project_id}/documents/{document_id}
     * Returns the document file as a binary Buffer.
     * @param {string} projectId
     * @param {string} documentId
     * @returns {Promise<Buffer>}
     */
    async getDocumentById(projectId, documentId) {
        return this.http.getBinary(
            `/bcf/${this.version}/projects/${projectId}/documents/${documentId}`);
    }

}
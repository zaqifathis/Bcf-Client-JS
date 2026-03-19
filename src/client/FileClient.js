/**
 * @typedef {Object} FileGET
 * @property {string} [ifc_project]
 * @property {string} [ifc_spatial_structure_element]
 * @property {string} [filename]
 * @property {string} [date]       - ISO 8601
 * @property {string} [reference]  - URI or server-specific id
 */
 
/**
 * @typedef {Object} FilePUT
 * @property {string} [ifc_project]
 * @property {string} [ifc_spatial_structure_element]
 * @property {string} [filename]
 * @property {string} [date]
 * @property {string} [reference]
 */
 
/**
 * @typedef {Object} ProjectFileInformation
 * @property {string} [ifc_project]
 * @property {string} [filename]
 * @property {string} [reference]
 */
 

export class FileClient {

    /**
     * @param {import('../BcfHttpClient.js').BcfHttpClient} http
     * @param {string} version
     */
    constructor(http, version) {
        this.http = http;
        this.version = version;
    }
    
    
    /**
     * GET /bcf/{version}/projects/{project_id}/topics/{topic_id}/files
     * Get IFC file references for a topic.
     * @param {string} projectId
     * @param {string} topicId
     * @returns {Promise<FileGET[]>}
     */
    async getFiles(projectId, topicId) {
        return this.http.get(
            `/bcf/${this.version}/projects/${projectId}/topics/${topicId}/files`);
    }

     /**
     * GET /bcf/{version}/projects/{project_id}/files_information
     * Get all IFC file information for a project.
     * @param {string} projectId
     * @returns {Promise<ProjectFileInformation[]>}
     */
    async getProjectFilesInformation(projectId) {
        return this.http.get(
            `/bcf/${this.version}/projects/${projectId}/files_information`);
    }

    /**
     * PUT /bcf/{version}/projects/{project_id}/topics/{topic_id}/files
     * Update IFC file references for a topic.
     * @param {string}    projectId
     * @param {string}    topicId
     * @param {FilePUT[]} payload  - array of file references
     * @returns {Promise<FileGET[]>}
     */
    async updateTopicFiles(projectId, topicId, payload) {
        return this.http.put(
            `/bcf/${this.version}/projects/${projectId}/topics/${topicId}/files`,
            payload);
    }
    
}
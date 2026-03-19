/**
 * @typedef {Object} ProjectGET
 * @property {string}   project_id
 * @property {string}   name
 * @property {Object}   [authorization]
 * @property {string[]} [authorization.project_actions]
 */
 
/**
 * @typedef {Object} ProjectPUT
 * @property {string} name
 */
 
/**
 * @typedef {Object} ExtensionsGET
 * @property {string[]} [topic_type]
 * @property {string[]} [topic_status]
 * @property {string[]} [topic_label]
 * @property {string[]} [priority]
 * @property {string[]} [assigned_to]
 * @property {string[]} [stage]
 * @property {string[]} [users]
 */

export class ProjectClient {

    /**
     * @param {import('../BcfHttpClient.js').BcfHttpClient} http
     * @param {string} version
     */
    constructor(http, version) {
        this.http = http;
        this.version = version;
    }
    

    /**
     * GET /bcf/{version}/projects
     * @returns {Promise<ProjectGET[]>}
     */
    async getAllProjects() {
        return this.http.get(`/bcf/${this.version}/projects`);
    }

    /**
     * GET /bcf/{version}/projects/{project_id}
     * @param {string} projectId
     * @returns {Promise<ProjectGET>}
     */
    async getProjectById(projectId) {
        return this.http.get(`/bcf/${this.version}/projects/${projectId}`);
    }

    /**
     * GET /bcf/{version}/projects/{project_id}/extensions
     * @param {string} projectId
     * @returns {Promise<ExtensionsGET>}
     */
    async getProjectExtension(projectId) {
        return this.http.get(`/bcf/${this.version}/projects/${projectId}/extensions`);
    }

    /**
     * PUT /bcf/{version}/projects/{project_id}
     * @param {string}     projectId
     * @param {ProjectPUT} payload
     * @returns {Promise<ProjectGET>}
     */
    async updateProjectById(projectId, payload) {
        return this.http.put(`/bcf/${this.version}/projects/${projectId}`, payload);
    }
    
}
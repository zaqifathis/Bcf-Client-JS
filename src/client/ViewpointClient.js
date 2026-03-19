/**
 * @typedef {Object} ViewpointGET
 * @property {string}            guid                - required
 * @property {number}            [index]
 * @property {OrthogonalCamera}  [orthogonal_camera]
 * @property {PerspectiveCamera} [perspective_camera]
 * @property {Line[]}            [lines]
 * @property {ClippingPlane[]}   [clipping_planes]
 * @property {BitmapGET[]}       [bitmaps]
 * @property {SnapshotGET}       [snapshot]
 * @property {Object}            [authorization]
 * @property {string[]}          [authorization.viewpoint_actions]
 */
 
/**
 * @typedef {Object} OrthogonalCamera
 * @property {{x: number, y: number, z: number}} camera_view_point
 * @property {{x: number, y: number, z: number}} camera_direction
 * @property {{x: number, y: number, z: number}} camera_up_vector
 * @property {number} view_to_world_scale
 */
 
/**
 * @typedef {Object} PerspectiveCamera
 * @property {{x: number, y: number, z: number}} camera_view_point
 * @property {{x: number, y: number, z: number}} camera_direction
 * @property {{x: number, y: number, z: number}} camera_up_vector
 * @property {number} field_of_view
 */
 
/**
 * @typedef {Object} SnapshotGET
 * @property {string} snapshot_type  - 'png' or 'jpg'
 * @property {string} snapshot_data  - base64 encoded image
 */
 
/**
 * @typedef {Object} ViewpointPOST
 * @property {string}            [guid]
 * @property {number}            [index]
 * @property {OrthogonalCamera}  [orthogonal_camera]
 * @property {PerspectiveCamera} [perspective_camera]
 * @property {Line[]}            [lines]
 * @property {ClippingPlane[]}   [clipping_planes]
 * @property {BitmapPOST[]}      [bitmaps]
 * @property {SnapshotPOST}      [snapshot]
 * @property {Components}        [components]
 */
 
/**
 * @typedef {Object} SnapshotPOST
 * @property {string} snapshot_type  - 'png' or 'jpg'
 * @property {string} snapshot_data  - base64 encoded image
 */
 
/**
 * @typedef {Object} ColoringGET
 * @property {Coloring[]} [coloring]
 */
 
/**
 * @typedef {Object} Coloring
 * @property {string}      color       - Hex color e.g. 'FF0000'
 * @property {Component[]} components
 */
 
/**
 * @typedef {Object} SelectionGET
 * @property {Component[]} [selection]
 */
 
/**
 * @typedef {Object} Component
 * @property {string} [ifc_guid]
 * @property {string} [originating_system]
 * @property {string} [authoring_tool_id]
 */
 
/**
 * @typedef {Object} VisibilityGET
 * @property {Visibility} [visibility]
 */
 
/**
 * @typedef {Object} Visibility
 * @property {boolean}     default_visibility
 * @property {Component[]} [exceptions]
 * @property {Object}      [view_setup_hints]
 * @property {boolean}     [view_setup_hints.spaces_visible]
 * @property {boolean}     [view_setup_hints.space_boundaries_visible]
 * @property {boolean}     [view_setup_hints.openings_visible]
 */

export class ViewpointClient {

    /**
     * @param {import('../BcfHttpClient.js').BcfHttpClient} http
     * @param {string} version
     */
    constructor(http, version) {
        this.http = http;
        this.version = version;
    }


    /**
     * POST /bcf/{version}/projects/{project_id}/topics/{topic_id}/viewpoints
     * Viewpoints are immutable once created.
     * @param {string}        projectId
     * @param {string}        topicId
     * @param {ViewpointPOST} payload
     * @returns {Promise<ViewpointGET>}
     */
    async createViewpoint(projectId, topicId, payload) {
        return this.http.post(
            `/bcf/${this.version}/projects/${projectId}/topics/${topicId}/viewpoints`, payload);
    }

    /**
     * DELETE /bcf/{version}/projects/{project_id}/topics/{topic_id}/viewpoints/viewpointId
     * @param {string} projectId
     * @param {string} topicId
     * @param {string} viewpointId
     * @returns {Promise<void>}
     */
    async deleteViewpointById(projectId, topicId, viewpointId) {
        return this.http.delete(`/bcf/${this.version}/projects/${projectId}/topics/${topicId}/viewpoints/${viewpointId}`)
    }

    /**
     * GET /bcf/{version}/projects/{project_id}/topics/{topic_id}/viewpoints/{viewpoint_id}/bitmaps/{bitmap_id}
     * Returns the bitmap as a binary Buffer (png or jpg).
     * @param {string} projectId
     * @param {string} topicId
     * @param {string} viewpointId
     * @param {string} bitmapId
     * @returns {Promise<Buffer>}
     */
    async getBitmap(projectId, topicId, viewpointId, bitmapId) {
        return this.http.getBinary(
            `/bcf/${this.version}/projects/${projectId}/topics/${topicId}/viewpoints/${viewpointId}/bitmaps/${bitmapId}`);
    }

    /**
     * GET /bcf/{version}/projects/{project_id}/topics/{topic_id}/viewpoints/{viewpoint_id}/coloring
     * @param {string} projectId
     * @param {string} topicId
     * @param {string} viewpointId
     * @returns {Promise<ColoringGET>}
     */
    async getColoring(projectId, topicId, viewpointId) {
        return this.http.get(
            `/bcf/${this.version}/projects/${projectId}/topics/${topicId}/viewpoints/${viewpointId}/coloring`);
    }

    /**
     * GET /bcf/{version}/projects/{project_id}/topics/{topic_id}/viewpoints/{viewpoint_id}/selection
     * @param {string} projectId
     * @param {string} topicId
     * @param {string} viewpointId
     * @returns {Promise<SelectionGET>}
     */
    async getSelection(projectId, topicId, viewpointId) {
        return this.http.get(
            `/bcf/${this.version}/projects/${projectId}/topics/${topicId}/viewpoints/${viewpointId}/selection`);
    }

    /**
     * GET /bcf/{version}/projects/{project_id}/topics/{topic_id}/viewpoints/{viewpoint_id}/snapshot
     * Returns the snapshot as a binary Buffer (png or jpg).
     * Only available if viewpoint.snapshot != null.
     * @param {string} projectId
     * @param {string} topicId
     * @param {string} viewpointId
     * @returns {Promise<Buffer>}
     */
    async getSnapshot(projectId, topicId, viewpointId) {
        return this.http.getBinary(
            `/bcf/${this.version}/projects/${projectId}/topics/${topicId}/viewpoints/${viewpointId}/snapshot`);
    }

    /**
     * GET /bcf/{version}/projects/{project_id}/topics/{topic_id}/viewpoints/{viewpoint_id}
     * @param {string} projectId
     * @param {string} topicId
     * @param {string} viewpointId
     * @returns {Promise<ViewpointGET>}
     */
    async getViewpointById(projectId, topicId, viewpointId) {
        return this.http.get(
            `/bcf/${this.version}/projects/${projectId}/topics/${topicId}/viewpoints/${viewpointId}`);
    }

    /**
     * GET /bcf/{version}/projects/{project_id}/topics/{topic_id}/viewpoints
     * @param {string} projectId
     * @param {string} topicId
     * @returns {Promise<ViewpointGET[]>}
     */
    async getViewpoints(projectId, topicId) {
        return this.http.get(
            `/bcf/${this.version}/projects/${projectId}/topics/${topicId}/viewpoints`);
    }

    /**
     * GET /bcf/{version}/projects/{project_id}/topics/{topic_id}/viewpoints/{viewpoint_id}/visibility
     * @param {string} projectId
     * @param {string} topicId
     * @param {string} viewpointId
     * @returns {Promise<VisibilityGET>}
     */
    async getVisibility(projectId, topicId, viewpointId) {
        return this.http.get(
            `/bcf/${this.version}/projects/${projectId}/topics/${topicId}/viewpoints/${viewpointId}/visibility`);
    }

}
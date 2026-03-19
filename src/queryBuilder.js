

export function buildQueryString(query = {}, allowed = ['$filter', '$orderby', '$top', '$skip']) {
    const params = new URLSearchParams();
 
    for (const key of allowed) {
        const value = query[key];
        if (value !== undefined && value !== null && value !== '') {
            params.set(key, String(value));
        }
    }
 
    return params.size > 0 ? `?${params}` : '';
}
 
// Pre-defined allowed sets 
export const FULL_QUERY    = ['$filter', '$orderby', '$top', '$skip'];  // topics, events
export const FILTER_ONLY   = ['$filter', '$orderby'];                   // comments
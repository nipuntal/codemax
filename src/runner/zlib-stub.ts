// just-bash's browser build imports node:zlib for gzip/tar, which no question uses.
const unavailable = () => { throw new Error('gzip is not available here'); };
export const constants = {};
export const gzipSync = unavailable, gunzipSync = unavailable;

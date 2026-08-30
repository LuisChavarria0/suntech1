// Small wrapper around Vercel Blob so the rest of the code doesn't care whether
// we're on Vercel (persistent Blob storage) or local dev (writes to public/).
//
// The images Blob store was connected with the "SUNTECH" env-var prefix, so its
// read-write token is SUNTECH_READ_WRITE_TOKEN. We also accept the default
// BLOB_READ_WRITE_TOKEN in case the store is later reconnected without a prefix.

export const BLOB_TOKEN =
  process.env.SUNTECH_READ_WRITE_TOKEN ?? process.env.BLOB_READ_WRITE_TOKEN ?? "";

export const hasBlob = () => BLOB_TOKEN.length > 0;

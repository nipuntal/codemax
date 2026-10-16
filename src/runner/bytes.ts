// just-bash hands commands their stdin as bytes packed one per char (latin1),
// typed as an opaque ByteString that is a plain string at run time.
type Packed = object | string;
export const bytesOf = (s: Packed) => Uint8Array.from(s as string, (c) => c.charCodeAt(0));
const utf8 = new TextDecoder();
export const textOf = (s: Packed) => utf8.decode(bytesOf(s));

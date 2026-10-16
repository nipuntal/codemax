// Postgres via PGlite, spoken to over the simple-query wire protocol.
//
// Going through the raw protocol (rather than PGlite's query API) gives us
// values exactly as Postgres prints them, which is what psql shows, and it is
// synchronous, which is what a psycopg2 emulation running inside Python needs.
import type { PGlite } from '@electric-sql/pglite';

export interface Field { name: string; oid: number }
export interface Result { fields: Field[]; rows: (string | null)[][]; command: string }
export interface Reply { results: Result[]; notices: string[]; error: PgError | null }
export interface PgError { severity: string; code: string; message: string; detail?: string; hint?: string; position?: number; where?: string }

const enc = new TextEncoder();
const dec = new TextDecoder();

function queryMessage(sql: string) {
  const body = enc.encode(sql);
  const msg = new Uint8Array(1 + 4 + body.length + 1);
  msg[0] = 0x51; // 'Q'
  new DataView(msg.buffer).setInt32(1, 4 + body.length + 1);
  msg.set(body, 5);
  return msg;
}

function fieldsOf(buf: Uint8Array, start: number, end: number) {
  const out: Record<string, string> = {};
  let i = start;
  while (i < end && buf[i] !== 0) {
    const code = String.fromCharCode(buf[i++]);
    const z = buf.indexOf(0, i);
    out[code] = dec.decode(buf.subarray(i, z));
    i = z + 1;
  }
  return out;
}

function parse(buf: Uint8Array): Reply {
  const view = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
  const reply: Reply = { results: [], notices: [], error: null };
  let cur: Result | null = null;
  let i = 0;
  while (i < buf.length) {
    const type = buf[i];
    const len = view.getInt32(i + 1);
    const start = i + 5, end = i + 1 + len;
    switch (type) {
      case 0x54: { // T RowDescription
        const n = view.getInt16(start);
        let p = start + 2;
        const fields: Field[] = [];
        for (let k = 0; k < n; k++) {
          const z = buf.indexOf(0, p);
          const name = dec.decode(buf.subarray(p, z));
          p = z + 1;
          const oid = view.getInt32(p + 6);
          p += 18;
          fields.push({ name, oid });
        }
        cur = { fields, rows: [], command: '' };
        break;
      }
      case 0x44: { // D DataRow
        const n = view.getInt16(start);
        let p = start + 2;
        const row: (string | null)[] = [];
        for (let k = 0; k < n; k++) {
          const l = view.getInt32(p);
          p += 4;
          if (l < 0) row.push(null);
          else { row.push(dec.decode(buf.subarray(p, p + l))); p += l; }
        }
        cur?.rows.push(row);
        break;
      }
      case 0x43: { // C CommandComplete
        const command = dec.decode(buf.subarray(start, end - 1));
        reply.results.push(cur ? { ...cur, command } : { fields: [], rows: [], command });
        cur = null;
        break;
      }
      case 0x45: { // E ErrorResponse
        const f = fieldsOf(buf, start, end);
        reply.error = { severity: f.S ?? 'ERROR', code: f.C, message: f.M, detail: f.D, hint: f.H, position: f.P ? +f.P : undefined, where: f.W };
        cur = null;
        break;
      }
      case 0x4e: { // N NoticeResponse
        const f = fieldsOf(buf, start, end);
        reply.notices.push(`${f.S}:  ${f.M}`);
        break;
      }
    }
    i = end;
  }
  return reply;
}

let db: PGlite | null = null;
let ready: Promise<PGlite> | null = null;
let loader: (() => Promise<{ PGlite: typeof PGlite; sql: string }>) | null = null;

export const configurePg = (load: NonNullable<typeof loader>) => void (loader = load);

/** Boot Postgres once and load the course database. */
export function ensurePg() {
  return (ready ??= loader!().then(async ({ PGlite, sql }) => {
    const pg = await PGlite.create();
    await pg.exec(sql);
    await pg.exec('RESET ALL');
    db = pg;
    return pg;
  }));
}

export const pgReady = () => db !== null;

/** Run SQL synchronously (one or many statements). */
export function query(sql: string): Reply {
  if (!db) throw new Error('Postgres is not loaded');
  return parse(db.execProtocolRawSync(queryMessage(sql)));
}

/** "ERROR:  msg" plus the LINE/caret context psql prints. */
export function formatError(e: PgError, sql: string) {
  let s = `${e.severity}:  ${e.message}\n`;
  if (e.position) {
    const before = sql.slice(0, e.position - 1);
    const lineNo = before.split('\n').length;
    const line = sql.split('\n')[lineNo - 1];
    const col = before.length - before.lastIndexOf('\n') - 1;
    const prefix = `LINE ${lineNo}: `;
    s += `${prefix}${line}\n${' '.repeat(prefix.length + col)}^\n`;
  }
  if (e.detail) s += `DETAIL:  ${e.detail}\n`;
  if (e.hint) s += `HINT:  ${e.hint}\n`;
  if (e.where && e.severity !== 'NOTICE') s += `CONTEXT:  ${e.where}\n`;
  return s;
}

// psycopg2, as far as exam answers use it, on top of the synchronous PGlite
// bridge (_pglink.query returns JSON). Values arrive as Postgres text and are
// converted the way psycopg2 converts them (numeric -> Decimal, time -> time…).
export default String.raw`
import json as _json, datetime as _dt, decimal as _dec, re as _re
from _pglink import query as _query

apilevel = '2.0'
threadsafety = 2
paramstyle = 'pyformat'

class Warning(Exception): pass
class Error(Exception):
    def __init__(self, msg='', pgerror=None, pgcode=None):
        super().__init__(msg)
        self.pgerror = pgerror
        self.pgcode = pgcode
class InterfaceError(Error): pass
class DatabaseError(Error): pass
class DataError(DatabaseError): pass
class OperationalError(DatabaseError): pass
class IntegrityError(DatabaseError): pass
class InternalError(DatabaseError): pass
class ProgrammingError(DatabaseError): pass
class NotSupportedError(DatabaseError): pass

def _error_class(code):
    k = (code or '')[:2]
    return {'23': IntegrityError, '42': ProgrammingError, '22': DataError, '0A': NotSupportedError,
            '08': OperationalError, '40': OperationalError, '53': OperationalError, '57': OperationalError,
            'XX': InternalError}.get(k, DatabaseError)

# ---- results: Postgres text -> Python ------------------------------------
def _interval(s):
    days = 0
    m = _re.match(r'(?:(-?\d+) years?)?\s*(?:(-?\d+) mons?)?\s*(?:(-?\d+) days?)?\s*(?:(-?)(\d+):(\d+):(\d+(?:\.\d+)?))?$', s.strip())
    if not m: return s
    y, mo, d, sign, h, mi, sec = m.groups()
    days = int(y or 0) * 365 + int(mo or 0) * 30 + int(d or 0)
    t = _dt.timedelta(hours=int(h or 0), minutes=int(mi or 0), seconds=float(sec or 0))
    return _dt.timedelta(days=days) + (-t if sign == '-' else t)

def _array(s, conv):
    out, cur, q, i, inner = [], '', False, 0, s[1:-1]
    if inner == '': return []
    while i < len(inner):
        c = inner[i]
        if q:
            if c == '\\': i += 1; cur += inner[i]
            elif c == '"': q = False
            else: cur += c
        elif c == '"': q = True
        elif c == ',': out.append(cur); cur = ''
        else: cur += c
        i += 1
    out.append(cur)
    return [None if v == 'NULL' else conv(v) for v in out]

def _bool(s): return s == 't'
_CONV = {
    16: _bool, 20: int, 21: int, 23: int, 26: int, 700: float, 701: float, 1700: _dec.Decimal,
    1082: _dt.date.fromisoformat, 1083: _dt.time.fromisoformat, 1114: _dt.datetime.fromisoformat,
    1184: _dt.datetime.fromisoformat, 1186: _interval,
}
_ARRAYS = {1000: _bool, 1005: int, 1007: int, 1016: int, 1021: float, 1022: float, 1231: _dec.Decimal,
           1009: str, 1015: str, 1014: str, 1182: _dt.date.fromisoformat}
def _converter(oid):
    if oid in _CONV: return _CONV[oid]
    if oid in _ARRAYS:
        c = _ARRAYS[oid]
        return lambda s: _array(s, c)
    return str

# ---- parameters: Python -> SQL literal -----------------------------------
def _quote(v):
    if v is None: return 'NULL'
    if isinstance(v, bool): return 'true' if v else 'false'
    if isinstance(v, (int, _dec.Decimal)): return str(v)
    if isinstance(v, float):
        return "'NaN'::float" if v != v else ("'Infinity'::float" if v in (float('inf'), float('-inf')) else repr(v))
    if isinstance(v, _dt.datetime): return "'%s'::timestamp" % v.isoformat()
    if isinstance(v, _dt.date): return "'%s'::date" % v.isoformat()
    if isinstance(v, _dt.time): return "'%s'::time" % v.isoformat()
    if isinstance(v, _dt.timedelta): return "'%d days %d.%06d seconds'::interval" % (v.days, v.seconds, v.microseconds)
    if isinstance(v, (list,)): return 'ARRAY[%s]' % ', '.join(_quote(x) for x in v)
    if isinstance(v, tuple): return '(%s)' % ', '.join(_quote(x) for x in v)
    if isinstance(v, (bytes, bytearray, memoryview)): return "'\\x%s'::bytea" % bytes(v).hex()
    return "'" + str(v).replace("'", "''") + "'"

_PH = _re.compile(r'%(?:\((\w+)\))?(.)')
def _mogrify(sql, params):
    if params is None: return sql
    if isinstance(params, dict):
        def sub(m):
            if m.group(2) == '%' and m.group(1) is None: return '%'
            if m.group(2) != 's': raise ValueError("unsupported format character '%s'" % m.group(2))
            if m.group(1) is None: raise TypeError('format requires a mapping')
            return _quote(params[m.group(1)])
        return _PH.sub(sub, sql)
    if not isinstance(params, (list, tuple)):
        raise TypeError("'%s' object does not support indexing" % type(params).__name__)
    it = iter(params)
    def sub(m):
        if m.group(2) == '%' and m.group(1) is None: return '%'
        if m.group(1) is not None: raise TypeError('argument formats can\'t be mixed')
        if m.group(2) != 's': raise ValueError("unsupported format character '%s'" % m.group(2))
        try: return _quote(next(it))
        except StopIteration: raise IndexError('tuple index out of range')
    out = _PH.sub(sub, sql)
    if next(it, _PH) is not _PH: raise TypeError('not all arguments converted during string formatting')
    return out

class Column(tuple):
    def __new__(cls, name, oid): return super().__new__(cls, (name, oid, None, None, None, None, None))
    name = property(lambda self: self[0])
    type_code = property(lambda self: self[1])

class cursor:
    arraysize = 1
    def __init__(self, conn):
        self.connection = conn
        self.closed = False
        self._rows, self._pos = [], 0
        self.description, self.rowcount, self.statusmessage, self.query = None, -1, None, None
    def execute(self, sql, params=None):
        if self.closed: raise InterfaceError('cursor already closed')
        if self.connection.closed: raise InterfaceError('connection already closed')
        if isinstance(sql, bytes): sql = sql.decode()
        text = _mogrify(sql, params)
        self.query = text.encode()
        r = _json.loads(_query(text))
        if r['error']:
            e = r['error']
            raise _error_class(e['code'])(e['text'], e['text'], e['code'])
        last = r['results'][-1] if r['results'] else {'fields': [], 'rows': [], 'command': ''}
        tag = last['command']
        self.statusmessage = tag
        if last['fields']:
            convs = [_converter(f['oid']) for f in last['fields']]
            self._rows = [tuple(None if v is None else c(v) for c, v in zip(convs, row)) for row in last['rows']]
            self.description = tuple(Column(f['name'], f['oid']) for f in last['fields'])
            self.rowcount = len(self._rows)
        else:
            self._rows, self.description = [], None
            n = tag.split()[-1] if tag else ''
            self.rowcount = int(n) if n.isdigit() else -1
        self._pos = 0
    def executemany(self, sql, seq):
        n = 0
        for p in seq:
            self.execute(sql, p)
            n += max(self.rowcount, 0)
        self.rowcount = n
    def mogrify(self, sql, params=None): return _mogrify(sql, params).encode()
    def _need(self):
        if self.description is None: raise ProgrammingError('no results to fetch')
    def fetchone(self):
        self._need()
        if self._pos >= len(self._rows): return None
        self._pos += 1
        return self._rows[self._pos - 1]
    def fetchmany(self, size=None):
        self._need()
        n = self.arraysize if size is None else size
        out = self._rows[self._pos:self._pos + n]
        self._pos += len(out)
        return out
    def fetchall(self):
        self._need()
        out = self._rows[self._pos:]
        self._pos = len(self._rows)
        return out
    def __iter__(self):
        while True:
            r = self.fetchone()
            if r is None: return
            yield r
    def close(self): self.closed = True
    def __enter__(self): return self
    def __exit__(self, *a): self.close()

_open = []

class connection:
    # Each connection is a savepoint inside the runner's transaction: commit()
    # keeps the work, and anything uncommitted is rolled back when the script
    # ends, exactly as closing a real psycopg2 connection would.
    def __init__(self):
        self.closed = 0
        self.autocommit = False
        _query('SAVEPOINT _psycopg2')
        _open.append(self)
    def cursor(self, *a, **k): return cursor(self)
    def commit(self): _query('RELEASE SAVEPOINT _psycopg2; SAVEPOINT _psycopg2')
    def rollback(self): _query('ROLLBACK TO SAVEPOINT _psycopg2')
    def close(self):
        if not self.closed:
            self.closed = 1
            _query('ROLLBACK TO SAVEPOINT _psycopg2; RELEASE SAVEPOINT _psycopg2')
            _open.remove(self)
    def __enter__(self): return self
    def __exit__(self, t, v, tb):
        self.commit() if t is None else self.rollback()

def connect(dsn=None, **kwargs):
    return connection()

def _finish():
    for c in list(reversed(_open)): c.close()

class extensions:
    connection = connection
    cursor = cursor
`;

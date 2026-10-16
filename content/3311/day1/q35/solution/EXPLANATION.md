# Module 35

### Two lists that grow together

```python
conds.append("capacity >= %s")
args.append(val)
```

Every branch appends **exactly one** condition and **exactly one** value. That
invariant keeps the number of `%s` equal to the number of arguments, which is
the only thing that can really go wrong here.

### `conds = ["true"]`

With no arguments the query becomes `where true order by name` — valid, and
matches everything. Without the seed you would need a special case for "no
filters at all".

### The values never enter the query text

`val` is only ever appended to `args`. The strings that go into the query —
`"capacity >= %s"` and friends — are literals from our own source. So a room
type containing an apostrophe, or a deliberate injection attempt, is handled
safely (module 28).

### The `like` pattern is built in Python

```python
args.append("%" + val + "%")
```

The wildcards are part of the **value**. Writing them into the SQL around the
`%s` would collide with psycopg2's own use of `%` and waste ten minutes.

### `rtype::text = %s`

Casting the **column** to text, so an unknown room type quietly matches nothing
instead of raising an error (modules 00 and 29). Since the value came from the
command line, that is the forgiving behaviour you want.

### The unknown-keyword check

```python
else:
    print(USAGE)
    return
```

Without it, an unrecognised keyword would be silently ignored and the user would
get results that do not match what they asked for — worse than an error.

It also means only our four known condition strings can ever reach the query,
which is what makes the string-building safe.

### `min` and `max` stay as strings

We append `val` unconverted and let PostgreSQL compare it against an integer
column; psycopg2 sends it as text and the database coerces it. So
`./q35.py min abc` produces a database error rather than a Python one.

Converting with `int(val)` first would let you catch it yourself and print
`USAGE`. Either is defensible; the spec does not say, so the simpler version is
fine.

### Test the extremes

```bash
./q35.py                                  # everything
./q35.py type 'Computer Lab'              # one filter
./q35.py type 'Computer Lab' min 25 max 30 like EE   # all of them
./q35.py bogus 3                          # unknown keyword
./q35.py min                              # odd number of arguments
```

Bugs in built queries nearly always live in the empty case or the
all-at-once case, not in the middle.

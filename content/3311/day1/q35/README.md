# Module 35 &nbsp;·&nbsp; Python + Psycopg2

## When the query depends on the arguments


## LEARN FIRST

Real questions take optional filters — *"find me a room, of this type, seating
at least this many, free on this day"*, where any of those might be left out.

You cannot write one fixed query for that. You build it.

### Build a list of conditions, then join them

```python
conds = ["true"]
args  = []

if rtype is not None:
    conds.append("rtype::text = %s")
    args.append(rtype)

if minseats is not None:
    conds.append("capacity >= %s")
    args.append(minseats)

query = "select name, rtype, capacity from Rooms where " \
        + " and ".join(conds) + " order by name"
cur.execute(query, args)
```

The two lists stay in step: every time you add a condition you add its value.
That invariant is the whole technique.

If they ever drift apart you get one of:

```
IndexError: tuple index out of range
not all arguments converted during string formatting
```

Both mean the same thing — count your `%s` against your list.

### Why `conds = ["true"]`

With no filters at all, `" and ".join(conds)` gives `"true"`, so the query ends
`where true order by name` — perfectly valid SQL that matches everything.

Without the seed you would get `where  order by name`, a syntax error, and you
would need a special case for the empty list. One small trick, one whole branch
of code removed.

### The values stay parameters

Notice that the user's values are **never** put into the query text — only the
fixed condition strings are, and those come from your own source code. Module
28's rule still holds:

> **The *shape* of the query may depend on user input; the *values* must still
> be parameters.**

### What must never come from the user

Only values can be `%s`. If a **column name** or a **sort direction** varies,
you are building SQL text — and then you must control what goes in:

```python
ALLOWED = {"name": "name", "size": "capacity", "type": "rtype"}
if sortkey not in ALLOWED:
    print(USAGE)
    return
query += " order by " + ALLOWED[sortkey]      # safe: the value came from OUR dict
```

Never `query += " order by " + sys.argv[2]`. Look the user's word up in a
dictionary **you** wrote, and use the value from that. It is the same idea as
`quote_ident` in module 23.

### Debug what you built

```python
print(query)
print(args)
print(cur.mogrify(query, args))
```

When a built query goes wrong, look at the finished text before anything else.

---

## THE TASK

Search for rooms.

```
$ ./q35.py
AGSM-LG06|Computer Lab|30
...
$ ./q35.py type 'Computer Lab' min 25
AGSM-LG06|Computer Lab|30
EE-130|Computer Lab|30
...
```

Arguments come in **keyword/value pairs**, any number of them, in any order:

| keyword | meaning |
|---|---|
| `type NAME` | only rooms of that type |
| `min N` | only rooms seating at least N |
| `max N` | only rooms seating at most N |
| `like TEXT` | only rooms whose name contains TEXT, ignoring case |

- print each matching room as `NAME|TYPE|CAPACITY`, in name order
- with no arguments, print them all
- an **odd** number of arguments, or an unknown keyword → print `USAGE`
- if nothing matches, print nothing

## Hints

<details><summary>Hint 1</summary>

Walk `sys.argv[1:]` two at a time, appending to a `conds` list and an `args`
list together.
</details>

<details><summary>Hint 2</summary>

Seed `conds = ["true"]` so the `where` clause is always valid.
</details>

<details><summary>Hint 3</summary>

For `like`, build the `%TEXT%` pattern in Python and pass it as a value (module
28). For `type`, compare against `rtype::text` so a bad type finds nothing
rather than raising (module 29).
</details>

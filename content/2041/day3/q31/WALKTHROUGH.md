# Q31 Walkthrough — Join Two Files

> **Read this after you have attempted the question.**

---
## PART 1 — TEACH

### A join is two dicts and a set operation
```python
a = {key: value}   from file 1
b = {key: value}   from file 2

inner join  ->  set(a) & set(b)      keys in BOTH
outer join  ->  set(a) | set(b)      keys in EITHER
```
That's the whole algorithm. The rest is formatting.

Compare with the UNIX `join` command, which **requires both inputs to be sorted** and
silently produces wrong output if they aren't. Loading into dicts removes that
constraint entirely — which is exactly why the spec says the files are unsorted. **When
a question tells you the input is unordered, it is telling you which technique to use.**

### `set(dict)` gives the keys
```python
set(a)          # the keys, as a set
set(a.keys())   # identical, more explicit
a.keys() & b.keys()   # also works -- dict views support set operators
```

The four operators:
| op | meaning |
|---|---|
| `&` | in both (intersection) |
| `\|` | in either (union) |
| `-` | in the first only |
| `^` | in exactly one |

### `.get(key, default)` for the missing side
```python
print(f"{key}|{a.get(key, '-')}|{b.get(key, '-')}")
```
`a[key]` raises `KeyError` for a key that's only in `b`. `.get(key, '-')` supplies the
placeholder the spec asks for — and the **same line of code** works for the inner join,
where both are always present.

That's worth noticing: by using `.get` you avoid an `if show_all` branch in the printing
code. The option only changes *which keys* you iterate.

### `split('|', 1)` — the maxsplit argument
```python
key, value = line.rstrip('\n').split('|', 1)
```
`1` means "split at most once", so a value containing a `|` stays intact and the unpack
into exactly two names can't fail. Without it, a three-field line raises `ValueError`.

**Use `maxsplit` whenever you're splitting a known prefix off the front of a line.**

### A function for the repeated work
```python
def load(filename):
    ...
    return d

a = load(file1)
b = load(file2)
```
You do the same thing twice; make it a function. It also makes the parsing testable on
its own.

### Parsing an optional leading flag
```python
if args and args[0] == '-a':
    show_all = True
    args = args[1:]

file1, file2 = args
```
Strip the flag if present, then unpack the remainder. `args and ...` guards against an
empty list — Python's `and` short-circuits, so `args[0]` is only evaluated once `args`
is known non-empty.

---
## PART 2 — THE APPROACH

1. Parse the optional `-a`.
2. `load()` each file into a dict.
3. Choose the key set: `&` for inner, `|` for outer.
4. `for key in sorted(keys)` and print with `.get(key, '-')` on both sides.

---
## PART 3 — THE SOLUTION

```python
def load(filename):
    d = {}
    with open(filename) as f:
        for line in f:
            key, value = line.rstrip('\n').split('|', 1)
            d[key] = value
    return d

a = load(file1)
b = load(file2)

keys = (set(a) | set(b)) if show_all else (set(a) & set(b))

for key in sorted(keys):
    print(f"{key}|{a.get(key, '-')}|{b.get(key, '-')}")
```

---
## PART 4 — EDGE CASES & WHAT MARKERS CHECK

* **`sorted(keys)`** — sets have no order, and the spec demands sorted output.
* **`.get(key, '-')` on both sides**, so one code path serves both modes.
* **`5122456` (names only) and `3711611` (marks only)** appear **only** with `-a`.
  Those two rows are the whole test.
* **`.rstrip('\n')` before splitting**, or the second value carries a newline into your
  f-string and you get blank lines.
* **`split('|', 1)`** so a value containing a pipe survives.
* Keys sort as **strings** here. If the spec had said numeric order you'd need
  `key=int`.

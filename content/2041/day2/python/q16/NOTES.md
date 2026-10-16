# Notes — parsing a spec string, and matching a real tool's quirks

## Reimplementing a tool means reproducing its quirks
Three of `cut`'s behaviours are easy to miss, and all three are in the examples:

1. **Output is always in field order.** `-f5,1,2` prints fields 1,2,5 — *not* 5,1,2.
   `cut` does not reorder. (This is exactly why Day-2 shell Q9 needed `sed`.)
2. **Duplicates collapse.** `-f1,1,2` prints fields 1 and 2 once each.
3. **A line with no delimiter is printed whole**, not skipped and not blanked.

A `set` handles 1 and 2 at once: collect the wanted field numbers into a set, then
iterate `sorted(...)`.

## Parsing the field list
```python
for part in spec.split(','):
    if '-' in part:
        lo, hi = part.split('-')
        ...
    else:
        wanted.add(int(part))
```
The three range forms differ only in which side is empty:
| written | `part.split('-')` | meaning |
|---|---|---|
| `2-4` | `['2', '4']` | 2..4 |
| `3-`  | `['3', '']`  | 3..end |
| `-2`  | `['', '2']`  | 1..2 |

So:
```python
lo = int(lo) if lo else 1
hi = int(hi) if hi else None      # None = "to the end"
```
**An empty string on either side of the split is how you detect an open-ended range.**
That's the whole trick, and it generalises to Python slice syntax, `sed` addresses, and
plenty else.

## "To the end" without knowing the end
You don't know how many fields a line has until you split it. So store `None` and
resolve per line:
```python
hi = len(fields) if hi is None else hi
```
Alternatively store a large sentinel — but `None` says what you mean.

## Selecting
```python
out = [fields[i - 1] for i in sorted(wanted) if 1 <= i <= len(fields)]
print(delim.join(out))
```
* `i - 1` — the 1-based/0-based conversion, again.
* The bounds guard drops field numbers beyond the end of a short line. `-f3-` on `x:y`
  selects nothing, so the output is an **empty line** — check the sample: it's there.

## Handling ranges when hi is per-line
Because `N-` depends on the line, you must expand the ranges **inside** the line loop,
not once at the start. Keep the parsed spec as a list of `(lo, hi)` pairs and expand
each line:
```python
for lo, hi in ranges:
    top = len(fields) if hi is None else hi
    for i in range(lo, top + 1):
        wanted.add(i)
```

## Reading files or stdin
```python
files = sys.argv[...] or None
f = sys.stdin if not filenames else open(name)
```
The standard filter shape. `for line in f` either way.

## Edge cases
* `nodelimiter` — no `:` in the line → printed unchanged, for every `-f` spec.
* `x:y` with `-f3-` → no fields in range → empty line.
* `-f5,1,2` → output `a:b:e`, in field order.
* `-d:` written with no space — `sys.argv` gives `-d:` as one argument if written that
  way, or `-d` and `:` as two. Decide which you support; the samples use `-d:` **and**
  `-d :` interchangeably in real `cut`. Supporting the joined form is one extra line.

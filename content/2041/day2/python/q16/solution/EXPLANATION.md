# Q16 explanation

## Parsing `-dX` and `-d X`
```python
    if a.startswith('-d'):
        if a == '-d':
            i += 1
            delim = args[i]
        else:
            delim = a[2:]
```
Real `cut` accepts both `-d:` and `-d :`. The `startswith` test catches both; `a[2:]`
takes everything after the flag when they're joined, and consuming the next argument
handles the separated form.

An index-based `while` (rather than `for`) is what lets you consume the *next* argument
from inside the loop.

## The range forms, detected by empty strings
```python
lo, hi = part.split('-')
ranges.append((int(lo) if lo else 1, int(hi) if hi else None))
```
| written | split result | stored |
|---|---|---|
| `2-4` | `['2','4']` | `(2, 4)` |
| `3-`  | `['3','']`  | `(3, None)` |
| `-2`  | `['','2']`  | `(1, None→2)` … i.e. `(1, 2)` |

**An empty half means "open-ended on that side".** `None` for the upper bound means
"to the end of the line", which can't be resolved until you know how many fields the
line has.

A bare `N` is stored as `(N, N)` so the expansion code has one shape to handle.

## Why ranges are expanded per line
`-f3-` on `a:b:c:d:e` means 3,4,5; on `x:y` it means nothing. The top of an open range
depends on the line, so the expansion lives inside `do_line`:
```python
        top = len(fields) if hi is None else hi
```

## The `set` gives you two `cut` behaviours free
```python
    wanted = set()
    ...
    out = [fields[n - 1] for n in sorted(wanted) if 1 <= n <= len(fields)]
```
* **Order**: `sorted(wanted)` means `-f5,1,2` outputs fields 1, 2, 5 — real `cut` never
  reorders, and neither do we.
* **Duplicates**: a set collapses `-f1,1` to one field.

Reimplementing a tool is mostly about reproducing its quirks. Read the examples in the
spec as a list of quirks to satisfy.

## The bounds guard
`if 1 <= n <= len(fields)` drops field numbers past the end of a short line. `-f3-` on
`x:y` selects nothing, so `delim.join([])` is `''` and an empty line is printed — which
is what the sample shows.

Without the guard, `fields[4]` on a 2-field line raises `IndexError`.

## Lines without the delimiter
```python
    if delim not in line:
        print(line)
        return
```
`cut` passes them through untouched. Easy to forget, and one of the sample lines exists
purely to test it.

## `stdin` or files
```python
if filenames:
    ... open(name) ...
else:
    ... sys.stdin ...
```
The standard filter shape: named files if given, stdin otherwise. Factoring the
per-line work into `do_line` keeps that dispatch to four lines.

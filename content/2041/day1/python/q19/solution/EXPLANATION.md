# Python Q19 explanation

## The translation, stage by stage

| shell stage | python |
|---|---|
| `grep -v '^#'`   | `if line.startswith('#'): continue` |
| `cut -d' ' -f1`  | `line.split()[0]` |
| `sort \| uniq -c`| `counts[date] = counts.get(date, 0) + 1` |
| `sort -rn`       | `key=lambda kv: -kv[1]` |
| `head -n 3`      | `[:3]` |

```python
    if line.startswith('#'):
        continue
```
`grep -v '^#'` anchors at the start, and `.startswith` *is* that anchor.
`if '#' in line` would be `grep -v '#'` — a different (wrong) filter.
When the pattern is a plain prefix, `.startswith` beats a regex.

```python
    fields = line.split()
    date = fields[0]
```
`cut -d' ' -f1` is field **1** (1-based) = index **0** (0-based). Write the mapping
down when you translate; this is where marks vanish.

`line.split()` (no argument) is slightly better than `line.split(' ')` here — it
collapses runs of spaces, matching what a human means by "the first field".

```python
    if not fields:
        continue
```
Guards against a blank line, where `fields[0]` would raise `IndexError`.
There are no blank lines in this data, but a one-line guard costs nothing and real
input always has one.

```python
top = sorted(counts.items(), key=lambda kv: (-kv[1], kv[0]))[:3]
```
* `counts.items()` → a list of `(date, count)` pairs
* `-kv[1]` → count descending (this is `sort -rn`)
* `kv[0]`  → date ascending, breaking ties
* `[:3]`   → `head -n 3`. Slicing past the end is safe: a 2-element list `[:3]` just
  gives 2 elements, so no bounds check is needed.

```python
    print(f"{count} {date}")
```
Real `uniq -c` pads the count with spaces. The spec asked for exactly one space, so we
don't reproduce the padding. **Always match the spec's format, not the tool's.**

## The Counter version
```python
from collections import Counter
counts = Counter(l.split()[0] for l in sys.stdin if not l.startswith('#'))
for date, count in sorted(counts.items(), key=lambda kv: (-kv[1], kv[0]))[:3]:
    print(f"{count} {date}")
```
Three lines. Correct and impressive — but only write it if you can do it without
hesitating. The explicit version scores the same.

# Python Q16 — regex: capture groups  (regex)

**Difficulty:** ⭐⭐⭐ · **Target time:** 8 min

---
## LEARN FIRST

Round brackets **capture** part of the match so you can pull it out.

```python
m = re.search(r'(\d+)-(\d+)', 'range 10-25 here')
m.group()      # '10-25'   the whole match     (same as m.group(0))
m.group(1)     # '10'
m.group(2)     # '25'
m.groups()     # ('10', '25')   a tuple of all groups
```

### The safe pattern — always check for None
```python
m = re.search(r'(\d+)-(\d+)', line)
if m:
    lo, hi = m.group(1), m.group(2)
```
`re.search` returns `None` when there's no match, and `None.group(1)` is an
`AttributeError` that crashes your program. **Never call `.group()` without checking**,
unless you know the match is guaranteed.

Neat idiom for unpacking:
```python
if m:
    lo, hi = m.groups()
```

### Named groups — clearer for 3+ fields
```python
m = re.search(r'(?P<day>\d{2})/(?P<month>\d{2})/(?P<year>\d{4})', line)
m.group('year')
```

### Non-capturing groups
```python
r'(?:https?)://(\w+)'      # (?: ) groups without capturing
```
So group 1 is the hostname, not the protocol. Use it when you need brackets purely
for `|` or `?`.

### Splitting a line: regex vs .split()
If the line has a simple separator, **use `.split()`** — it's shorter and clearer.
Reach for regex when the structure is irregular:
```
[2026-08-07 10:14:02] ERROR (db) connection refused
```
`.split()` can't cleanly get the four fields; one regex can.

---
## THE TASK

`app.log` has lines like:
```
[2026-08-07 10:14:02] ERROR (db) connection refused
```
i.e. `[DATE TIME] LEVEL (MODULE) MESSAGE`.

Write `q16.py` that reads stdin and:

* for each line that matches the format, prints
  `TIME LEVEL MODULE: MESSAGE`
* for each line that does **not** match, prints `malformed: LINE` (line stripped)

Then prints a final summary line:
```
N lines, M malformed, levels: LEVEL=C LEVEL=C ...
```
with the levels listed alphabetically.

Run as: `./q16.py < app.log`

---
## HINTS
<details><summary>Hint 1</summary>
```python
m = re.fullmatch(r'\[(\S+) (\S+)\] (\w+) \((\w+)\) (.*)', line.strip())
```
Note `\[` and `\(` — brackets are special in regex, so escape the literal ones.
</details>
<details><summary>Hint 2</summary>
Count levels with the `counts.get(k, 0) + 1` idiom from Q5.
</details>

## CHECK
```sh
./test.sh
```

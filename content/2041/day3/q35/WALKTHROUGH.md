# Q35 Walkthrough — Format A Table

> **Read this after you have attempted the question.**

---
## PART 1 — TEACH

### You need two passes
You cannot print row 1 until you know the width of every column, and that depends on
rows you haven't read yet. So: **read everything, measure, then print.**

```python
rows = [line.rstrip('\n').split('|') for line in sys.stdin]
widths = [...]      # pass 1: measure
for row in rows:    # pass 2: print
```
Same lesson as Q14 (day 2) and Q13 here: when the decision depends on the whole input,
buffer it.

### Column widths with a comprehension over columns
```python
widths = [max(len(row[c]) for row in rows) for c in range(ncols)]
```
Read it inside-out:
* inner: `max(len(row[c]) for row in rows)` — the widest cell **in column c**, walking
  *down* the column
* outer: do that for every column index

`row[c] for row in rows` is how you traverse a column of a list-of-lists. Worth
memorising — the natural iteration is by row, and columns need this shape.

`zip(*rows)` transposes and gives the same thing:
```python
widths = [max(len(cell) for cell in col) for col in zip(*rows)]
```
Either is fine.

### Detecting a numeric column
```python
numeric = [all(row[c].isdigit() for row in rows[1:]) for c in range(ncols)]
```
* `rows[1:]` — skip the header, which is a word even in a numeric column.
* `str.isdigit()` — True only if every character is 0-9 (so it rejects `-5`, `3.4`, `''`).
* `all(...)` — True only if **every** data cell qualifies.

`all()` and `any()` over a generator are the idiomatic "do all/does any" tests. `all([])`
is `True`, which is a sensible default for a table with only a header.

### Dynamic field widths in an f-string
```python
f"{value:<{width}}"     # left-aligned in `width` columns
f"{value:>{width}}"     # right-aligned
```
The **nested braces** are the key: `{width}` inside the format spec is itself evaluated.
Without that you'd have to build the format string by concatenation.

Reminder on defaults: **strings left-align, numbers right-align**. Since everything here
is a string (they came from `split`), you must write `<` or `>` explicitly — the default
would left-align even the numeric columns.

### Joining and stripping
```python
print('  '.join(cells).rstrip())
```
* `'  '.join(...)` puts exactly two spaces **between** columns, and none after the last.
* `.rstrip()` removes the padding the *last* column added — the widest cell in a
  left-aligned final column would otherwise leave trailing spaces on shorter rows.

"No trailing whitespace" is an explicit requirement and a diff catches it instantly.

---
## PART 2 — THE APPROACH

1. Read all rows, split on `|`.
2. Compute `widths` per column.
3. Compute `numeric` per column from the data rows only.
4. For each row, format each cell with the right alignment and width, join with two
   spaces, `rstrip`, print.

---
## PART 3 — THE SOLUTION

```python
rows = [line.rstrip('\n').split('|') for line in sys.stdin]
ncols = len(rows[0])
widths = [max(len(row[c]) for row in rows) for c in range(ncols)]
numeric = [all(row[c].isdigit() for row in rows[1:]) for c in range(ncols)]

for row in rows:
    cells = []
    for c in range(ncols):
        if numeric[c]:
            cells.append(f"{row[c]:>{widths[c]}}")
        else:
            cells.append(f"{row[c]:<{widths[c]}}")
    print('  '.join(cells).rstrip())
```

---
## PART 4 — EDGE CASES & WHAT MARKERS CHECK

* **The header counts towards the width** but **not** towards the numeric test.
  In `table.psv`, `price` (5 chars) is wider than any of its values, and the column is
  still right-aligned.
* **No trailing whitespace.** `.rstrip()` on the joined line.
* **Two spaces between columns**, not one, not a tab.
* **`<` and `>` written explicitly** — everything is a string, so the default alignment
  is wrong for the numeric columns.
* **Nested braces** `{:>{w}}` for the dynamic width.
* An empty input should produce no output rather than crash — hence the `if not rows`
  guard.

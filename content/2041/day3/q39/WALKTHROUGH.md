# Q39 Walkthrough — Compare Two Files

> **Read this after you have attempted the question.**

Q13 (the exam's *mirrored files*) reported the **first** difference and stopped. This one
needs a **count as well**, which changes the shape of the solution.

---
## PART 1 — TEACH

### Collect first, then decide
Q13 could `break` on the first mismatch. Here you need "how many differ" **and** "where
is the first", so you must look at all of them:

```python
common = min(len(lines1), len(lines2))
differing = [i for i in range(common) if lines1[i] != lines2[i]]
```
One comprehension gives you both facts:
* `len(differing)` — how many
* `differing[0]` — the first (if the list is non-empty)

**When you need a count *and* a position, build the list of positions.** Two separate
loops, or a counter plus a "first" variable, are more code and more state to get wrong.

### `min(len(a), len(b))` — comparing only the overlap
The spec says the count considers only the first `min(A, B)` lines. `range(common)`
does exactly that and — importantly — **never indexes past the end of the shorter
list**, so the same code handles equal and unequal lengths.

Compare with writing `range(len(lines1))`, which raises `IndexError` the moment file 2 is
shorter.

### An empty list is falsy
```python
elif differing:
```
`[]` is falsy, a non-empty list truthy. So `elif differing:` reads as "if there were any
differences". No `len(differing) > 0` needed.

Falsy values worth knowing: `0`, `""`, `[]`, `{}`, `None`, `False`.

### The decision order
```python
if len(lines1) != len(lines2):      # different sizes: report both counts
elif differing:                      # same size, some differ
else:                                # same size, none differ
```
Three mutually exclusive outcomes in the spec's priority order, so an `if/elif/else`
chain — **exactly one branch runs, so exactly one line prints**, which is the
requirement. No `sys.exit` needed here, unlike Q13 where the checks were interleaved
with a loop.

### `differing[0] + 1`
`differing` holds 0-based indices; the spec numbers lines from 1. The `+ 1` is only
applied at the point of printing — keep internal data 0-based and convert at the
boundary. Mixing the two conventions in the middle of a program is how off-by-ones
breed.

### Multi-line f-strings
```python
    print(f"{name1} has {len(lines1)} lines, {name2} has {len(lines2)} lines; "
          f"{len(differing)} common line(s) differ")
```
Adjacent literals concatenate; **each fragment needs its own `f`**. Miss the second `f`
and `{len(differing)}` appears literally in your output.

### `readlines()` keeps the newlines
Both sides keep them, so comparisons are consistent. You never print the lines
themselves, only counts and positions, so stripping would gain nothing.

---
## PART 2 — THE APPROACH

1. Read both files into lists.
2. `common = min(...)`; build `differing` over `range(common)`.
3. Three-branch decision, in the spec's order.
4. Check every sample — including both argument orders for the different-length case,
   since the message names the files.

---
## PART 3 — THE SOLUTION

```python
with open(name1) as f:
    lines1 = f.readlines()
with open(name2) as f:
    lines2 = f.readlines()

common = min(len(lines1), len(lines2))
differing = [i for i in range(common) if lines1[i] != lines2[i]]

if len(lines1) != len(lines2):
    print(f"{name1} has {len(lines1)} lines, {name2} has {len(lines2)} lines; "
          f"{len(differing)} common line(s) differ")
elif differing:
    print(f"{len(differing)} line(s) differ, first at line {differing[0] + 1}")
else:
    print("identical")
```

---
## PART 4 — EDGE CASES & WHAT MARKERS CHECK

* **`a.txt` vs `c.txt`** — different lengths, but the two common lines are identical, so
  the count is **0**. If you report 2, you compared the wrong range.
* **Argument order matters** in the length message: the filenames and counts swap. Test
  both directions.
* **`differing[0] + 1`** for the 1-based line number.
* **Exactly one line of output** — guaranteed by the `if/elif/else`.
* **`min(len, len)`** so you never index past the shorter file.
* **`line(s)` is not pluralised** — the literal string, even for 1 and 0. Transcribe the
  format.
* `identical` is lowercase and alone on the line.

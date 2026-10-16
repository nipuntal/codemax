# Q12 Walkthrough — Is This File Sorted?

> **Read this after you have attempted the question.**

Warm-up for Q13 (the exam's *mirrored files*): both are "walk two sequences in step,
report the first mismatch".

---
## PART 1 — TEACH

### Comparing adjacent elements
```python
for i in range(len(lines) - 1):
    if lines[i] > lines[i + 1]:
```
The `- 1` is the whole question. With `n` lines there are `n - 1` **adjacent pairs**, and
the last valid `i` is `n - 2` so that `lines[i + 1]` is the final element.

Write `range(len(xs) - 1)` from memory whenever you compare neighbours. Using
`range(len(xs))` gives `IndexError` on the last iteration.

### `for ... else` — "if the loop finished without breaking"
```python
for i in range(len(lines) - 1):
    if ...:
        print("Not sorted: ...")
        break
else:
    print("Sorted")
```
The `else` belongs to the **`for`**, not to the `if`. It runs **only when no `break`
happened** — which is exactly "no out-of-order pair was found".

Mentally rename it **`for ... then-if-no-break`** and it stops being strange. It removes
the flag variable that people forget to set:
```python
ok = True
for ...:
    if ...:
        ok = False
        break
if ok:
    print("Sorted")
```
Both are correct. `for ... else` is examinable and worth owning.

### Strings compare lexicographically
`"apple" < "banana"` is `True`. Comparison is character by character using character
codes, so:
* **uppercase sorts before lowercase** — `"Z" < "a"` is `True`
* digits sort before letters
* a shorter string that is a prefix sorts first — `"cat" < "catalog"`

This is the same order `sort` uses (in the C locale). It is **not** case-insensitive
"dictionary" order — if a question wanted that, you'd compare `.lower()`.

### `<=` vs `<`
The spec says non-decreasing, so equal adjacent lines are fine. Testing
`lines[i] > lines[i+1]` (strictly greater) is the correct negation — `>=` would report
`equal.txt` as unsorted.

Get the boundary right by testing the equal case explicitly. That's why `equal.txt` is
in the data.

### `splitlines()` vs `readlines()`
```python
f.read().splitlines()   # ['apple', 'banana']      no newlines
f.readlines()           # ['apple\n', 'banana\n']  newlines kept
```
Strip them here: you're **comparing** the lines, and a trailing `\n` participates in
that comparison. It happens not to change the answer (every line has one), but the
habit matters — and `print(line)` then works without `end=''`.

### Degenerate inputs fall out
* Empty file → `lines` is `[]` → `range(-1)` is empty → loop doesn't run → `else` fires
  → `Sorted`. ✓
* One line → `range(0)` is empty → `Sorted`. ✓

`range(-1)` is empty, not an error. **No special cases needed** — check that before
writing any.

---
## PART 2 — THE APPROACH

1. Read all the lines, stripped.
2. Loop over the `n - 1` adjacent pairs.
3. First pair out of order → print with `i + 1` (1-based) and `break`.
4. `for ... else` → print `Sorted`.

---
## PART 3 — THE SOLUTION

```python
with open(sys.argv[1]) as f:
    lines = f.read().splitlines()

for i in range(len(lines) - 1):
    if lines[i] > lines[i + 1]:
        print(f"Not sorted: line {i + 1}")
        break
else:
    print("Sorted")
```

`unsorted1.txt` is `apple, cherry, banana, date`. The first bad pair is index 1 vs 2
(`cherry > banana`), so the reported line number is `1 + 1 = 2`. ✓

---
## PART 4 — EDGE CASES & WHAT MARKERS CHECK

* **`range(len(lines) - 1)`** — off by one either way is the classic failure.
* **`i + 1`** for the 1-based line number. The spec numbers from 1; Python from 0.
  Check it against the sample rather than trusting the arithmetic.
* **`break` on the first mismatch.** The spec says *first*; without `break` you'd print
  a line per mismatch and produce several lines of output.
* **`equal.txt` must be `Sorted`.** Uses `>` not `>=`.
* **Empty and single-line files must be `Sorted`.** They are, for free.
* Exactly one line of output in every case.

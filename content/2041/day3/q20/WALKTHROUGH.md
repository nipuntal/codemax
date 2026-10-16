# Q20 Walkthrough — Tidy A File In Place

> **Read this after you have attempted the question.**

Warm-up for Q21 (the exam's line-wrapping question). The *in-place* mechanics are the
same; only the transformation differs.

---
## PART 1 — TEACH

### Editing a file in place: read everything, then write
```python
with open(filename) as f:
    lines = [line.rstrip() for line in f]

# ...transform...

with open(filename, 'w') as f:
    for line in out:
        print(line, file=f)
```
**Read the whole file and close it before you open it for writing.** Opening with `'w'`
**truncates the file to zero bytes immediately** — if the read handle is still open and
lazy, you lose the data.

The `with` blocks make this automatic: the first closes at the end of its block, the
second opens fresh.

The shell equivalent of this trap is `cmd < f > f`, which destroys `f` for the same
reason. Python's version is subtler because it only bites if you interleave the
handles.

A temp file plus `os.replace()` is the bulletproof version, and is what you'd do in real
code:
```python
import os
with open(filename + '.tmp', 'w') as f: ...
os.replace(filename + '.tmp', filename)
```
For an exam, read-all-then-write is accepted and shorter.

### `print(line, file=f)`
`file=` redirects `print` to an open file. It still adds the `\n`, so this pairs
naturally with lines you've stripped.

The alternative is `f.write(line + '\n')`. Pick one convention — mixing them is how you
get missing or doubled newlines.

### `.rstrip()` vs `.rstrip('\n')`
Here the spec says **remove trailing whitespace**, so plain `.rstrip()` is right — it
removes spaces, tabs *and* the newline in one go.

In Q13 the spec said "the line with its newline removed", where `.rstrip('\n')` was the
honest choice. **Match the method to the spec's wording**, not to habit.

| method | on `"hi  \t\n"` |
|---|---|
| `.rstrip('\n')` | `"hi  \t"` |
| `.rstrip()`     | `"hi"` |
| `.strip()`      | `"hi"` (also strips the front) |

### Squeezing consecutive blanks — look at what you last emitted
```python
out = []
for line in lines:
    if line == '' and out and out[-1] == '':
        continue
    out.append(line)
```
The test is on **`out[-1]`, not on the previous input line**. That's the key idea: you're
asking "did I just emit a blank?", which is what "runs of blanks collapse to one" really
means.

`out and out[-1] == ''` — the `out and` guard prevents `IndexError` on the first
iteration when `out` is empty. Python's `and` short-circuits, so `out[-1]` is only
evaluated once `out` is known non-empty. **Order the operands so the cheap guard comes
first**; this pattern appears everywhere.

### Trimming the ends
```python
while out and out[0] == '':
    out.pop(0)
while out and out[-1] == '':
    out.pop()
```
`while`, not `if` — there could be several. The `out and` guard again handles a file
that is *entirely* blank lines, which would otherwise empty the list and then crash.

`out.pop()` removes the last element; `out.pop(0)` the first.

---
## PART 2 — THE APPROACH

1. Read all lines, `.rstrip()`ing each. The file handle closes.
2. Build `out`, skipping a blank whose predecessor in `out` is already blank.
3. Trim leading and trailing blanks with two `while` loops.
4. Reopen with `'w'` and print each line.
5. **Verify it printed nothing to stdout**: `./q20.py f | wc -c` must be `0`.

---
## PART 3 — THE SOLUTION

```python
filename = sys.argv[1]

with open(filename) as f:
    lines = [line.rstrip() for line in f]

out = []
for line in lines:
    if line == '' and out and out[-1] == '':
        continue
    out.append(line)

while out and out[0] == '':
    out.pop(0)
while out and out[-1] == '':
    out.pop()

with open(filename, 'w') as f:
    for line in out:
        print(line, file=f)
```

---
## PART 4 — EDGE CASES & WHAT MARKERS CHECK

* **Nothing on stdout.** A stray `print` for debugging fails the question outright.
  Check with `| wc -c`.
* **Run it twice.** The second run must leave the file unchanged — that's what
  "idempotent" means and it's a free correctness check for any tidy-up program.
* **A file that is entirely blank lines** → becomes empty. The `out and` guards are what
  stop this crashing.
* **An already-tidy file** → unchanged.
* **`.rstrip()` not `.strip()`** — leading indentation must survive. `.strip()` would
  silently reformat indented code.
* Close the read handle before opening for write.
* The file must still end with a newline on its last line — `print(..., file=f)` gives
  you that.

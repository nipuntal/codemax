# Q21 Walkthrough — Wrap Lines In Place (exam Q9, 8 marks)

> **Read this after you have attempted the question.**

---
## PART 1 — TEACH

### The rule you must not miss
> The above rules should also be applied to **new lines as they are created**.

Splitting `hello there how are you today` at n=12 gives `hello there` and
`how are you today`. The **remainder is still too long** and must be split again.
This is a **repeat-until-stable** process, not one pass.

Two ways to express it:

**A work queue** (the sample solution):
```python
todo = list(lines)
while todo:
    line = todo.pop(0)
    ...
    out.append(head)
    todo.insert(0, rest)     # push the remainder back to be reconsidered
```
Push the tail back on the **front** of the queue so it is processed next, keeping the
output in order.

**Recursion**, or an inner `while` per line, work equally well. Pick the one you can
write without hesitating. The queue generalises best.

### The two split rules, and why the order matters
```python
head = line[:n]
if ' ' in head:
    pos = head.rindex(' ')     # LAST space within the first n characters
else:
    pos = line.index(' ')      # FIRST space anywhere on the line
```
* **Normal case**: break as late as possible while staying within n → the *last* space
  in `line[:n]`. That's `rindex` (search from the right).
* **Long-word case**: the first n characters are one unbroken word, so you cannot honour
  n. Break at the *first* space in the whole line, however far out it is — `index`.

`str.index(sub)` finds the leftmost occurrence, `str.rindex(sub)` the rightmost. Both
raise `ValueError` if absent; `.find()` / `.rfind()` return `-1` instead. Using
`index`/`rindex` is fine here because you've already tested with `in`.

### The guard clauses
```python
if len(line) <= n or ' ' not in line:
    out.append(line)
    continue
```
The spec's first two rules are "don't touch it" cases. Handling them as a **guard
clause with `continue`** means the rest of the loop body can assume the line *is* being
split. No nesting.

Note `' ' not in line` must be checked — a 200-character line with no spaces stays a
200-character line. Without this test, `line.index(' ')` raises `ValueError`.

### The space is replaced, not kept
```python
out.append(line[:pos])
todo.insert(0, line[pos + 1:])
```
`line[:pos]` excludes the space; `line[pos + 1:]` starts **after** it. The space becomes
the newline — it doesn't survive at the end of one line or the start of the next.

Off-by-one here produces trailing spaces that are invisible when you `cat` the file and
very visible to a diff. Check with `cat -A` or `| sed -n l`.

### Reading and writing in place
```python
with open(filename) as f:
    lines = f.read().splitlines()
...
with open(filename, 'w') as f:
    for line in out:
        print(line, file=f)
```
Read fully, close, then open for writing — `'w'` truncates immediately. `splitlines()`
strips the newlines so `len(line)` is the length **not including the newline**, exactly
as the spec measures it.

That last point is worth pausing on: if you used `readlines()`, every `len(line)` would
be one too big and your n would be off by one on every line.

---
## PART 2 — THE APPROACH

1. `n = int(sys.argv[1])`, filename is `sys.argv[2]`.
2. Read all lines with `splitlines()` (no newlines, so lengths are right).
3. Work queue: pop a line from the front.
   * short enough, or no space → emit unchanged.
   * else find the split point by the two rules.
   * emit `line[:pos]`, push `line[pos+1:]` back onto the front.
4. Write everything back.
5. Confirm nothing went to stdout.

Trace `hello there how are you today` at **n=12** on paper before coding:
```
"hello there how are you today"   len 29 > 12, head="hello there " -> last space at 11
  emit "hello there",  rest "how are you today"
"how are you today"               len 17 > 12, head="how are you " -> last space at 11
  emit "how are you",  rest "today"
"today"                           len 5 <= 12 -> emit
```
Three lines, matching the sample. If your trace doesn't match, fix the trace before you
fix the code.

---
## PART 3 — THE SOLUTION

```python
n = int(sys.argv[1])
filename = sys.argv[2]

with open(filename) as f:
    lines = f.read().splitlines()

out = []
todo = list(lines)

while todo:
    line = todo.pop(0)

    if len(line) <= n or ' ' not in line:
        out.append(line)
        continue

    head = line[:n]
    if ' ' in head:
        pos = head.rindex(' ')
    else:
        pos = line.index(' ')

    out.append(line[:pos])
    todo.insert(0, line[pos + 1:])

with open(filename, 'w') as f:
    for line in out:
        print(line, file=f)
```

---
## PART 4 — EDGE CASES & WHAT MARKERS CHECK

* **Re-wrapping the remainder.** The single most common failure: one pass over the
  original lines, leaving over-long tails. Test `n=6` on `hello.txt` — it must produce
  **six** lines.
* **`rindex` vs `index`.** Using `index` in the normal case wraps far too early
  (`hello` / `there how are you today` at n=23 instead of the correct split).
* **The no-space rule.** `in a wood, and I --` at n=10 in `frost.txt` exercises the
  long-word path; a line of one long word must be left alone entirely.
* **`splitlines()` not `readlines()`**, so `len(line)` excludes the newline.
* **The space is consumed**, not left trailing. `line[pos+1:]`.
* **Nothing on stdout** — `./q21.py 20 f.txt | wc -c` must be 0.
* **`textwrap` is banned**, explicitly. So is `subprocess`.
* Read fully and close before opening for write.
* Idempotence: running with the same n twice must not change the file the second time.

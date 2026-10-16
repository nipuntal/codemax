# Q30 Walkthrough — Knight's Moves in Python

> **Read this after you have attempted the question.**

Q29 took ~35 lines of shell. This is ~20 lines of Python. Comparing them is the lesson.

---
## PART 1 — TEACH

### Shell → Python, for this problem
| shell | python |
|---|---|
| `seen=" a1 "` + `case` membership | `seen = {'a1'}` + `in` |
| space-separated string as a list | a real `list` / `set` |
| `file_index()` loop over `$files` | `ord(c) - ord('a') + 1` |
| `tr`/`sort`/`tr`/`sed` to sort a list | `sorted(nxt)` |
| `"$a$b"` string building | `chr(...) + str(...)` |

**Python has the data structures the algorithm actually wants.** Shell forces you to
fake sets with strings, which is where most of Q29's length and risk lives.

### `ord` and `chr`
```python
ord('a')          # 97
chr(97)           # 'a'
ord('c') - ord('a') + 1     # 3   -- file letter to 1..8
chr(ord('a') + 3 - 1)       # 'c' -- back again
```
The `- ord('a')` normalises to 0-based, the `+ 1` shifts to 1-based. **Normalise, do the
arithmetic, then denormalise** — the same shape as a Caesar cipher, and it replaces
Q29's two lookup functions entirely.

If the 1-based/0-based shuffle bothers you, work 0-based throughout and only add 1 when
printing. Just be consistent.

### A set for `seen`, a sorted list for the frontier
```python
seen = {start}          # set literal
nxt = set()
...
frontier = sorted(nxt)
```
* `seen` is a **set** — O(1) membership, and `add` on a duplicate is a no-op.
* `nxt` is a **set** so two squares in the frontier reaching the same destination don't
  duplicate it.
* `frontier` is a **sorted list**, because the output must be sorted and because
  iterating a set gives an arbitrary order.

**Never print or iterate a set where order matters.** `sorted()` it.

### `1 <= nc <= 8` — chained comparison
Python lets you write the mathematical form directly. It means
`1 <= nc and nc <= 8` and reads far better than either C-style version.

### The move table as data
```python
MOVES = [(1, 2), (1, -2), (-1, 2), (-1, -2),
         (2, 1), (2, -1), (-2, 1), (-2, -1)]
...
for dc, dr in MOVES:
```
A list of tuples, unpacked in the `for`. Changing the piece — king, knight, or anything
else — is a one-line edit to the table. **Separating the data from the algorithm is what
makes a program adaptable**, and it's why the same 20 lines answer both Q28 and Q29.

### `while frontier:` — truthiness
An empty list is falsy, so the loop ends when the frontier runs dry. No length check
needed.

---
## PART 2 — THE APPROACH

1. `MOVES` table.
2. `frontier = [start]`, `seen = {start}`, print the start.
3. While the frontier is non-empty:
   * for each square, convert to `(c, r)`
   * for each move, compute the destination; skip if off-board or already seen
   * add to `seen` and to `nxt`
   * `frontier = sorted(nxt)`; print if non-empty
4. Compare your output with Q29's — they must be identical.

---
## PART 3 — THE SOLUTION

```python
MOVES = [(1, 2), (1, -2), (-1, 2), (-1, -2),
         (2, 1), (2, -1), (-2, 1), (-2, -1)]

start = sys.argv[1]
frontier = [start]
seen = {start}

print(start)

while frontier:
    nxt = set()
    for square in frontier:
        c = ord(square[0]) - ord('a') + 1
        r = int(square[1])
        for dc, dr in MOVES:
            nc, nr = c + dc, r + dr
            if 1 <= nc <= 8 and 1 <= nr <= 8:
                new = chr(ord('a') + nc - 1) + str(nr)
                if new not in seen:
                    seen.add(new)
                    nxt.add(new)
    frontier = sorted(nxt)
    if frontier:
        print(' '.join(frontier))
```

---
## PART 4 — EDGE CASES & WHAT MARKERS CHECK

* **`seen` includes the start**, and is tested *before* adding to `nxt`.
* **`sorted(nxt)`** — a set has no order.
* **Don't print an empty final line** — `if frontier:`.
* **`int(square[1])`** — the rank character is a string; forgetting `int()` makes
  `r + dr` a TypeError.
* **`a1` must produce 7 lines ending in a lone `h8`.**
* **Diff your output against Q29's.** Two independent implementations agreeing is far
  stronger evidence than either one looking right.

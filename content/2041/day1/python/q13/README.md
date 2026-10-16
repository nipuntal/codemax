# Python Q13 — sets  (control flow)

**Difficulty:** ⭐⭐ · **Target time:** 6 min

---
## LEARN FIRST

A set is an **unordered collection of distinct values**.

```python
s = set()                 # empty set  (NOT {} -- that's an empty dict!)
s = {1, 2, 3}
s.add(4)
s.discard(9)              # remove if present, no error if absent
s.remove(9)               # KeyError if absent
3 in s                    # True -- and this is FAST, unlike `in` on a list
len(s)
sorted(s)                 # a sorted LIST of the members
```

### Set algebra — the reason sets exist
```python
a = {1, 2, 3, 4}
b = {3, 4, 5}

a & b        # {3, 4}        intersection: in BOTH
a | b        # {1,2,3,4,5}   union: in EITHER
a - b        # {1, 2}        difference: in a but NOT b
a ^ b        # {1, 2, 5}     symmetric difference: in exactly one
a <= b       # False         is a a subset of b?
```
Method spellings also exist: `a.intersection(b)`, `a.union(b)`, `a.difference(b)`.

### Deduplicating
```python
list(set(xs))             # distinct, but ORDER IS LOST
sorted(set(xs))           # distinct and sorted  <- usually what you want
```
**Sets have no order.** Never print a set directly in an exam answer — always
`sorted()` it, or your output order is unpredictable.

### The shell equivalents
| shell | python |
|---|---|
| `sort -u`             | `sorted(set(xs))` |
| `comm -12 a b`        | `sorted(a & b)` |
| `comm -23 a b`        | `sorted(a - b)` |

---
## THE TASK

Two files, `a.txt` and `b.txt`, each containing one word per line.

Write `q13.py` that takes exactly two filename arguments and prints:
```
only in FILE1: ...
only in FILE2: ...
in both: ...
total distinct: N
```
Each list is space-separated and **sorted alphabetically**. If a list is empty, print
the label with nothing after the colon and space (i.e. a trailing space is fine — the
test strips it).

If there are not exactly 2 arguments, print `Usage: ./q13.py <file1> <file2>`
to stderr and exit 1.

Test invocation: `./q13.py a.txt b.txt`

---
## HINTS
<details><summary>Hint 1</summary>
`words = set(open(filename).read().split())` reads a whole file into a set of words
in one line.
</details>

## CHECK
```sh
./test.sh
```

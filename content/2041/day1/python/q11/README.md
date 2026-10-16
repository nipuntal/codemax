# Python Q11 — sorting with a key  (control flow)

**Difficulty:** ⭐⭐⭐ · **Target time:** 8 min

---
## LEARN FIRST

```python
sorted(xs)                        # natural order
sorted(xs, reverse=True)          # descending
sorted(xs, key=len)               # by length
sorted(xs, key=str.lower)         # case-insensitive
sorted(xs, key=lambda s: s[1])    # by the 2nd character / element
```

`key=f` means: **sort by `f(item)`, but keep the original items.**

### lambda
```python
lambda x: x * 2
```
is just a nameless one-expression function. `lambda kv: kv[1]` takes an item and
returns its element 1. That's all it is — don't overthink it.

### Sorting tuples and records
```python
people = [("Alice", 72), ("Bob", 91), ("Carol", 72)]

sorted(people)                            # by name, then mark (element order)
sorted(people, key=lambda p: p[1])        # by mark ascending
sorted(people, key=lambda p: -p[1])       # by mark descending
sorted(people, key=lambda p: (-p[1], p[0]))   # mark desc, then name asc
```

**The tuple key is the technique to memorise.** Tuples compare left to right, so
`(-mark, name)` means "highest mark first; ties broken alphabetically". Almost every
"sort by X, ties by Y" exam question is exactly this one line.

Use `-value` for descending numbers so you can still sort strings ascending in the
same key — `reverse=True` would flip *both*.

### Stability
Python's sort is **stable**: equal keys keep their original relative order.
So you can sort twice: sort by the secondary key first, then by the primary.

---
## THE TASK

`students.txt` has lines `NAME COURSE MARK`.

Write `q11.py` printing three sections:

```
By mark:
NAME MARK
...
By name length:
NAME MARK
...
By course then mark:
COURSE NAME MARK
...
```

* **By mark**: highest mark first; ties broken by name alphabetically.
* **By name length**: shortest name first; ties broken by name alphabetically.
* **By course then mark**: course alphabetically; within a course, highest mark first.

Run as: `./q11.py < students.txt`

---
## HINTS
<details><summary>Hint 1</summary>
Store each student as a tuple `(name, course, mark)` in a list.
</details>
<details><summary>Hint 2</summary>
`key=lambda s: (-s[2], s[0])` = mark descending, then name ascending.
</details>

## CHECK
```sh
./test.sh
```

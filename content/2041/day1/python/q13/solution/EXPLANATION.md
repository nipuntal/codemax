# Python Q13 explanation

```python
with open(file1) as f:
    a = set(f.read().split())
```
* `f.read()` → the whole file as one string
* `.split()` → a list of words (newlines are whitespace, so this works per-line too)
* `set(...)` → distinct words

`apple` appears twice in a.txt; the set keeps one.

```python
print(f"only in {file1}: {' '.join(sorted(a - b))}")
```
* `a - b` = in a, not in b
* `sorted(...)` turns the set into an ordered list — **essential**, sets have no
  reliable order
* `' '.join(...)` makes the space-separated string

```python
print(f"total distinct: {len(a | b)}")
```
`a | b` is the union. `len(a) + len(b)` would double-count the shared words.

## The four operators, in one sentence each
* `a & b` — **and**: in both.
* `a | b` — **or**: in either.
* `a - b` — in a, minus anything also in b.
* `a ^ b` — in exactly one (union minus intersection).

## Why sets not lists
`x in some_list` scans the whole list; `x in some_set` is effectively instant. For an
"is this word in the dictionary" question over a big file, a set turns a slow program
into a fast one. That performance point is fair game in a written question.

## The empty-list case
`' '.join([])` is `''`, so the line prints as `in both: ` with a trailing space.
The test strips trailing whitespace, but check the exam's expected output — sometimes
it wants `(none)`.

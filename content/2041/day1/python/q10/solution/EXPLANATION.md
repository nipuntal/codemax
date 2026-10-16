# Python Q10 explanation

```python
grid = [[int(x) for x in line.split()] for line in sys.stdin]
```
A **nested comprehension**. Read it inside-out:
* inner: `[int(x) for x in line.split()]` → one row as a list of ints
* outer: `[ ROW for line in sys.stdin ]` → a list of those rows

If nested comprehensions hurt, write the plain version — it's worth the same marks:
```python
grid = []
for line in sys.stdin:
    grid.append([int(x) for x in line.split()])
```

```python
col_sums = [sum(row[c] for row in grid) for c in range(len(grid[0]))]
```
For each column index `c`, sum `row[c]` across every row. `len(grid[0])` is the number
of columns (assumes the grid is rectangular, which the question promises).

Equivalent with zip:
```python
col_sums = [sum(col) for col in zip(*grid)]
```

## The max scan
```python
        if grid[r][c] > best:
```
A **strict** `>`. With `>=`, a later equal value would overwrite the position and you'd
report the *last* max instead of the first. The question says first — one character
decides the mark.

We seed `best = grid[0][0]` rather than `0`, so the code is still correct if the grid
contained negative numbers.

## Printing a list of numbers
```python
print("row sums:", " ".join(str(x) for x in row_sums))
```
* `join` only accepts strings — `" ".join([1,2,3])` is a TypeError. `str(x)` fixes it.
* `print(a, b)` puts a single space between the arguments, which is exactly the
  `row sums: 21 18 ...` format we need.

Alternative: `print("row sums:", *row_sums)` — `*` unpacks the list into separate
print arguments, and print handles the `str()` and the spaces for you. Neat.

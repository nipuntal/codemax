# Python Q10 — 2D data and nested loops  (control flow)

**Difficulty:** ⭐⭐⭐ · **Target time:** 8 min

---
## LEARN FIRST

A "grid" is just a list of lists:
```python
grid = [
    [1, 2, 3],
    [4, 5, 6],
]
grid[0]        # [1, 2, 3]   -- row 0
grid[0][2]     # 3           -- row 0, column 2
len(grid)      # 2   number of rows
len(grid[0])   # 3   number of columns
```
Index order is **[row][column]**. Say it out loud every time.

### Building a grid from input
```python
grid = []
for line in sys.stdin:
    grid.append([int(x) for x in line.split()])
```
or in one line:
```python
grid = [[int(x) for x in line.split()] for line in sys.stdin]
```

### Iterating
```python
for row in grid:                      # each row is a list
    for value in row:
        ...

for r in range(len(grid)):            # when you need the INDEXES
    for c in range(len(grid[r])):
        print(grid[r][c])
```
Use the first form when you only need values, the second when you need positions.

### Column sums — the useful trick
```python
for c in range(len(grid[0])):
    total = sum(row[c] for row in grid)
```
`row[c] for row in grid` walks **down** a column.

Or transpose the whole thing:
```python
list(zip(*grid))       # [(1,4), (2,5), (3,6)]  rows become columns
```
`zip(*grid)` is a genuinely useful one-liner. `*` unpacks the rows as separate
arguments to `zip`.

---
## THE TASK

`grid.txt` contains a rectangular grid of integers, whitespace-separated,
one row per line.

Write `q10.py` that prints:
```
row sums: A B C ...
col sums: A B C ...
total: T
max: M at (R,C)
```
Row and column sums are space-separated on one line each. `M` is the largest value
in the grid and `(R,C)` its **0-based** row and column. If the max appears more than
once, report the first one found scanning row by row, left to right.

Run as: `./q10.py < grid.txt`

---
## HINTS
<details><summary>Hint 1</summary>
`" ".join(str(x) for x in row_sums)` turns a list of ints into a space-separated
string. `join` needs strings, so the `str(x)` is essential.
</details>
<details><summary>Hint 2</summary>
For the max position, track `best`, `best_r`, `best_c` and use a strict `>` so the
first occurrence wins.
</details>

## CHECK
```sh
./test.sh
```

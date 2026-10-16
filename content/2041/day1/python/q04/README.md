# Python Q4 — lists  (basics)

**Difficulty:** ⭐⭐ · **Target time:** 5 min

---
## LEARN FIRST

```python
xs = [3, 1, 4, 1, 5]

xs.append(9)          # add to the end        -> [3,1,4,1,5,9]
xs[0]                 # 3
len(xs)               # 6
sum(xs)  max(xs)  min(xs)
sorted(xs)            # returns a NEW sorted list
xs.sort()             # sorts xs IN PLACE, returns None
sorted(xs, reverse=True)
xs.count(1)           # 2
1 in xs               # True
xs.reverse()          # in place
list(reversed(xs))    # new list
```

### `sorted()` vs `.sort()` — a classic trap
```python
xs = xs.sort()        # BUG: xs is now None
xs = sorted(xs)       # correct
xs.sort()             # also correct (no assignment!)
```
**If a method changes the object, it returns `None`.** Same for `.append()`,
`.reverse()`, `.extend()`.

### Averages and rounding
```python
avg = sum(xs) / len(xs)        # float division: 3.5
avg = sum(xs) // len(xs)       # integer division: 3
round(3.567, 2)                # 3.57
f"{3.567:.2f}"                 # "3.57"   <- format to 2 decimal places
f"{3.5:.1f}"                   # "3.5"
f"{42:5}"                      # "   42"  right-aligned in width 5
f"{42:<5}|"                    # "42   |" left-aligned
```
`f"{x:.2f}"` is how exam questions ask for "2 decimal places". Learn the syntax:
`{value:width.precisionf}`.

---
## THE TASK

`numbers.txt` has one integer per line.

Write `q04.py` that prints:
```
n: N
sum: S
mean: M
median: D
```
where M is the mean printed to **2 decimal places**, and D is the median
(for an even count, the average of the two middle values, also to 2 decimal places).

Run as: `./q04.py < numbers.txt`

---
## HINTS
<details><summary>Hint 1</summary>
`nums = [int(line) for line in sys.stdin]` — `int()` ignores surrounding whitespace,
so you don't even need `.strip()`.
</details>
<details><summary>Hint 2</summary>
Median: sort first. If `len(nums)` is odd the middle index is `len(nums)//2`.
If even, average the elements at `len//2 - 1` and `len//2`.
</details>

## CHECK
```sh
./test.sh
```

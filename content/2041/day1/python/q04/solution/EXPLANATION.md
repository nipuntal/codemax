# Python Q4 explanation

```python
nums = [int(line) for line in sys.stdin]
```
`int("42\n")` is `42` — `int()` tolerates surrounding whitespace, so no `.strip()`
needed. (It does NOT tolerate an empty string, so a trailing blank line would crash.
If that's a risk: `[int(l) for l in sys.stdin if l.strip()]`.)

```python
nums.sort()
```
In place. Note we do **not** write `nums = nums.sort()` — that would set `nums` to
`None`.

```python
mid = n // 2
if n % 2 == 1:
    median = nums[mid]
else:
    median = (nums[mid - 1] + nums[mid]) / 2
```
* `//` is integer division, `%` is remainder — same as shell's `$(( ))`.
* Odd length 7 → `mid = 3` → index 3 is the 4th of 7. Correct middle.
* Even length 8 → `mid = 4` → average indexes 3 and 4. Correct.

Draw it out on paper with a 4-element list the first time; the off-by-one is the
only hard part of this question.

```python
print(f"mean: {sum(nums) / n:.2f}")
```
* `/` is **float** division (unlike shell, and unlike Python 2).
* `:.2f` inside the f-string formats to exactly 2 decimals, rounding.
* Note the whole expression `sum(nums) / n` sits inside the braces — f-strings take
  arbitrary expressions.

## Format spec mini-reference
```
f"{x:.2f}"     3.57       2 decimals
f"{x:8.2f}"    "    3.57" width 8, right aligned
f"{x:<8.2f}"   "3.57    " left aligned
f"{n:03}"      "007"      zero padded to 3
f"{n:,}"       "1,234"    thousands separator
```

## Or just use `statistics`
```python
import statistics
statistics.median(nums)
statistics.mean(nums)
```
Correct, and fine in the exam — but write the manual version at least once so you
understand the indexing.

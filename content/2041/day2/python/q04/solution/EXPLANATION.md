# Q4 explanation

```python
with open(filename) as f:
    lines = f.readlines()

skip = (len(lines) - n) // 2

for line in lines[skip:skip + n]:
    print(line, end='')
```

## The arithmetic
`L - n` lines are being discarded, half from each end, so `skip = (L - n) // 2`.
The slice `lines[skip : skip + n]` then takes exactly `n` lines starting there.

The problem guarantees `L` and `n` have the same parity, so `L - n` is even and the
`// 2` loses nothing — the result is exactly centred. If the parities could differ
you'd have to state which side gets the extra line, and the spec would say so.

Verified:
| L | n | skip | slice |
|---|---|---|---|
| 7 | 1 | 3 | `[3:4]` |
| 7 | 3 | 2 | `[2:5]` |
| 6 | 2 | 2 | `[2:4]` |
| 0 | 0 | 0 | `[0:0]` |

## `print(line, end='')`
`readlines()` keeps each `\n`. Without `end=''` you'd print two newlines per line and
the output would be double-spaced. This is the single most common Python-filter bug in
the course.

The alternative:
```python
lines = f.read().splitlines()      # no newlines kept
...
    print(line)                    # print supplies them
```
Both correct. Pick one and be consistent — mixing them is what produces the
double-spacing.

## `int(sys.argv[2])`
Command-line arguments are strings. `len(lines) - "3"` is a TypeError. Convert as soon
as you read it, not at the point of use — one conversion, one place to get it wrong.

## Why no special case for the empty file
`skip = (0 - 0) // 2 = 0`, and `lines[0:0]` is the empty list, so the loop body never
runs. Slicing out of range is safe (`[2:99]` just stops at the end), unlike indexing
(`[99]` raises).

That's a general Python habit worth having: **prefer a slice to an index when the
bounds might be degenerate**, and a whole class of edge cases disappears.

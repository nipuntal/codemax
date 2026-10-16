# Q2 explanation

```python
for line in sys.stdin:
    line = line.rstrip('\n')
    n = len(line)
    w = len(line.split())
    print(f"{n} {w}: {line}")
```

## `rstrip('\n')`, specifically
The spec says "trailing newline removed". `rstrip('\n')` removes exactly that.

| method | on `"  hi  \n"` |
|---|---|
| `rstrip('\n')` | `"  hi  "` |
| `rstrip()`     | `"  hi"` |
| `strip()`      | `"hi"` |

All three would pass on *this* data, because none of the lines have leading or trailing
spaces. That's exactly the trap: your code is wrong and the test doesn't catch it, until
the marker's test does. **Write what the spec says.**

## The blank line
Input line 4 is `"\n"` → `""` after stripping → `n = 0`, `w = 0`, and the printed line
is `0 0: ` with a trailing space. That trailing space is part of the required format —
`f"{n} {w}: {line}"` produces it naturally, so don't "tidy" it away.

## `len(line.split())` for words
No argument → split on runs of whitespace, drop empties. `"".split()` is `[]`, so a
blank line gives 0. `"".split(' ')` would be `['']` — length 1, wrong.

## Accumulators
```python
total_lines = total_chars = total_words = 0
```
Chained assignment, safe for immutable values like ints. (Don't do it with lists:
`a = b = []` makes both names refer to the *same* list.)

Initialising before the loop is what makes the empty-input case work — the summary
still prints zeros rather than crashing on an undefined name.

## Character count sanity check
19 + 10 + 16 + 0 + 15 = 60 ✓. When a summary is the sum of things you already printed,
add them up by hand once. It catches off-by-one strip errors immediately.

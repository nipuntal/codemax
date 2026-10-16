# Notes — stripping newlines correctly

## The newline problem
Lines from `sys.stdin` **keep** their trailing `\n`. Three ways to remove it, and they
are **not** interchangeable:

```python
line.rstrip('\n')     # removes ONLY newlines from the right   <- usually correct
line.rstrip()         # removes ALL trailing whitespace
line.strip()          # removes leading AND trailing whitespace
```

If the question says "the line with its newline removed", `rstrip('\n')` is the honest
answer. `strip()` would also delete meaningful leading indentation and trailing spaces,
silently changing both the text and the character count.

Here the spec says *trailing newline removed*, so use `rstrip('\n')` — even though
this data has no leading spaces, and the two would agree. **Match the spec, not the
data.**

## Counting words
```python
len(line.split())
```
`split()` with no argument splits on runs of whitespace and discards empties, so
`"  a   b  "` → `['a','b']` → 2. That matches `wc -w`.

`line.split(' ')` splits on **each** space and would count empty strings. Never use it
for word counting.

## Counting characters
```python
len(line.rstrip('\n'))
```
Do the strip first, then measure. Measuring then subtracting 1 breaks on a final line
with no newline.

## The summary
Accumulate as you go:
```python
lines = chars = words = 0
for line in sys.stdin:
    ...
    lines += 1
    chars += n
    words += w
```
Initialise before the loop. Chained assignment (`a = b = c = 0`) is fine for numbers.

## Edge cases
* The blank line → `""` → 0 characters, 0 words, and the output line ends with
  `0 0: ` (a trailing space before nothing). That's correct — check your expected
  output has it.
* An empty input → no lines, and the summary reads `0 lines, 0 characters, 0 words`.
  Your accumulators must be initialised for that to work.
* A line of only spaces would be 0 words but non-zero characters. Not in this data —
  but predict it.

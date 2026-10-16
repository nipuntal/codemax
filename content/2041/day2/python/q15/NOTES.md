# Notes — run-length grouping over a stream

## `uniq` collapses ADJACENT duplicates only
This is why `sort | uniq` is a pair in shell. Here the input is deliberately unsorted so
that `cat` forms **two separate runs** — one of length 2 at the start and one of length
3 at the end. If your output merges them, you've written a counter instead of a
run-detector.

## The run-detection loop
```python
prev = None        # the original text of the run's first line
prev_key = None    # its comparison form
count = 0

for line in sys.stdin:
    line = line.rstrip('\n')
    key = line.lower() if ignore_case else line
    if key == prev_key:
        count += 1
    else:
        if count:
            emit(prev, count)
        prev, prev_key, count = line, key, 1

if count:
    emit(prev, count)
```

Two things people get wrong:

**1. The final run.** The loop only emits when the run *changes*, so the last run is
still buffered when input ends. **You must emit after the loop.** Forgetting this drops
the last group — and it's invisible on data whose last line is unique-ish.

**2. `if count:` as the "have we started" test.** Using `prev is not None` breaks if a
line is legitimately empty. `count == 0` only before the first line.

## Original vs comparison form, again
Same split as Q5 and Q7: `prev` is what you print, `prev_key` is what you compare.
With `-i`, `Dog` and `dog` are one run and the output shows `Dog` — the **first** line
of the run, as the spec says.

## Right-aligned counts
```python
f"{count:4} {line}"
```
`{n:4}` right-aligns a number in width 4 — numbers default to right-aligned, strings to
left. That reproduces `uniq -c`'s `   2 cat` exactly.

## Combining options
`-c` and `-d` are independent booleans:
```python
if show_dups_only and count == 1:
    continue          # skip
if show_count:
    print(f"{count:4} {line}")
else:
    print(line)
```
Filter first, then format. Trying to do both in one expression gets tangled.

## Edge cases
* Empty input → nothing printed, and the post-loop emit must not fire. `if count:`
  handles it.
* A single line → one run of 1. With `-d`, nothing.
* `-i` merges `Dog`/`dog` into a run of 2, printing `Dog`.
* Two separate runs of `cat` must stay separate — the whole point.
* A blank line in the input is a legitimate value and can form its own run.

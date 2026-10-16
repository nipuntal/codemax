# Q15 explanation

## Option parsing
```python
show_count = '-c' in args
```
When options take no values and order doesn't matter, `'-x' in sys.argv` is the whole
parser. Reach for the `while args[0].startswith('-')` loop (Q11) only when options take
arguments or must precede positionals.

## The run loop
```python
for line in sys.stdin:
    line = line.rstrip('\n')
    key = line.lower() if ignore_case else line
    if count and key == prev_key:
        count += 1
    else:
        if count:
            emit(prev, count)
        prev, prev_key, count = line, key, 1
```
* `key` is the comparison form, `line` the original. `prev` holds the **first** line of
  the run, which is what gets printed — exactly what `uniq` does and what the spec asks.
* `if count and ...` — `count == 0` means we haven't started, so the first line always
  takes the `else` branch and initialises the run.
* The tuple assignment sets all three together, which is how you avoid updating `prev`
  and forgetting `prev_key`.

## The emit after the loop is mandatory
```python
if count:
    emit(prev, count)
```
The loop only emits when a run **ends**, and the last run ends at end-of-input, not at a
change. Without this line the final group — here the run of three `cat`s — silently
disappears.

This is the defining bug of every run-length / grouping problem. If your output is
missing exactly one group at the end, this is why.

## `{count:4}`
Right-aligns in a field of width 4, giving `   2 cat`. Numbers right-align by default,
strings left-align — so `f"{line:4}"` would pad the *other* way. Matching `uniq -c`'s
layout is part of the spec.

## Adjacent, not global
The input has `cat cat … cat cat cat` with other animals between. Two runs, counted 2
and 3 — not one count of 5. A `dict` of counts would give 5 and be wrong. `uniq` is
about **runs**, which is why shell pipelines always `sort` first.

## `-i` picks the first spelling
`Dog` then `dog` is one run whose first line is `Dog`, so `Dog` is printed. Storing the
original alongside the key is what makes that work — normalising `line` itself would
print `dog`.

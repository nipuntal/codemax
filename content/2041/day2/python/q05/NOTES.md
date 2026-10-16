# Notes — normalise for comparison, print the original

This combines the *snap_n* and *distinct_lines* weekly tests. The combination is where
the difficulty is.

## The core idea: two versions of every line
You compare on a **normalised** form but you print the **original**. Keep them separate
in your head and in your variables:

```python
for line in sys.stdin:
    original = line.rstrip('\n')
    key = ' '.join(original.lower().split())
    ...
```

Never overwrite `line` with its normalised form — you'll need the original for the
output, and getting that back is impossible.

## The normalising idiom
```python
' '.join(s.lower().split())
```
Read it as three steps:
* `.lower()` — case-insensitive
* `.split()` — split on runs of whitespace, discarding leading/trailing and empties
* `' '.join(...)` — rejoin with exactly one space

So `"  HELLO    world  "` → `"hello world"`. **`' '.join(s.split())` is the standard
whitespace-normaliser** and it comes up constantly. It handles tabs too.

## Counting and stopping
```python
counts = {}
for line in sys.stdin:
    ...
    counts[key] = counts.get(key, 0) + 1
    if counts[key] == n:
        print(f"Snap: {original}")
        break
```
* Increment **then** test, so the nth occurrence triggers.
* `== n` not `>= n` — with `break` they're equivalent, but `==` states the intent.
* `break` means "stop reading input", which the spec requires. Without it you'd keep
  consuming stdin, which matters when the program is part of a pipeline.

## "Print nothing" on end-of-input
The loop just ends. No `else`, no flag. Falling off the end of the loop *is* the
end-of-input case.

(If you wanted to do something on exhaustion, Python's `for ... else` runs the `else`
only when the loop wasn't `break`-ed — see Q08, where the spec does need it.)

## Edge cases
* `hi` vs `hi hi` vs `hi hi hi` — these are **different** lines. Normalisation collapses
  *whitespace*, not repetition. `hi   HI` normalises to `hi hi`, matching `hi hi`.
* `  HI` normalises to `hi`, matching the earlier `hi`.
* Printing: `Snap:   HI` — the original had two leading spaces after normalisation was
  applied only to the *key*. Note the output keeps them.
* `n = 1` would snap on the very first line.
* A blank line normalises to `""` — a legitimate key. Repeated blanks would snap.

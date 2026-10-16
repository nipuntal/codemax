# Notes — every tie is broken alphabetically, and median parity

This is the *describe_numbers* weekly test, over words instead of numbers. The original
guaranteed an odd count so the median was easy — **this one doesn't**, so you must
handle both parities.

## Every tie says "alphabetically". That rules out `min`/`max`
```python
min(words, key=len)        # returns the FIRST shortest in argument order
```
`min` and `max` return the first extreme they meet, which is input order, not
alphabetical. When the spec specifies a tie-break, **sort instead**:
```python
shortest = sorted(words, key=lambda w: (len(w), w))[0]
longest  = sorted(words, key=lambda w: (-len(w), w))[0]
```
Note `-len(w)` for the longest, so length descends while the alphabetical tie-break
still ascends. `reverse=True` would reverse both and give you the *last* alphabetically.

The same applies to the mode:
```python
mode = sorted(counts.items(), key=lambda kv: (-kv[1], kv[0]))[0][0]
```
`max(counts, key=counts.get)` returns the first maximum in dict order — insertion
order, not alphabetical. Wrong for the same reason.

## Median, both parities
```python
lengths = sorted(len(w) for w in words)
n = len(lengths)
mid = n // 2
if n % 2 == 1:
    median = lengths[mid]
else:
    median = (lengths[mid - 1] + lengths[mid]) / 2
```
Check on paper:
* n=3 → mid=1 → `lengths[1]` — the middle of three ✓
* n=4 → mid=2 → average of `lengths[1]` and `lengths[2]` ✓

## "Unrounded" and the int/float distinction
The expected output shows `mean=4.666666666666667` and `median=5` — note the median
of an odd-length list is an **int**, and prints without a decimal point. But
`median=1.5` for the even case, because `/` always produces a float.

So: `(1 + 2) / 2` is `1.5`, and `(3 + 3) / 2` is `3.0` — which prints as `3.0`, not `3`.
Look at example 2: `median=3`, from an odd count, so it's `lengths[mid]`, an int.
**Getting `3` vs `3.0` right is a real mark.** Don't force types; let the natural
arithmetic produce them, then check against the sample.

`f"{x}"` on a float prints Python's full repr — that is what "unrounded" means. Don't
use `:.2f`.

## Counting
```python
counts = {}
for w in words:
    counts[w] = counts.get(w, 0) + 1
```
`unique = len(counts)` — or `len(set(words))`.

## Edge cases
* One argument → count=1, unique=1, shortest=longest=mode=that word, median = its
  length as an int.
* `a bb a bb` → both words occur twice; mode ties → `a` alphabetically.
* All words the same length → shortest and longest tie on length, decided
  alphabetically.
* `total` is the sum of lengths, which is also `mean * count` — use it to check yourself.

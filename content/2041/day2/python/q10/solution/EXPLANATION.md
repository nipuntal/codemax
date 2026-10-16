# Q10 explanation

## Why `sorted(...)[0]` and never `min`/`max`
```python
shortest = sorted(words, key=lambda w: (len(w), w))[0]
```
`min(words, key=len)` returns the **first** shortest word in argument order. The spec
says ties break alphabetically, which is a different thing. Sorting with a tuple key
encodes both rules and then `[0]` takes the winner.

| goal | key |
|---|---|
| shortest, ties alphabetical | `(len(w), w)` |
| longest, ties alphabetical  | `(-len(w), w)` |
| most frequent, ties alphabetical | `(-count, word)` |

The `-` on the numeric part reverses just that part. `reverse=True` would reverse the
alphabetical tie-break too, handing you the *last* word alphabetically instead of the
first.

## The mode
```python
mode = sorted(counts.items(), key=lambda kv: (-kv[1], kv[0]))[0][0]
```
`counts.items()` yields `(word, count)` pairs, so `kv[1]` is the count and `kv[0]` the
word. The trailing `[0][0]` is "first pair, then its first element" — the word.

`max(counts, key=counts.get)` is the tempting one-liner and it is **wrong here**: it
returns the first maximum in dict insertion order. On `a bb a bb` it gives `a` by luck;
on `bb a bb a` it gives `bb`. Sorting makes it deterministic.

## The median
```python
mid = n // 2
if n % 2 == 1:
    median = lengths[mid]           # an int
else:
    median = (lengths[mid - 1] + lengths[mid]) / 2    # a float
```
The odd branch yields an **int**, so it prints as `3`. The even branch uses `/`, which
always yields a float, so it prints as `1.5` — or `3.0` if the two middles are equal.

That int-vs-float difference is visible in the required output and is a genuine mark.
Don't "helpfully" cast: `int(median)` would break the `1.5` case, and `float(median)`
would print `3.0` where `3` is expected.

## "Unrounded"
```python
print(f"mean={sum(lengths) / n}")
```
No format spec, so Python prints the float's full repr: `4.666666666666667`.
Using `:.2f` would round and fail. When a spec says unrounded, print the value plainly.

## Sanity check
`total` equals `mean × count`. In example 1: 4.666… × 3 = 14 ✓. When a summary line is
derivable from the others, verify it by hand once — it catches a wrong `lengths` list
instantly.

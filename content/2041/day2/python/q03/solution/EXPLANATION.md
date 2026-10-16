# Q3 explanation

```python
args = sys.argv[1:]

counts = {}
for a in args:
    counts[a] = counts.get(a, 0) + 1

print(' '.join(a for a in args if counts[a] == 1))
```

## Two passes, and why
Pass 1 counts. Pass 2 filters. You **cannot** do it in one pass: when you meet the
first `d` you don't yet know there are three of them.

This is the general shape for any "items satisfying a property of the whole input":
count/collect first, decide second. Compare with "print the first occurrence of each",
which *is* a one-pass seen-set problem — the decision there only depends on the past.

## Preserving command-line order
Pass 2 iterates `args`, the original list, so order is preserved exactly.
Iterating `counts` instead would give dict insertion order — which happens to match
here, but stops matching the moment the spec changes to something like "sorted".
Iterate the thing whose order you want.

## `counts.get(a, 0) + 1`
Returns the existing count, or `0` for a key you haven't seen. `counts[a] + 1` raises
`KeyError` on the first occurrence.

`Counter(args)` from `collections` does the same in one line and is fine to use.

## The generator expression inside `join`
```python
' '.join(a for a in args if counts[a] == 1)
```
No square brackets needed — `join` accepts any iterable. `[a for a in args if …]`
is equally correct and marginally clearer if you're not used to generators.

## The empty cases fall out
`./q03.py echo echo echo` → the generator yields nothing → `' '.join(...)` is `''` →
`print('')` emits an empty line. Same for no arguments at all.

Both are exactly what the spec asks for, with **no `if` needed**. Before writing a
special case for "empty", check whether the natural code already handles it — it very
often does, and each `if` you don't write is a bug you can't have.

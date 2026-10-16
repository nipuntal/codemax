# Notes — count first, then filter

This is a twist on the *uniq_echo* weekly test. Read the difference carefully:

| question | `d c b d c a a d` |
|---|---|
| uniq_echo: print the **first occurrence** of each | `d c b a` |
| this one: print args occurring **exactly once**   | `b` |

They need different algorithms. Misreading which one you've got is the main risk.

## "First occurrence" — a seen-set, one pass
```python
seen = set()
out = []
for a in sys.argv[1:]:
    if a not in seen:
        seen.add(a)
        out.append(a)
```

## "Exactly once" — count first, then filter, TWO passes
You cannot decide whether to print `d` when you first see it — you don't yet know it
appears again. So:
```python
counts = {}
for a in sys.argv[1:]:
    counts[a] = counts.get(a, 0) + 1

out = [a for a in sys.argv[1:] if counts[a] == 1]
```
**When the decision about an item depends on the whole input, you need two passes.**
That's the general lesson, and it's why this is harder than it looks.

## Preserving order
The second pass walks `sys.argv[1:]` again, so the output is in command-line order —
not dict order, not sorted order. If you looped over `counts` instead you'd get
insertion order (Python 3.7+) which happens to agree here, but relying on that is
fragile. Iterate the original list.

## Counting
```python
counts[a] = counts.get(a, 0) + 1        # the idiom
```
or
```python
from collections import Counter
counts = Counter(sys.argv[1:])
```
`Counter` is allowed and shorter. Know the manual version too.

`sys.argv.count(a)` inside the loop also works but is O(n²) — fine for a test, sloppy
in general.

## Edge cases
* `echo echo echo` → nothing occurs once → prints an **empty line**, not nothing.
  `' '.join([])` gives `''` and `print('')` gives the newline. No special case needed.
* No arguments → also an empty line.
* `how much wood would a woodchuck chuck` → every word distinct, all printed.
  `wood` and `woodchuck` are **different strings** — substring relationships don't
  matter, only equality.

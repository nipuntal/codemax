# Python Q5 explanation

```python
for line in sys.stdin:
    for word in line.lower().split():
```
A **nested loop**: outer over lines, inner over the words of that line.
`.lower()` before `.split()` folds case for free.

```python
        counts[word] = counts.get(word, 0) + 1
```
The counting idiom. `counts.get(word, 0)` returns the existing count or `0`.
Writing `counts[word] = counts[word] + 1` crashes with `KeyError` the first time you
see a word — this is the #1 dict mistake.

```python
for word in sorted(counts):
```
Iterating a dict gives its **keys**. `sorted()` of that gives the keys in order.
Equivalent, more explicit: `sorted(counts.keys())`.

## The one-liner version
```python
from collections import Counter
counts = Counter(sys.stdin.read().lower().split())
for word in sorted(counts):
    print(word, counts[word])
```
`sys.stdin.read()` slurps everything into one string, and `.split()` on it handles
newlines as whitespace — so the nested loop disappears entirely. Both are correct;
this one is faster to write in an exam.

## Sorting by count instead of alphabetically
```python
for word, n in sorted(counts.items(), key=lambda kv: -kv[1]):
    print(word, n)
```
The `-` gives descending order. Or `reverse=True`. To break ties alphabetically:
`key=lambda kv: (-kv[1], kv[0])` — tuples compare left to right.
That tuple trick answers a lot of "most frequent, ties alphabetical" questions.

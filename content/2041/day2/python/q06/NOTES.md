# Notes — the tuple sort key

This is the *sort_file_lines* weekly test with word count instead of length.

## The one line that answers the whole family
```python
lines.sort(key=lambda l: (len(l.split()), l))
```
`sorted(xs, key=f)` orders by `f(x)`. When `f` returns a **tuple**, Python compares the
tuples element by element — first elements, and only on a tie the second, and so on.

So `(word_count, line)` means:
1. fewest words first
2. ties broken alphabetically by the line itself

**Every "sort by X, ties by Y" question is this one line.** Write it from memory:
```python
key=lambda x: (primary, secondary)
```

## Descending on one key only
You cannot pass `reverse=True` for just one part — it flips the whole comparison. For
numbers, negate:
```python
key=lambda l: (-len(l.split()), l)     # most words first, ties alphabetical
```
For strings you can't negate. Then use the **stable sort** trick: sort by the secondary
key first, then by the primary. Python's sort is stable, so the first ordering survives
within ties.
```python
lines.sort(key=lambda l: l)                       # secondary
lines.sort(key=len, reverse=True)                 # primary
```

## Strip before you sort, or after?
If you keep the `\n` on each line, it sits at the end of the string and affects
alphabetical comparison — `"one\n"` vs `"one two\n"`. In practice `\n` (0x0A) sorts
before every printable character, so results usually match. **Usually is not always.**

Cleanest: strip first, print with plain `print`:
```python
lines = f.read().splitlines()
...
print(line)
```
Now the sort key is exactly the text the spec talks about.

## Counting words
`len(line.split())` — runs of whitespace collapse, empties dropped. A blank line has 0
words and sorts first.

## Edge cases
* `apple zebra` vs `zebra apple` — both 2 words, tie broken alphabetically: `apple…`
  first. This case is what proves your tie-break exists.
* `a a a a` vs `b b b b` — both 4 words, alphabetical.
* `one` / `two` — both 1 word, alphabetical.
* A blank line → 0 words → sorts to the very top.
* Duplicate identical lines → they tie completely and both print. `sort` is not `sort -u`.

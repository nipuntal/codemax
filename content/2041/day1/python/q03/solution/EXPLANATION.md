# Python Q3 explanation

```python
    words = line.split()
```
No argument means: split on **runs** of any whitespace, and drop leading/trailing
whitespace. So `"   lots     of    spaces   here\n"` → `['lots','of','spaces','here']`.
The trailing `\n` disappears too, so you don't even need `.strip()` first.

Contrast `line.split(" ")`, which splits on **each single space**, producing empty
strings for every run. That's the mistake to avoid.

```python
    if not words:
        continue
```
A blank line (or a line of only spaces) gives `[]`. In Python, empty containers are
falsy, so `not []` is `True`. `continue` skips to the next iteration.

Falsy values worth memorising: `0`, `""`, `[]`, `{}`, `None`, `False`.

```python
    print(f"{len(words)} words: {'|'.join(words)}")
```
* `'|'.join(words)` — the **separator** calls `.join`, not the list. It reads
  backwards at first; you get used to it.
* Note the inner quotes are single because the f-string uses double. Mixing quote
  types inside an f-string is required in older Pythons — a common syntax error.

## Building it out if the f-string feels cramped
```python
    joined = "|".join(words)
    print(f"{len(words)} words: {joined}")
```
Just as good. Under exam pressure, prefer the version you can type correctly.

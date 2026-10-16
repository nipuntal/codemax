# Q22 Walkthrough — Isogram Filter

> **Read this after you have attempted the question.**

Warm-up for Q23 (the exam's *balanced words*). Identical skeleton — read lines, split,
filter with a per-word predicate, rejoin — only the predicate differs.

---
## PART 1 — TEACH

### The skeleton for every "remove some words" question
```python
for line in sys.stdin:
    words = line.split()
    print(' '.join(w for w in words if PREDICATE(w)))
```
Three ideas, and they are the whole question:
* `line.split()` — split on **runs** of whitespace, discarding leading/trailing and
  empties. It also removes the trailing `\n` for free, so no `.strip()` is needed.
* the generator expression filters
* `' '.join(...)` puts **one** space between survivors, regardless of how the input was
  spaced

Note what `split()` + `join()` does to the spacing: `1 duck   bulbul` becomes
`1 duck bulbul`. That's why the spec says "separated by a single space" — the
normalisation is part of the answer, not an accident.

### Write the predicate as a named function
```python
def is_isogram(word):
    w = word.lower()
    return len(set(w)) == len(w)
```
Even for one line. It makes the filter read like English, and — crucially — it is
**testable on its own**:
```sh
python3 -c "
from q22 import is_isogram
print(is_isogram('duck'), is_isogram('bulbul'))"
```
When a question is really "implement this predicate", isolate the predicate.

### `len(set(w)) == len(w)` — the distinctness test
A `set` discards duplicates. If the set is the same size as the original, nothing was
discarded, so every character was unique.

This one-liner answers a whole family of questions:
| question | test |
|---|---|
| all characters distinct? | `len(set(w)) == len(w)` |
| any duplicates? | `len(set(w)) < len(w)` |
| all elements of a list distinct? | same test, on the list |

### Case folding: fold once, at the top
```python
w = word.lower()
```
Do it **inside the predicate**, on a local copy. The word you *print* must be the
original (`cDe`, not `cde`) — the lowercasing exists only to make the decision.

That normalise-for-the-test / print-the-original split is a recurring exam pattern.
Overwriting `word` itself is the mistake.

### The empty line
A blank line gives `[]` from `split()`, `' '.join([])` is `''`, and `print('')` emits a
blank line. So blank lines pass through as blank lines with **no special case**. Check
whether the natural code already handles the edge case before writing an `if`.

---
## PART 2 — THE APPROACH

1. Write `is_isogram(word)` first and convince yourself it's right on `duck` (yes),
   `bulbul` (no), `Gaga` (no, once folded), `Bb` (no, once folded).
2. Then the three-line driver loop.

---
## PART 3 — THE SOLUTION

```python
def is_isogram(word):
    w = word.lower()
    return len(set(w)) == len(w)


for line in sys.stdin:
    words = line.split()
    print(' '.join(w for w in words if is_isogram(w)))
```

Line 4 of the data, `aa Bb cDe xyz`:
* `aa` → `{a}` size 1 vs 2 → not an isogram
* `Bb` → folds to `bb` → not an isogram (**this is what "ignore case" buys**)
* `cDe` → `cde`, 3 distinct of 3 → isogram, printed **as `cDe`**
* `xyz` → isogram

→ `4 cDe xyz`

---
## PART 4 — EDGE CASES & WHAT MARKERS CHECK

* **`Bb` must be removed.** If it survives, you forgot `.lower()`.
* **`cDe` must print with its original capitalisation.** If it prints as `cde`, you
  folded the word instead of a copy.
* **The digits are words too.** `1`, `2`, `3`, `4` are single-character words and are
  trivially isograms, so they survive — that's why every output line still starts with
  its number.
* **`3 Sphinx of black quartz judge my vow`** keeps every word — a useful positive
  control. If any word vanishes there, your predicate is too strict.
* **Spacing is normalised to single spaces** by `split()` + `join()`.
* A line where nothing survives prints as an **empty line**, not as nothing.

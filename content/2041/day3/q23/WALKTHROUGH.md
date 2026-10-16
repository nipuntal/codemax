# Q23 Walkthrough — Balanced Words (exam Q10, 8 marks)

> **Read this after you have attempted the question.**

The driver loop is identical to Q22. All the marks are in the predicate.

---
## PART 1 — TEACH

### Decoding the definition
> every character occurs exactly *n* times (for some value of *n*)

The phrase "for some value of n" means **n is not given** — you don't check against a
fixed number. You check that **all the counts are equal to each other**.

Restate it: *count the characters, then ask whether all the counts are the same.*

| word | counts | balanced? |
|---|---|---|
| `Gaga` (→`gaga`) | g:2, a:2 | ✓ all counts are 2 |
| `gauge` | g:2, a:1, u:1, e:1 | ✗ counts differ |
| `duck` | d:1,u:1,c:1,k:1 | ✓ all counts are 1 |
| `wwwwweeeee` | w:5, e:5 | ✓ |
| `wwwwweee` | w:5, e:3 | ✗ |
| `zZz` (→`zzz`) | z:3 | ✓ |
| `tock-tock` | t:2,o:2,c:2,k:2,`-`:1 | ✗ — **the hyphen counts** |

**An isogram (Q22) is just the special case n = 1.** Every isogram is balanced.

### The predicate, in three lines
```python
def is_balanced(word):
    counts = {}
    for c in word.lower():
        counts[c] = counts.get(c, 0) + 1
    return len(set(counts.values())) == 1
```

`len(set(counts.values())) == 1` is the "all values equal" test:
* `counts.values()` — the counts
* `set(...)` — the *distinct* counts
* `== 1` — there's only one distinct count, so they're all the same

**"Are all these values equal?" → `len(set(xs)) == 1`.** Worth memorising alongside
`len(set(xs)) == len(xs)` ("are they all different?") from Q22.

The alternative spellings, all fine:
```python
return len(set(counts.values())) <= 1                   # tolerates the empty word
return all(v == first for v in counts.values())
from collections import Counter
return len(set(Counter(word.lower()).values())) == 1
```
`Counter` is allowed and shorter; the manual dict shows you understand the counting.

### Every character counts, not just letters
`tock-tock` is one word and the `-` is a character in it, occurring **once** while every
letter occurs twice → not balanced. That's why it is in the test data.

Do **not** strip punctuation. The spec defines a word as any run of non-whitespace, and
the counting is over the whole word. `and I --` in `frost.txt` keeps `--` (two hyphens,
count 2, all equal) — check the expected output: the `--` survives.

### Case folding a copy
`word.lower()` inside the predicate; print the original. `Gaga` → counted as `gaga` →
balanced → printed as **`Gaga`**. Same discipline as Q22.

### An empty result is an empty line
Line 2 of `interesting_words.txt` has `2` (balanced) and… look at the output: it prints
just `2`. Line 4 prints just `4`. The rest of the words on those lines are all
unbalanced, and what remains is a line with a single word — not a blank line.

If a line had *no* survivors, `' '.join([])` is `''` and you'd print a blank line. Both
behaviours fall out of the same code with no special case.

---
## PART 2 — THE APPROACH

1. Write `is_balanced` and hand-check it against the six examples in the table above,
   especially `tock-tock` and `zZz`.
2. Reuse the Q22 driver loop verbatim.
3. Run on `interesting_words.txt` and diff against the spec's output — it is the
   designed test, with balanced words at n=1,2,3,5 and near-misses beside them.

---
## PART 3 — THE SOLUTION

```python
def is_balanced(word):
    counts = {}
    for c in word.lower():
        counts[c] = counts.get(c, 0) + 1
    return len(set(counts.values())) == 1


for line in sys.stdin:
    words = line.split()
    print(' '.join(w for w in words if is_balanced(w)))
```

Why the data is chosen as it is:
* `duck` n=1, `Gaga` n=2, `tocktocktock` n=3, `wwwwweeeee` n=5 — four different n values
  all balanced, proving n isn't fixed.
* `goose` (o:2, g:1, s:1, e:1), `baboon`, `bonobo`, `Guage`, `wwwwweee` — near misses.
* `tock-tock` — the punctuation trap.
* `zZz` — the case-folding trap.
* `teammate` (t:2,e:2,a:2,m:2) balanced vs `teammates` (adds s:1) not — one character
  flips it.

---
## PART 4 — EDGE CASES & WHAT MARKERS CHECK

* **`zZz` must survive.** If it doesn't, you forgot `.lower()`.
* **`tock-tock` must be removed.** If it survives, you stripped punctuation before
  counting.
* **`teammate` survives, `teammates` does not.** A good check that you're comparing
  counts to each other and not to 1 or 2.
* **`Gaga` prints with its capital G** — fold a copy, print the original.
* **`--` in `frost.txt` survives** (both characters identical, count 2).
* **Words are split on whitespace only** — `line.split()`, never `re.findall(r'\w+')`,
  which would discard the punctuation the spec wants counted.
* **Single-space output**, so the ragged input spacing is normalised.
* Lines 2 and 4 of `interesting_words.txt` reduce to just their leading digit.

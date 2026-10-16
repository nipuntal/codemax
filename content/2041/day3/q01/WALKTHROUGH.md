# Q1 Walkthrough — Award Names

> **Read this after you have attempted the question.**

---
## PART 1 — TEACH

### The shape of every pipeline question
```
[filter lines] | [extract a field] | [sort / dedupe / count]
```
Three stages, in that order. Filtering first is cheaper and easier to reason about;
extraction must come before sorting, because `sort` and `uniq` work on **whole lines**.

### `cut`
```sh
cut -d'|' -f1       # field 1, fields separated by |
cut -d'|' -f2,3     # fields 2 and 3, delimiter kept between them
cut -d'|' -f3-      # field 3 to the end
```
Two rules:
* `-d` takes **exactly one character**.
* Fields are numbered from **1**, not 0.

### Quoting the pipe
`|` is a shell metacharacter. `cut -d| -f1` is a syntax error — the shell sees a
pipeline. Write `-d'|'` or `-d\|`. **Single-quote anything with shell metacharacters
in it**, every time; it costs nothing and removes a whole class of bugs.

### Dedup
```sh
sort -u        # sort and remove duplicates -- one process
sort | uniq    # identical, two processes
```
`uniq` alone is almost always a bug: **it only collapses *adjacent* duplicate lines**,
so it does nothing useful on unsorted input. If you write `uniq`, check that a `sort`
comes before it.

---
## PART 2 — THE APPROACH

1. What identifies an award name? Field 1.
2. Do you need to filter anything out first? No — every line has an award name.
3. What does "distinct, sorted" mean in filter terms? `sort -u`.

So: extract, then dedupe. Two stages.

Build it incrementally and *look* at each stage:
```sh
cut -d'|' -f1 awards.psv | head
cut -d'|' -f1 awards.psv | sort -u
```

---
## PART 3 — THE SOLUTION

```sh
#!/bin/dash
cut -d'|' -f1 | sort -u
```

* `cut -d'|' -f1` — field 1 is the award name. No filename, so it reads **stdin**,
  which the shell connected to `awards.psv` via `< awards.psv`.
* `sort -u` — sort, discard duplicates.

1033 lines in, 7 out.

---
## PART 4 — EDGE CASES & WHAT MARKERS CHECK

* **Order matters.** `sort -u | cut -d'|' -f1` dedupes whole *records* first, which
  doesn't collapse two different winners of the same award. Extract, **then** dedupe.
* You don't need `cat awards.psv |`. The file is already on stdin, and in the exam the
  data may only ever exist on stdin.
* `awk -F'|' '{print $1}'` works too — but `cut` is simpler and always on the permitted
  list, whereas several weekly tests explicitly ban `awk`. Default to `cut`.
* If a later question asked for *counts*, the third stage becomes `sort | uniq -c`
  instead. Same skeleton.

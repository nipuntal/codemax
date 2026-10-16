# Q11 Walkthrough — The Repeated Integer

> **Read this after you have attempted the question.**

If this took you more than three minutes, the lesson isn't about shell — it's about
**checking whether a tool already does the job** before you build one.

---
## PART 1 — TEACH

### `uniq`'s three modes
Everyone learns `uniq -c`. The other two are just as examinable:

| flag | prints |
|---|---|
| (none) | one copy of each run |
| `-c`   | each run prefixed by its length |
| `-d`   | **only** lines that appeared more than once, once each |
| `-u`   | **only** lines that appeared exactly once |

So "the value that occurs twice" is literally `uniq -d`, and "the values that occur
once" is `uniq -u`. No counting, no filtering, no arithmetic.

Reach for the manual: `man uniq` is 40 lines and contains the answer to this question.
In an exam, `man` is one of the few resources you *are* allowed — use it.

### The `sort` prerequisite, again
**`uniq` only merges *adjacent* lines.** On unsorted input `-d` finds nothing.
`sort -n` first — numeric, because the values are numbers and `sort` is alphabetical by
default. (Plain `sort` would also work for finding duplicates, since grouping doesn't
depend on the order being numeric — but `-n` costs nothing and states your intent.)

### Contrast with Q10
| question | operation | tool |
|---|---|---|
| Q10 missing integer | set **subtraction** against a generated range | `seq` + `comm -23` |
| Q11 repeated integer | **within** the data | `sort` + `uniq -d` |

Q10 needed an external reference set, so it needed `seq` and `comm`. Q11 only compares
the data to itself, so one `sort | uniq -d` does it.

**Ask first: does the answer need information the file doesn't contain?** If yes, you
must generate it. If no, a two-stage pipeline probably suffices.

### "Print nothing" for free, again
`uniq -d` on data with no duplicates outputs nothing. Same lesson as Q10 — the natural
code handles the edge case, so don't write an `if`.

---
## PART 2 — THE APPROACH

1. What does "occurs twice" mean in filter terms? Duplicate adjacent lines after
   sorting.
2. Does a filter already do that? `uniq -d`.
3. What must come first? `sort`.

Done.

---
## PART 3 — THE SOLUTION

```sh
#!/bin/dash
sort -n "$1" | uniq -d
```

* `sort -n "$1"` — numeric sort, reading the file named by the argument.
* `uniq -d` — print only the values that appear more than once, one line each.

`dup_3.txt` has no duplicate → no output.
`dup_4.txt` is just `7\n7\n` → `7`.

---
## PART 4 — EDGE CASES & WHAT MARKERS CHECK

* **`sort` before `uniq`.** Without it, `uniq -d` silently prints nothing on every file
  and you'd swear the script was fine.
* **`uniq -d` prints the value once**, not twice. If you used `sort | uniq -c | grep '2'`
  you'd have to strip the count afterwards — and `grep '2'` would also match the *value*
  `2`. More stages, more ways to be wrong.
* `dup_4.txt` is the minimum case (two lines, both the same). Test it.
* `dup_3.txt` must print nothing.
* Quote `"$1"`.
* Worth knowing the sibling: `sort | uniq -u` answers "which value occurs exactly once",
  which is a different exam question with the same two-stage answer.

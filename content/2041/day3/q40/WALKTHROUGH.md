# Q40 Walkthrough — Longest Streak

> **Read this after you have attempted the question.**

The last and hardest question. It combines grouping (Q8, Q37) with a **run-length scan**,
and the tie-breaking rules are strict.

---
## PART 1 — TEACH

### Step 1: group into sets of years
```python
years_of.setdefault(award, set()).add(int(year))
```
A **set**, because several people win the same award in the same year and you only care
*whether* a year is covered. This is `sort -u` in Python, and skipping it would make
every duplicate look like a continuation of the run.

Then `sorted(years_of[award])` gives an ascending list — you cannot scan for consecutive
runs in a set, because sets have no order.

### Step 2: the running-streak scan
```python
run = 1
run_start = years[0]
longest = 1
long_start = years[0]

for i in range(1, len(years)):
    if years[i] == years[i - 1] + 1:
        run += 1
    else:
        run = 1
        run_start = years[i]
    if run > longest:
        longest = run
        long_start = run_start
```
Four variables, in two pairs:
* **current run**: its length and where it started
* **best run so far**: its length and where it started

Both members of a pair are updated **together**, which is why they sit on adjacent
lines. Updating the length and forgetting the start is *the* bug in this style of
problem.

The loop starts at `i = 1` and compares with `i - 1`, so it never runs off the front.
A one-element list means the loop body never executes and the seeded values (`1`, the
only year) are the answer — **the degenerate case needs no special handling**, which is
why you seed from `years[0]` rather than 0.

### `>` not `>=` — the earliest tie wins
```python
if run > longest:
```
A **strict** `>` means a later run of equal length does **not** replace the recorded one,
so the *earliest* longest run is reported — exactly what the spec asks. Change it to
`>=` and you report the last. One character, one mark.

The same rule applies to the overall `Best:` line:
```python
if longest > best_len:
```
Combined with iterating `sorted(years_of)`, a strict `>` gives you "ties broken
alphabetically" for free — the alphabetically-first award is seen first and never
displaced by an equal.

**Two tie-breaks, both implemented by refusing to overwrite on equality.**

### Deriving the end year
```python
{long_start + longest - 1}
```
A run of `n` years starting at `y` ends at `y + n - 1`, not `y + n`. Check it on a run of
1: `y + 1 - 1 = y`. ✓

Storing the end year separately also works, but deriving it means it can never disagree
with the length.

### Why a set, then a sorted list
```python
years = sorted(years_of[award])
```
The set removed duplicates; `sorted` gives the order the scan needs. Doing it in the
other order — sorting a list with duplicates — would make `years[i] == years[i-1] + 1`
false for a repeated year and silently break every run.

---
## PART 2 — THE APPROACH

1. **Data structure:** `{award: set of years}`. One sentence.
2. For each award (alphabetically): sort its years, run the four-variable scan.
3. Print, deriving the end year from start + length − 1.
4. Track the overall best with a strict `>`.
5. Print the `Best:` line.

Trace a tiny example by hand first — `[1,2,3,7,8]` should give `longest = 3`,
`long_start = 1`. Then `[1,2,7,8]`: both runs are length 2, and the **earliest** (1-2)
must win.

---
## PART 3 — THE SOLUTION

See `solution/q40.py`.

Sanity checks against the data:
* **ACM Turing Award** has no gaps at all → one run of 57 years, 1966-2022.
* **Fields Medal** is awarded every four years → no two consecutive years → every run is
  length 1, and the earliest is 1936.
* The Nobel prizes have wartime gaps, so their longest runs are the stretches between
  them.

Those three cases exercise "no gaps", "all gaps" and "some gaps" respectively — if all
three look right, the scan is almost certainly correct.

The `Best:` line is `Nobel Prize for chemistry (79 years)`, and **three awards tie at
79** (chemistry, medicine and physics — all resuming after the 1940–42 war gap and
running to 2021). Chemistry wins on the alphabetical tie-break, which only happens
because the loop iterates `sorted(years_of)` and uses a strict `>`. Change it to `>=`
and you get physics instead — a one-character difference that this data exposes.

---
## PART 4 — EDGE CASES & WHAT MARKERS CHECK

* **A set of years, not a list.** Multiple winners per year are common in this data;
  duplicates break the consecutive test.
* **`sorted()` before scanning.**
* **`>` not `>=`** in both comparisons, for "earliest" and "alphabetically first".
* **`start + length - 1`** for the end year.
* **Seed from `years[0]`**, so a single-year award reports `1 years (Y-Y)` with no
  special case.
* **`1 years` is not pluralised** — the spec's format, literally.
* **`Fields Medal` must report a streak of 1**, not 0 and not 22. If it says anything
  else, your consecutive test is wrong.
* Iterate `sorted(years_of)` so the per-award lines are alphabetical.

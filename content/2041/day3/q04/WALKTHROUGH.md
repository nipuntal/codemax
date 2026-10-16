# Q4 Walkthrough — Four grep Commands (exam Q1, 10 marks)

> **Read this after you have attempted the question.**

This is the highest-mark question on the paper and it is pure regex. Everything here
generalises to Q14 and Q25.

---
## PART 1 — TEACH

### Reaching field N — the counting problem
Q3 taught `[^|]*` for crossing one field. For field N you need N−1 of them:

```
^[^|]*\|[^|]*\|[^|]*\|Female\|         field 4 is Female
^[^|]*\|([^|]*\|){2}Female\|           the same, using a repeat count
```
`([^|]*\|){2}` means "two repetitions of (a field and its delimiter)". Counting on your
fingers is fine; the `{n}` form is shorter and less error-prone once you trust it.

**Count the delimiters, not the fields.** To reach field 4 you must cross **3** pipes.
Write the line out and mark them:
```
ACM Turing Award | 2006 | Frances E. Allen | Female | United States | 1932
                 1      2                  3        4              5
```
Field 4 sits after pipe 3. So: `^`, field 1, pipe, field 2, pipe, field 3, pipe, then
`Female`.

### When you do NOT need to count
If the value can only plausibly occur in one column, delimiters alone are enough:
```
\|Australia\|
```
This says "some field is exactly `Australia`". Strictly, a winner *named* Australia
would match — but no such row exists and no marker's test data has one. **Prefer the
simplest pattern that cannot be wrong on the actual data**; a 6-field count you get
wrong scores zero, and a short pattern you get right scores full marks.

Use judgement: `\|Female\|` alone would be wrong for question 2, because it doesn't
restrict the award. There you need the anchor *and* the field position.

### Anchoring the last field
The birth year is field 6, the last one, so it ends at `$`:
```
199[0-9]$
```
`$` is doing the same job the trailing `\|` does for a middle field — it stops
`19900` matching. **Every field needs a terminator: a `\|` or a `$`.**

### Numeric ranges are alternation over digit patterns
"1990 to 1999" → `199[0-9]`. Easy, because the range aligns with a digit position.

Ranges that don't align need alternation:
```
19[6-9][0-9]        1960-1999
(19[0-9][0-9]|200[0-9])   1900-2009
(0[1-9]|[12][0-9]|3[01])  01-31
```
**There is no `[1990-1999]`.** A bracket expression is a set of *characters*;
`[1990-1999]` means "one of 1, 9, 0-1, 9, 9" — nonsense that happens to be legal.

### Backreferences — the key to question 4
Inside a **pattern**, `\1` matches *the same text* group 1 matched:
```
([A-Z])[a-z]+ \1\. \1[a-z]+
```
* `([A-Z])` — group 1: the capital that starts the first name
* `[a-z]+` — the rest of the first name
* ` ` — a space
* `\1\.` — **the same capital**, then a literal dot → the middle initial
* ` ` — a space
* `\1[a-z]+` — the same capital again, then the surname

`Amir A. Amos` matches with group 1 = `A`. `Ahmed H. Larsen` does not: `\1` would have
to be `A`, but the initial is `H`.

Note the two different jobs of `\1`:
* in a **pattern** → "match the same text again" (a backreference)
* in a `sed` **replacement** → "insert what group 1 captured"

Backreferences are not strictly in POSIX ERE, but both GNU grep (CSE) and BSD grep
support them, and the exam uses them.

### `\.` for a literal dot
`[A-Z].` matches a capital followed by *any* character. `[A-Z]\.` matches a capital
followed by a full stop. Question 4 is unanswerable without the escape.

---
## PART 2 — THE APPROACH

Work one question at a time and **test with `-c` before committing**:
```sh
grep -cE 'PATTERN' awards.psv
```
A count tells you instantly whether you're in the right ballpark. Then drop `-c` and
eyeball five lines to confirm they're the right *kind* of line.

**Question 1 — Australian.** Which field? Country, field 5. Does anything else contain
`Australia`? No. → `\|Australia\|`. Simplest safe pattern.

**Question 2 — female Turing winner.** Two conditions in two different fields, so you
must connect them positionally. Award is field 1 (anchor `^`), gender is field 4.
Cross fields 2 and 3 with `[^|]*\|`.

**Question 3 — Nobel, born 1990-99.** Award name field 1 starts with `Nobel Prize`;
birth year is field 6, the last. Anchor both ends and cross the four middle fields.

**Question 4 — matching initials.** This one is inside a single field, so delimit it
with `\|` … `\|` and use a backreference for "the same letter three times".

**Sanity-check each answer against a line you can see:**
```sh
grep -E 'PATTERN' awards.psv | head -3
```

---
## PART 3 — THE SOLUTION

```sh
grep -E '\|Australia\|' awards.psv
grep -E '^ACM Turing Award\|[^|]*\|[^|]*\|Female\|' awards.psv
grep -E '^Nobel Prize[^|]*\|([^|]*\|){4}199[0-9]$' awards.psv
grep -E '\|([A-Z])[a-z]+ \1\. \1[a-z]+\|' awards.psv
```
(58, 12, 3 and 6 lines respectively.)

**1.** `\|Australia\|` — a field that is exactly `Australia`. Both delimiters present,
so `Australian Capital Territory` would not match.

**2.** `^ACM Turing Award\|` pins field 1. Then `[^|]*\|` twice crosses the year and the
name. Then `Female\|` — the trailing delimiter matters: without it, a hypothetical
gender `Female-identifying` would match.

**3.** `^Nobel Prize[^|]*\|` matches field 1 for *any* Nobel category (`for physics`,
`for peace`, …) and stops at the first delimiter. `([^|]*\|){4}` crosses fields 2–5.
Then `199[0-9]$` pins the last field.

Count the pipes: field 1 ends at pipe 1, then 4 more pipes take you past fields 2, 3, 4
and 5, leaving you at the start of field 6. ✓

**4.** `\|([A-Z])[a-z]+ \1\. \1[a-z]+\|` — the backreference makes all three initials
the same letter. The delimiters keep the whole match inside the name field.

---
## PART 4 — EDGE CASES & WHAT MARKERS CHECK

* **Every field needs a terminator.** `199[0-9]` without `$` matches the first four
  digits of `19905`. `Female` without `\|` matches a prefix of anything starting with
  `Female`. This is the single most common lost mark.
* **`\|` under `-E`.** Miss one and the pattern becomes an alternation. Symptom: your
  grep returns nearly every line.
* **`\.` not `.`** in question 4.
* **`{4}` needs `-E`.** Without it you'd write `\{4\}`.
* **Single quotes.** `$` and `|` are shell metacharacters.
* The rules ban pipes and other commands, so everything must live in one pattern —
  including "two conditions in different fields", which is exactly why you learn the
  `[^|]*\|` crossing trick.
* Question 3 says *Nobel Prizes*, plural categories. Anchoring on the exact string
  `^Nobel Prize for physics` would miss the peace and chemistry winners. `^Nobel Prize`
  followed by `[^|]*` covers all of them.

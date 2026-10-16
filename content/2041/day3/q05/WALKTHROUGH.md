# Q5 Walkthrough — Surnames of Male Students (exam Q2, 9 marks)

> **Read this after you have attempted the question.**

---
## PART 1 — TEACH

### The universal pipeline skeleton
```
[filter] | [extract] | [order/dedupe]
```
Every enrolment-data question is this. Decide which stage each requirement belongs to
*before* you type anything:

| requirement | stage |
|---|---|
| "of male students" | filter |
| "surnames" | extract |
| "only once" | dedupe |
| "alphabetical order" | sort |

### Filtering on the last field
```sh
grep '|M$'
```
* `$` anchors to the end of line, so this is the **gender** field and not a course code
  containing `M`.
* The leading `|` means the field *starts* here, so a gender of `XM` wouldn't match.
* **Single quotes** — `|` and `$` are both shell metacharacters.

Why no `-E`? Because in a *basic* regex `|` is already a literal character, so
`'|M$'` works as written. With `-E` you would need `grep -E '\|M$'`. Both are correct;
the `-E` version is the safer habit because you never have to remember which mode
you're in.

### Extracting a sub-field: two cuts
The name field is `Surname, Given names` padded with trailing spaces:
```
Thorpe, Ian Augustus             
```
You want `Thorpe`. Two `cut`s, each narrowing the line:
```sh
cut -d'|' -f3      # -> "Thorpe, Ian Augustus             "
cut -d',' -f1      # -> "Thorpe"
```
The second cut stops at the comma, so **the trailing padding never reaches your
output**. That is luck you should notice: if the question had asked for *given* names,
the padding would be directly in the way and you'd need `sed -E 's/ +$//'` or a
`[^ ]+` pattern.

### `sort -u`
Sort and dedupe in one process. Equivalent to `sort | uniq`.

**`uniq` without a preceding `sort` is almost always a bug** — it only collapses
*adjacent* duplicates.

### The dedup question you must always ask
"Printed only once" — once per **what**?

* Here: once per distinct **surname**. Two different students both surnamed `Wang`
  produce one line. So a plain `sort -u` on surnames is right.
* If the question had said "print each *student's* surname once, so two students named
  Wang give two lines", you would need a completely different pipeline: keep
  `zid|name`, `sort -u` on *that*, then extract and sort again.

Read the wording. `Wang` appears in three records from two students and the expected
output has **one** `Wang` — that tells you which rule applies.

---
## PART 2 — THE APPROACH

1. **Filter to male students.** Gender is the last field → `grep '|M$'`.
   Do this first: fewer lines through the rest of the pipeline, and the gender field is
   still present to test.
2. **Get the name field.** `cut -d'|' -f3`.
3. **Get the surname.** `cut -d',' -f1` — everything before the comma.
4. **Dedupe and sort.** `sort -u`.

Build it one stage at a time, checking the line count as you go:
```sh
grep '|M$' enrollments.txt | wc -l                       # 11
grep '|M$' enrollments.txt | cut -d'|' -f3 | head
grep '|M$' enrollments.txt | cut -d'|' -f3 | cut -d',' -f1 | sort -u
```
16 → 11 → 5 tells you the filter and the dedupe both fired.

---
## PART 3 — THE SOLUTION

```sh
#!/bin/dash
grep '|M$' | cut -d'|' -f3 | cut -d',' -f1 | sort -u
```

| stage | on `COMP3311\|3383025\|Thorpe, Ian Augustus  \|3978/3\|M` |
|---|---|
| `grep '\|M$'`   | kept (last field is `M`) |
| `cut -d'\|' -f3`| `Thorpe, Ian Augustus             ` |
| `cut -d',' -f1` | `Thorpe` |
| `sort -u`       | one `Thorpe` in the output |

---
## PART 4 — EDGE CASES & WHAT MARKERS CHECK

* **Anchor the gender.** `grep M` matches `COMP...M...`, every plan code, and the letter
  M anywhere in a name. `grep '|M$'` is the only safe form. This is the mark most often
  lost on this question.
* **`Klum, Mary` is female** — she must not appear. If `Klum` is in your output, your
  filter is matching names.
* **`Wang` appears once**, from two distinct students. Confirms "once per surname".
* **`Steenburgen` must not appear** (female), and `Carey, Mary` **must** (the record is
  male despite the given name — check the data, not your assumptions).
* The rules forbid `;`, `&&` and `||`, so your file contains exactly one pipeline on one
  line. A stray `;` fails the question outright.
* `awk` is banned — this is why you use two `cut`s instead of `awk -F'|' '{split($3,a,",");print a[1]}'`.
* Test on `more_enrollments.txt` too: 25 surnames. A pipeline that works on 16 lines and
  fails on 184 usually got the anchor wrong.

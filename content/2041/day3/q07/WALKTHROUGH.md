# Q7 Walkthrough — Most Common Given Name

> **Read this after you have attempted the question.**

Q5 was "each surname once". This is "each **student** once" — a genuinely different
problem, and the exam alternates between them deliberately.

---
## PART 1 — TEACH

### Dedupe on the student, count on the name
Read the spec again:
> Each **student** counts once, no matter how many courses they are enrolled in.

`Klum, Heidi June Anne` appears in **two** records (COMP3411 and COMP3891). She is one
student and must contribute **one** `Heidi`. But if two *different* students were both
called Heidi, that would be a count of 2.

So you cannot `sort -u` the names — that would merge two different Heidis. And you
cannot skip dedup — that would count Heidi twice.

**The answer: dedupe while the student ID is still attached, then throw it away.**
```
cut -d'|' -f2,3 | sort -u | ...extract the name... | sort | uniq -c
     ^                ^              ^
 keep ID AND name  one line     now drop the ID
                   per student
```
This shape — *keep the key with the value, dedupe, then drop the key* — answers a whole
family of exam questions. Learn it as a shape, not as a command.

### `cut -f2,3` keeps the delimiter
```sh
cut -d'|' -f2,3
```
gives `3863711|Klum, Heidi June Anne            ` — both fields **and the `|` between
them**. That is exactly what you want as a dedup key.

### Extracting the first given name — and the padding trap
The name field is padded:
```
Klum, Heidi June Anne            |
```
You want `Heidi`: the first word after `", "`. If you capture with `(.*)` you get
`Heidi June Anne` plus ten spaces. The fix is a class that **cannot cross a space**:
```sh
sed -E 's/^[0-9]+\|[^,]*, ([^ ]+).*/\1/'
```
* `^[0-9]+\|` — the student ID and its delimiter
* `[^,]*` — the surname (can't cross the comma)
* `, ` — the literal separator
* `([^ ]+)` — **group 1: a run of non-spaces** → stops at `Heidi`
* `.*` — the middle names and the padding, discarded

**"Not the terminator" classes do the parsing.** `[^,]`, `[^ ]`, `[^|]` each stop
exactly where the next literal begins. `.*` is greedy and will run past your delimiter.

### The "most common, ties alphabetical" idiom
```sh
sort | uniq -c | sort -k1,1rn -k2,2 | head -n 1
```
* `sort | uniq -c` — counts.
* `sort -k1,1rn` — key **field 1 only**, **r**everse, **n**umeric → count descending.
* `-k2,2` — key field 2, ascending → the alphabetical tie-break.
* `head -n 1` — the winner.

**`sort -rn | head -n 1` is wrong when there is a tie**: equal counts come out in an
unspecified order, so the answer varies between machines. The two-key form is the whole
point. Per-key flags are glued to the key (`-k1,1rn`), never written separately —
`sort -rn -k2,2` would reverse the *alphabetical* key too.

### Stripping `uniq -c`'s padding
`uniq -c` outputs `      2 Heidi`. To print just the word:
```sh
sed -E 's/^ *[0-9]+ //'
```
**Not** `cut -d' ' -f2`: `cut` treats *each* space as a separator, so the padding
creates six empty fields and you'd print an empty line. This trips up everyone once.

---
## PART 2 — THE APPROACH

1. Filter to female students: `grep '|F$'`.
2. Keep the dedup key with the value: `cut -d'|' -f2,3`.
3. One line per student: `sort -u`.
4. Extract the first given name: one `sed -E` with `[^ ]+`.
5. Count: `sort | uniq -c`.
6. Order with the tie-break: `sort -k1,1rn -k2,2`.
7. Take the winner: `head -n 1`.
8. Strip the count: `sed -E 's/^ *[0-9]+ //'`.

Check the line count after each stage. On `enrollments.txt`: 16 → 5 → 4 → 4 → 4 → 1.
The 5 → 4 drop is Heidi's two records collapsing; if you don't see it, your dedup is on
the wrong key.

---
## PART 3 — THE SOLUTION

```sh
#!/bin/dash
grep '|F$' |
cut -d'|' -f2,3 |
sort -u |
sed -E 's/^[0-9]+\|[^,]*, ([^ ]+).*/\1/' |
sort | uniq -c |
sort -k1,1rn -k2,2 |
head -n 1 |
sed -E 's/^ *[0-9]+ //'
```
(All on one line in your answer file — the pipeline is a single command.)

### Trace it on `enrollments.txt`
The female records are:
```
3860448  Steenburgen, Mary Nell        (COMP4920, COMP2041)   -> 2 records
3863711  Klum, Heidi June Anne         (COMP3411, COMP3891)   -> 2 records
3711611  Klum, Mary                    (COMP3311)             -> 1 record
```
Five records, **three** students. After `cut -f2,3 | sort -u` you have three lines.
Extracting given names gives `Mary`, `Heidi`, `Mary` → counts:
```
   2 Mary
   1 Heidi
```
Answer: **Mary**.

Without the dedup you would have counted Heidi twice as well, giving `2 Mary, 2 Heidi`
— a tie, and the alphabetical tie-break would then have answered `Heidi`. So on this
data a missing `sort -u` gives a *plausible but wrong* answer. That is the worst kind
of bug, and it is exactly what the question is testing.

### The tie-break really fires on the big file
`more_enrollments.txt` has a genuine three-way tie:
```
   2 Lien
   2 Linh
   2 Xiu
```
`sort -k1,1rn -k2,2 | head -n 1` gives `Lien`. Plain `sort -rn | head -n 1` gives
whichever of the three your sort implementation happens to emit first — it may well
pass on your laptop and fail on the marker's.

---
## PART 4 — EDGE CASES & WHAT MARKERS CHECK

* **Dedupe on `zid|name`, not on `name`.** Two different students with the same full
  name must count twice; one student in four courses must count once.
* **`sort -u` in the middle, plain `sort` later.** A `-u` on the final sort would
  destroy the counts.
* **The tie-break.** `sort -rn | head -n 1` passes on data with no tie and fails
  silently on data with one. Always write `-k1,1rn -k2,2`.
* **`[^ ]+` not `(.*)`** for the given name, or the field padding lands in your output.
* **`sed`, not `cut -d' '`,** to strip `uniq -c`'s leading spaces.
* `grep '|F$'` — anchored. `grep F` would match plan codes and names.

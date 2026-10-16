# Notes — counting per key, then filtering on the count

This is the *Students Taking Two Courses* weekly-test shape, with `>= 3` instead of
`== 2`. The change matters — see below.

## The shape
```
[extract the key] | sort | uniq -c | [keep the rows with the right count] | [strip the count] | sort -n
```
You count with `uniq -c`, then you **filter on the count with `grep`**, because a
pipeline can't use `if`.

## Filtering on the count
After `uniq -c` the lines look like:
```
      4 3383025
      1 3364562
```
"exactly two" is easy:
```sh
grep -E '^ *2 '
```
"three or more" is not `^ *[3-9] ` — a student could take 12 courses. You need
"any number that is ≥ 3", which for arbitrary digits is:
```sh
grep -E '^ *([3-9]|[0-9]{2,}) '
```
Read it as: *a single digit 3-9, **or** two-or-more digits (i.e. 10+)*.

**Numeric comparisons in regex are alternation over digit-lengths.** There is no
`>= 3` in a regex. This is the single most useful idea in this question.

If the data is guaranteed small you could get away with `^ *[3-9] `, but say so in a
comment — an autotest with a 10-course student would fail you.

## Watch the leading spaces
`uniq -c` pads. Every pattern you write against its output needs `^ *` (or `^ +`), not
just `^`. Forgetting it is why a "correct-looking" grep silently matches nothing.

## Stripping the count afterwards
```sh
sed -E 's/^ *[0-9]+ //'
```
(Not `cut -d' ' -f2` — the padding creates empty fields. See Q6.)

## Duplicate records
The question counts **courses**, so if the same student appeared twice in the same
course you'd want to dedupe `course|zid` pairs first:
```sh
cut -d'|' -f1,2 | sort -u | cut -d'|' -f2 | sort | uniq -c | ...
```
This data has no such duplicates, so `cut -d'|' -f2` alone works — but the safe
version costs one extra stage and is never wrong. Decide deliberately, don't guess.

## Edge cases
* `3383025` (Thorpe, Ian Augustus) is in COMP3311, COMP3141, COMP3331 → 3 courses ✓
* `5456732` (Wang) is in COMP3331 and COMP4920 → 2 → excluded.
* `sort -n` at the end: the question says *numerical* order.

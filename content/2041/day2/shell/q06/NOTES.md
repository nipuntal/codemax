# Notes — "most common, ties alphabetical" in one pipeline

## The shape
```
grep [the courses] | [dedupe per student] | [extract] | sort | uniq -c | [order] | head -n 1 | [clean]
```

## The tie-break is the whole question
```sh
sort | uniq -c | sort -rn | head -n 1
```
is **wrong** when there's a tie: `sort -rn` leaves equal counts in an unspecified
order, so you might print `Wang` when the answer is `Thorpe`.

You need count descending, then name ascending:
```sh
sort -k1,1rn -k2,2 | head -n 1
```
Same two-key idea as Q4. Per-key flags, glued on. This exact pattern —
`sort -k1,1rn -k2,2 | head -n 1` — answers every "most common, ties alphabetical"
question in the course. Memorise it as one unit.

## Printing only the word
After `uniq -c` and the sort, the line is `      3 Thorpe`. The question wants
`Thorpe`, alone:
```sh
sed -E 's/^ *[0-9]+ //'      # strip padding and count
cut -d' ' -f2                # WRONG -- the padding makes field 1 empty
```
`cut -d' '` treats **each** space as a separator, so `      3 Thorpe` has six empty
fields before the `3`. Getting bitten by this once is a rite of passage. Use `sed`, or
`awk '{print $2}'` if awk is allowed (awk splits on *runs* of whitespace).

## Dedupe-per-student, again
A student in both COMP3311 and COMP3331 must count **once**. Same shape as Q3/Q5:
keep `zid|name`, `sort -u`, then extract.

Order of the grep and the dedupe: grep **first**. You only want to dedupe within the
selected courses — a student in COMP3311 and COMP1917 should still count once for
COMP3311, and filtering first makes that automatic.

## Edge cases
* Ties: run it on `more_enrollments.txt` where the tie-break actually fires.
* `head -n 1` not `head -1` — both work, `-n 1` is POSIX.
* A surname with a space in it (e.g. `Van Damme`) would break `cut -d' ' -f2`.
  This data has none, but `sed -E 's/^ *[0-9]+ //'` handles it anyway. Prefer the
  robust form; it costs nothing.

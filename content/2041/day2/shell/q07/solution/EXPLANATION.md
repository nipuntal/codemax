# Q7 explanation

```sh
cut -d'|' -f1,2 |
sort -u |
cut -d'|' -f2 |
sort | uniq -c |
grep -E '^ *([3-9]|[0-9]{2,}) ' |
sed -E 's/^ *[0-9]+ //' |
sort -n
```

| stage | why |
|---|---|
| `cut -d'|' -f1,2` | keep `COURSE\|ZID` — the thing we're counting |
| `sort -u`         | one line per (course, student) pair, so a duplicated record can't inflate the count |
| `cut -d'|' -f2`   | now just the zID |
| `sort \| uniq -c` | how many courses each student takes |
| `grep -E '^ *([3-9]\|[0-9]{2,}) '` | keep counts ≥ 3 |
| `sed -E 's/^ *[0-9]+ //'` | drop the count |
| `sort -n`         | numerical order, as specified |

## The count filter
```
^ *              start of line, then uniq -c's padding
(                 
  [3-9]          a single digit 3..9
  |              OR
  [0-9]{2,}      two or more digits -> 10 or more
)
' '              the space uniq -c puts between count and value
```
The trailing space is not decoration — without it, `[0-9]{2,}` would happily match the
first two digits of the **zID** on a count-1 line. Anchor the far end of every numeric
match.

For the "exactly two" version of this question the whole filter collapses to
`grep -E '^ *2 '`.

## Why `sort -u` on the pair, not on the zID
```sh
cut -d'|' -f2 | sort | uniq -c        # simpler, and correct on THIS data
```
It counts **records**, not distinct courses. If the input ever contained the same
student twice in one course, that student's count would be wrong. Deduping the
`COURSE|ZID` pair first makes the pipeline say what the question means.

Cost: one `cut` and one `sort -u`. Take it.

## The other trap
`sort -n` at the end, not `sort`. With 7-digit zIDs they agree — but the question said
numerical, and the next dataset might not be so tidy.

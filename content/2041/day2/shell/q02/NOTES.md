# Notes — anchoring a field match, and numeric sort

## Matching "this course" safely
```sh
grep '^COMP2041|'
```
Three things are doing work here:
* `^` anchors to the start of the line, so a course code appearing elsewhere can't
  match.
* The trailing `|` means the field has ended — without it, `^COMP204` would also match
  a hypothetical `COMP20411`.
* **Single quotes.** `|` and `$` are shell metacharacters; single quotes make the
  shell hand the pattern to `grep` untouched.

## Matching either of two courses
```sh
grep -E '^(COMP2041|COMP9044)\|'
```
With `-E`, `|` inside the pattern means *alternation*, so the literal `|` at the end
now has to be escaped as `\|`. That flip catches people out. The alternative avoids
it entirely:
```sh
grep -E '^COMP(2041|9044)'
```

## Numeric vs alphabetic sort
`sort` compares **text** by default:
```
10
9          <- sorts before 10, because '1' < '9'
```
`sort -n` compares numbers. Here every zID is 7 digits, so text order and numeric order
happen to agree — but the question says "numerical order", so write `-n` and mean it.
Marks are lost when the data changes and your `sort` was accidentally right.

`sort -nu` combines numeric + unique.

## Edge cases
* The two target courses are alternatives, not both — a student in either qualifies.
* A student in *both* COMP2041 and COMP9044 must still print once → dedup.
* Field 2 is the ID; `cut -d'|' -f2`.

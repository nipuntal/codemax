# Q6 explanation

```sh
grep -E '^COMP(3311|3331|3411)\|' |
cut -d'|' -f2,3 |
sort -u |
cut -d',' -f1 |
cut -d'|' -f2 |
sort | uniq -c |
sort -k1,1rn -k2,2 |
head -n 1 |
sed -E 's/^ *[0-9]+ //'
```

| stage | result |
|---|---|
| `grep`            | only the three target courses |
| `cut -f2,3`       | `3383025\|Thorpe, Ian Augustus     ` |
| `sort -u`         | one line per student |
| `cut -d',' -f1`   | `3383025\|Thorpe` — stops at the comma |
| `cut -d'\|' -f2`  | `Thorpe` |
| `sort \| uniq -c` | counts |
| `sort -k1,1rn -k2,2` | count desc, surname asc |
| `head -n 1`       | the winner |
| `sed`             | strip padding and count → the bare word |

## The two `cut`s
Doing `cut -d',' -f1` **before** `cut -d'|' -f2` is deliberate: the comma cut also
throws away the trailing spaces (they live after the given names), so the second cut
gets a clean `zid|Surname`. Reversing them works too but leaves you handling padding.

## The tie-break, demonstrated
This data has a genuine **three-way tie**. After the dedupe, the counts are:
```
   2 Klum
   2 Thorpe
   2 Wang
```
* `sort -rn | head -n 1` → **any** of the three, depending on your sort implementation.
  It may well pass on your laptop and fail on the marker's machine. That is the worst
  kind of bug.
* `sort -k1,1rn -k2,2 | head -n 1` → always `Klum`, because among equal counts the
  second key orders the surnames ascending.

Check who those pairs are — it's a good exercise in *why* the dedupe matters:
* Klum: 3863711 (COMP3411) and 3711611 (COMP3311) — two students.
* Thorpe: 3383025 (COMP3311 **and** COMP3331) and 3371161 (COMP3311) — two students,
  but **three records**. Without `sort -u` on `zid|name`, Thorpe would count 3 and
  wrongly win.
* Wang: 5122456 and 5456732, both COMP3331 — two students who share a full name.
  Deduping on the *name* instead of the zID would collapse them to 1.

So this one question punishes both dedup mistakes in opposite directions. Run it with
`sort -u` removed, and again with `cut -d'|' -f3 | sort -u`, and watch the answer
change each time.

## The `cut -d' '` trap
```sh
head -n 1 | cut -d' ' -f2        # gives an empty line
```
`uniq -c` pads with spaces, and `cut -d' '` treats every single space as a separator,
so fields 1..6 are empty strings. `sed -E 's/^ *[0-9]+ //'` deletes "optional spaces,
digits, one space" and leaves the word.

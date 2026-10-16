# Q8 explanation

```sh
cut -d'|' -f2,4 |
sort -u |
cut -d'|' -f2 |
cut -d'/' -f1 |
sort | uniq -c |
sed -E 's/^ *([0-9]+) (.*)$/\2 \1/' |
sort -k2,2rn -k1,1
```

Trace one student through it:
```
COMP3311|3383025|Thorpe, Ian Augustus  |3978/3|M     input (×3 records)
3383025|3978/3                                       cut -f2,4
3383025|3978/3                                       sort -u  (3 -> 1)
3978/3                                               cut -f2
3978                                                 cut -d'/' -f1
      6 3978                                         sort | uniq -c
3978 6                                               sed  (swap + strip padding)
```

## The dedupe is the question
Without `sort -u`, `3978` would count 9 (records) instead of 6 (students).
The key you dedupe on is `zid|program`, so a student in five courses collapses to one
line — but a student in two different programs still contributes to both.
**Dedupe on the pair you're actually counting.**

## The swap-and-strip sed
```
s/^ *([0-9]+) (.*)$/\2 \1/
  ^ *              uniq -c's padding, OUTSIDE the groups -> discarded
  ([0-9]+)         group 1: the count
  ' '              the separator
  (.*)$            group 2: the program code
  \2 \1            print them the other way round
```
One stage strips the padding, splits the fields, and reverses them. Recognising that a
single `s///` can do three jobs is a real exam speed-up.

## Sorting after the swap
The line is now `PROGRAM COUNT`, so the count is field 2:
```
-k2,2rn      key 2 only, reverse, numeric   (count descending)
-k1,1        key 1 only, ascending          (program, tie-break)
```
Sorting before the swap would need `-k1,1rn -k2,2`. Either is fine; just look at the
line you're actually sorting rather than the one in your head.

## `sort -rn` alone would be wrong
Not because of ties in this data — there are none — but because the next test case may
have them, and an unspecified order is a bug even when it happens to pass.

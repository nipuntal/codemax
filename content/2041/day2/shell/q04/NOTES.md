# Notes — counting, tie-breaking, and stripping `uniq -c` padding

## The counting idiom, with a twist
```sh
sort | uniq -c | sort -rn
```
gives you counts, most common first — but `uniq -c` pads:
```
      3 COMP3311
```
The question asks for `3 COMP3311` with **one** space. You must strip the padding.

## Stripping the padding
```sh
sed -E 's/^ +//'
```
`^ +` = one or more spaces at the start of the line, replaced with nothing.

Do this **after** the numeric sort, not before — `sort -n` is happy with the padding,
and if you strip first you're still fine, but stripping last is one less thing to
think about.

## Two-key sorting with mixed directions
"count descending, then course ascending" is:
```sh
sort -k1,1rn -k2,2
```
* `-k1,1rn` — key 1 only, reverse, numeric
* `-k2,2`   — key 2 only, default (ascending, alphabetic)

Per-key flags are glued onto the key: `1,1rn` not `-k1,1 -rn`. Writing `sort -rn -k2`
applies `-rn` to **both** keys, which reverses the course order too. That is the
classic wrong answer here — and with this data it produces visibly wrong output, so
you can catch it.

The fields here are whitespace-separated, so no `-t` is needed.

## Edge cases
* Ties everywhere: six courses have count 1. Without the second key their order is
  unspecified, so your output would be non-deterministic and the autotest would flake.
* A student enrolled twice in the same course would be double-counted — the data has
  no such case, but if a question says "distinct students per course", dedupe
  `course|zid` pairs first (the Q3 shape).
* `sort -rn` on the *padded* text still works, because `-n` skips leading blanks.

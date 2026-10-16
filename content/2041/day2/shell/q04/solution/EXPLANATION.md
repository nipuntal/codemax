# Q4 explanation

```sh
cut -d'|' -f1 | sort | uniq -c | sort -k1,1rn -k2,2 | sed -E 's/^ +//'
```

1. `cut -d'|' -f1` — course codes.
2. `sort` — **required** before `uniq`, which only merges adjacent lines.
3. `uniq -c` — collapse and count → `      3 COMP3311`.
4. `sort -k1,1rn -k2,2` — count descending, course ascending.
5. `sed -E 's/^ +//'` — strip `uniq -c`'s leading padding.

## The two-key sort, decoded
```
-k1,1rn      key = field 1 through field 1, r=reverse, n=numeric
-k2,2        key = field 2 through field 2, defaults (ascending, text)
```
`sort` applies keys left to right and only consults key 2 when key 1 ties.

**Why not `sort -rn`?** Because `-rn` before any `-k` sets the *global* default, so
key 2 would also be reversed and you'd get `COMP4920` before `COMP1927`. Compare:
```sh
cut -d'|' -f1 | sort | uniq -c | sort -rn            # ties in wrong order
cut -d'|' -f1 | sort | uniq -c | sort -k1,1rn -k2,2  # correct
```
Run both. Seeing the difference once is worth more than reading about it.

## Why the `sed` is last
Stripping before the sort would also work (`-n` ignores leading blanks either way), but
doing it last means every earlier stage sees the plain `uniq -c` format you're used to
debugging.

## An alternative that avoids the padding entirely
```sh
cut -d'|' -f1 | sort | uniq -c | sort -k1,1rn -k2,2 | awk '{print $1, $2}'
```
`awk` splits on runs of whitespace, so the padding vanishes for free and `print $1, $2`
re-joins with exactly one space. Slightly cleaner — but check the question's rules;
some weekly tests ban `awk`.

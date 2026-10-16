# Q5 explanation

```sh
cut -d'|' -f2,3 |
sort -u |
grep -E ', [^ ]+ [^ ]+' |
sed -E 's/^.*, [^ ]+ ([^ ]+).*$/\1/' |
sort
```

| stage | lines (enrollments.txt) | why |
|---|---|---|
| `cut -d'|' -f2,3` | 16 | keep zID **and** name — the zID is the dedup key |
| `sort -u`         | 10 | one line per distinct student |
| `grep -E ', [^ ]+ [^ ]+'` | 5 | only students with ≥2 given names |
| `sed -E ...`      | 5 | pull out the second given name |
| `sort`            | 5 | required order — **no `-u`**, duplicates must survive |

## The sed, piece by piece
```
s/^.*, [^ ]+ ([^ ]+).*$/\1/
   ^^^                       everything up to and including the LAST ", "
       [^ ]+                 the first name
             ([^ ]+)         group 1: the middle name
                     .*$     the rest: further middle names AND the padding
```
`[^ ]+` cannot cross a space, so group 1 stops cleanly at the middle name and never
swallows the trailing padding. That is the whole trick — **write the regex so the
junk can't get in, instead of stripping it afterwards.**

`.*` at the front is greedy, but there is only one `", "` per line so it doesn't
matter here. If names could contain commas you'd tighten it to `^[^,]*, `.

## Why the `grep` is not optional
`sed` **prints every line**, changed or not. Drop the `grep` and
`3364562|Carey, Mary` doesn't match the `s///` pattern, so sed passes the whole record
through untouched and it appears in your output as
`3364562|Carey, Mary                      `. Silent corruption.

Rule: *if your `sed` only applies to some lines, `grep` for those lines first* — or
use `sed -n` with an explicit `p`:
```sh
sed -nE 's/^.*, [^ ]+ ([^ ]+).*$/\1/p'
```
`-n` suppresses automatic printing and the `p` flag on `s///` prints only when the
substitution succeeded. That replaces the `grep` **and** the `sed` with one stage —
worth memorising, it's the cleanest answer to this whole family of questions:

```sh
cut -d'|' -f2,3 | sort -u | sed -nE 's/^.*, [^ ]+ ([^ ]+).*$/\1/p' | sort
```

## The other classic wrong answer
```sh
cut -d'|' -f3 | sort -u | ...        # WRONG
```
Deduping on the **name** instead of the zID collapses the two `Wang, Wei` records into
one — fine here since neither has a middle name, but on the first-names version of this
question it costs you a `Wei`. Always dedupe on the ID.

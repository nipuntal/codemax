# Q12 explanation

```sh
tr 'A-Z' 'a-z' | tr -cs 'a-z' '\n' | grep -E '[aeiou]{3}' | sort -u
```

1. `tr 'A-Z' 'a-z'` — fold case first, so everything downstream only deals with `a-z`.
2. `tr -cs 'a-z' '\n'` — every run of non-letters becomes one newline → one word per
   line.
3. `grep -E '[aeiou]{3}'` — keep words with three consecutive vowels.
4. `sort -u` — distinct, sorted.

## `[aeiou]{3}` means three vowels, not three of one vowel
`{3}` repeats the **preceding item**. The preceding item is the whole character class,
so each of the three positions independently matches any vowel. `aei`, `ooo` and `uio`
all match.

If you wanted "the same vowel three times" you'd need a backreference:
`grep -E '([aeiou])\1\1'`.

## Why `-s` on the second `tr` is not optional
Without it:
```
the
aeolian
harp

pompeii
```
Every extra non-letter (the space after a full stop, the newline itself) produces its
own blank line. Those blanks survive `grep` only if… well, they don't match
`[aeiou]{3}`, so here you'd get away with it. But in the general word-frequency
pipeline they don't get filtered and they sort to the top. Always include `-s`.

## Which words match, and why
| word | run |
|---|---|
| `aeolian`      | `aeo` |
| `pompeii`      | `eii` |
| `beauty`       | `eau` |
| `bedouin`      | `ouı` → `oui` |
| `booed`        | `ooe` |
| `queueing`     | `ueu` (and `uei`) |
| `hawaiian`     | `aii` |
| `onomatopoeia` | `oei` … and `eia` |

`abstemious` and `facetious` both end `ious` → `iou` ✓ — they're in the file, so check
whether they're in your output. If they aren't, your `grep` is wrong.
`hawaii` also matches (`aii`) — it appears in the text as `Hawaii,` so the `tr` split
strips the comma and it prints as its own word.

## `sort -u` vs `sort | uniq`
Identical. `-u` is one process and the idiomatic answer.

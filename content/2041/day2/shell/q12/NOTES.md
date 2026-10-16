# Notes — splitting into words, then matching a pattern

## The two-stage shape
"Find the *words* that …" is always:
```
[split into one word per line] | [grep the pattern] | [tidy]
```
Never try to match words in place — you'd have to handle the surrounding punctuation
in the same regex, and `grep` prints whole lines anyway.

## Splitting into words
```sh
tr -cs 'a-zA-Z' '\n'
```
* `'a-zA-Z'` — the letters
* `-c` — **complement**: operate on everything that is *not* a letter
* `-s` — **squeeze**: a run of them collapses to one output character
* `'\n'` — replace with a newline

So every run of non-letters becomes exactly one newline → one word per line.
Without `-s`, `". "` produces two newlines and you get blank lines in your output —
which then sort to the top and look like a mystery bug.

## Three consecutive vowels
```sh
grep -E '[aeiouAEIOU]{3}'
```
`{3}` means three of the *preceding item*, and the preceding item is the character
class — so it means "three vowels in a row", not "three of the same vowel". That
distinction confuses people; `[abc]{3}` matches `abc`, `aaa`, `cab`, anything.

Because the question is case-insensitive it's simpler to lowercase first and then use
`[aeiou]{3}`:
```sh
tr 'A-Z' 'a-z' | tr -cs 'a-z' '\n' | grep -E '[aeiou]{3}'
```
**Lowercase before splitting** so the split only needs to know about `a-z`.

## Order of operations
```
tr lowercase | tr split | grep | sort -u
```
* lowercase first, so both `tr` and `grep` get simpler
* `sort -u` last — "distinct words, sorted"

## Edge cases
* `Pompeii` — the run is `ei` then `i`: `eii`. Three vowels ✓
* `queueing` — `ueuei` contains `ueu`. ✓
* `beauty` — `eau`. ✓
* `abstemious` — the vowels are `a…e…i o u`: `iou` at the end is three in a row ✓ …
  but check `facetious` too. Predict both before you run it.
* `Hawaii` vs `Hawaiian` — `waii` has `aii` ✓ for both, and they are **different
  words**, so both print. `sort -u` dedupes identical words, not similar ones.
* Words appearing twice (`Pompeii`, `beauty`, `booed`) must print once → `-u`.
* `London`, `Sydney` — no vowel runs, correctly dropped.

## A common wrong answer
```sh
grep -Eo '[a-z]*[aeiou]{3}[a-z]*'
```
`grep -o` prints matching *parts*, which looks like it splits into words — but it only
prints the matched substring, and getting the word boundaries right is fiddlier than
just using `tr`. Use `tr` to split; use `grep` to select.

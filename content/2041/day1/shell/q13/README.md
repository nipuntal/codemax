# Shell Q13 — capture groups and backreferences  (single regex)

**Difficulty:** ⭐⭐⭐⭐ · **Target time:** 8 min

---
## LEARN FIRST

Round brackets **capture** part of a match so you can reuse it in the replacement.

```sh
sed -E 's/(A)(B)/\2\1/'
```
* `(A)` is group **1**, `(B)` is group **2**
* In the replacement, `\1` and `\2` mean "whatever those groups matched"

### The canonical example — swapping two fields
```sh
echo "Smith,John" | sed -E 's/(.*),(.*)/\2 \1/'
```
→ `John Smith`

Decoding:
* `(.*)` group 1 = everything before the comma
* `,`    literal comma
* `(.*)` group 2 = everything after
* replacement `\2 \1` = group 2, a space, group 1

### Greedy matching — the trap
`.*` is **greedy**: it takes as much as it can. With input `a,b,c`:
* `s/(.*),(.*)/\2 \1/` → group 1 = `a,b` (up to the LAST comma), group 2 = `c`
  → result `c a,b`

To match up to the **first** comma, forbid commas: `([^,]*)`.
```sh
echo "a,b,c" | sed -E 's/([^,]*),(.*)/\2 \1/'   →  b,c a
```
**"Not this character" classes are how you make regexes non-greedy.** `[^,]*` is the
single most useful idiom in this whole topic.

### Groups in grep too
`grep -E '^(.)\1'` finds lines whose first two characters are the same.
(In grep, `\1` inside the *pattern* is a backreference.)

---
## THE TASK

`names.txt` has lines in the form `LASTNAME, FIRSTNAME` (comma then a single space).

Write a **single sed command** in `q13.sh` that rewrites each line as
`FIRSTNAME LASTNAME`.

```
Smith, Alice   ->  Alice Smith
```

Run as: `./q13.sh < names.txt`

---
## HINTS
<details><summary>Hint 1</summary>
Two capture groups, separated by `, ` in the pattern.
</details>
<details><summary>Hint 2</summary>
`sed -E 's/(...), (...)/\2 \1/'` — replace the `...` with character classes that
can't eat the comma or the space.
</details>

## CHECK
```sh
./test.sh
```

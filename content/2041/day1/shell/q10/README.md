# Shell Q10 — sed substitution  (single regex)

**Difficulty:** ⭐⭐ · **Target time:** 6 min

---
## LEARN FIRST

`sed` is a stream editor. 95% of the time you use exactly one command: `s`.

```sh
sed 's/OLD/NEW/'      replace the FIRST OLD on each line
sed 's/OLD/NEW/g'     replace ALL (g = global) on each line
sed 's/OLD/NEW/gi'    ...case insensitively
sed -E 's/OLD/NEW/g'  use extended regexes (recommended, same as grep -E)
```

Anatomy: `s` / pattern / replacement / flags

### The delimiter trick
The `/` is just a separator — you can use any character. When the text contains
slashes, switch to `|` or `#`:
```sh
sed 's|/usr/local|/opt|'      much nicer than s/\/usr\/local/\/opt/
```
This is a real exam time-saver.

### Special characters in the REPLACEMENT
* `&`  — the whole matched text
* `\1` `\2` — capture groups (see Q13)
* `\n` — newline (GNU); avoid if you can

```sh
echo "hello" | sed 's/l+/[&]/'      # not quite: needs -E for +
echo "hello" | sed -E 's/l+/[&]/'   # hel[ll]o
```

### Deleting with s
Replacing with nothing deletes:
```sh
sed 's/ *$//'        strip trailing spaces
sed -E 's/^[0-9]+ //'  strip a leading number and space
```

---
## THE TASK

`prices.txt` has lines like:
```
Widget costs 1500 dollars
```
Write a **single sed command** in `q10.sh` that converts every occurrence of the word
`dollars` to `AUD`, and puts a `$` in front of every run of digits.

`Widget costs 1500 dollars` → `Widget costs $1500 AUD`

Run as: `./q10.sh < prices.txt`

---
## HINTS
<details><summary>Hint 1</summary>
Two substitutions. You can chain them in one sed with `-e` twice, or with a semicolon:
`sed -E 's/a/b/; s/c/d/'`
</details>
<details><summary>Hint 2</summary>
`&` in the replacement means "whatever I just matched". So `s/[0-9]+/$&/g`.
Careful: inside single quotes `$` is safe.
</details>

## CHECK
```sh
./test.sh
```

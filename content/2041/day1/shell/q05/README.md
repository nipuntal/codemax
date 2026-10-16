# Shell Q5 — grep options  (single pipeline)

**Difficulty:** ⭐⭐ · **Target time:** 5 min

---
## LEARN FIRST

`grep` flags you must know cold:

| flag | meaning |
|---|---|
| `-i` | case **i**nsensitive |
| `-v` | in**v**ert: print lines that DON'T match |
| `-c` | **c**ount matching lines (print a number, not the lines) |
| `-w` | match whole **w**ords only |
| `-n` | prefix each line with its line **n**umber |
| `-l` | list only the **f**ilenames that match (with multiple files) |
| `-E` | use **E**xtended regular expressions (see Q9) |
| `-o` | print **o**nly the matched part, one per line |

Combine them freely: `grep -iv error` = lines that don't mention error, any case.

### The `-v` chain
Filtering *out* several things is just several `-v`s:
```sh
grep -v '^#' | grep -v '^$'      # drop comments and blank lines
```
`^#` = starts with `#`. `^$` = a line with nothing between start and end (blank).
That two-command pair is a stock exam answer — memorise it.

---
## THE TASK

`config.txt` is a config file containing comments (lines starting with `#`),
blank lines, and real settings.

Write a **single pipeline** in `q05.sh` that prints only the real settings —
i.e. drop every comment line and every blank line. Keep the original order.

Run as: `./q05.sh < config.txt`

---
## HINTS
<details><summary>Hint 1</summary>
Two `grep -v`s in a row. Quote the patterns with single quotes.
</details>
<details><summary>Hint 2</summary>
A "blank line" here means a line with zero characters: pattern `^$`.
</details>

## CHECK
```sh
./test.sh
```

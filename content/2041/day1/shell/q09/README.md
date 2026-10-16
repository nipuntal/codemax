# Shell Q9 — regular expressions: the alphabet  (single regex)

**Difficulty:** ⭐⭐ · **Target time:** 6 min

---
## LEARN FIRST

A regex is a pattern that matches text. Here is **everything** you need:

| pattern | matches |
|---|---|
| `.`        | any single character |
| `^`        | start of line |
| `$`        | end of line |
| `[abc]`    | one of a, b, or c |
| `[a-z]`    | one lowercase letter |
| `[0-9]`    | one digit |
| `[^0-9]`   | one character that is NOT a digit |
| `*`        | 0 or more of the previous thing |
| `+`        | 1 or more (needs `-E`) |
| `?`        | 0 or 1 (needs `-E`) |
| `{3}`      | exactly 3 (needs `-E`) |
| `{2,5}`    | 2 to 5 |
| `(ab|cd)`  | ab or cd (needs `-E`) |
| `\.`       | a literal dot |

**Always use `grep -E`** (extended regex) so `+ ? ( ) { } |` work without backslashes.
**Always single-quote** the pattern so the shell doesn't touch it.

### The two questions to ask yourself
1. *Am I matching the whole line or part of it?*
   `grep -E 'cat'` matches anywhere. `grep -E '^cat$'` means the line is exactly `cat`.
2. *Did I anchor?* Most exam regex questions want `^...$`.

### Worked examples
```
^[A-Z]                  line starts with a capital
[0-9]{4}$               line ends with 4 digits
^z[0-9]{7}$             a UNSW zID and nothing else
^.{10}$                 a line of exactly 10 characters
^[^ ]+$                 a line with no spaces
```

---
## THE TASK

`ids.txt` contains one string per line. A **valid zID** is the letter `z` followed by
exactly 7 digits, and nothing else on the line.

Write a **single command** in `q09.sh` that prints only the valid zIDs.

Run as: `./q09.sh < ids.txt`

---
## HINTS
<details><summary>Hint 1</summary>
`grep -E '...'` — anchor both ends and use `{7}`.
</details>

## CHECK
```sh
./test.sh
```

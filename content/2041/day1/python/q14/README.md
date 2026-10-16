# Python Q14 — regex: search and match  (regex)

**Difficulty:** ⭐⭐ · **Target time:** 6 min

---
## LEARN FIRST

```python
import re
```
The regex **syntax** is the same as `grep -E` (Q9–Q13 of the shell set). Only the
plumbing changes.

### The three "does it match" functions
```python
re.search(pattern, string)      # anywhere in the string       <- use this by default
re.match(pattern, string)       # only at the START
re.fullmatch(pattern, string)   # the ENTIRE string
```
All three return a **match object** (truthy) or `None` (falsy):
```python
if re.search(r'^z\d{7}$', line):
    print(line, end='')
```
This is `grep`. `if not re.search(...)` is `grep -v`.

**COMP2041 asks you to explain the difference between these three.** The answer:
`search` looks anywhere, `match` anchors at the start, `fullmatch` requires the whole
string to match. `re.match(p, s)` ≡ `re.search('^' + p, s)`;
`re.fullmatch(p, s)` ≡ `re.search('^' + p + '$', s)`.

### ALWAYS use raw strings: `r'...'`
```python
re.search(r'\d+', s)      # correct
re.search('\d+', s)       # works by luck, warns in new Pythons
re.search('\\d+', s)      # what you'd otherwise have to write
```
In a normal string `\d` isn't an escape Python knows, and `\n`/`\t`/`\b` are ones it
*does* know and would silently eat. `r'...'` turns off backslash processing.
**Prefix every regex with `r`. No exceptions.**

### Python-only shorthands (nicer than POSIX classes)
| shorthand | means |
|---|---|
| `\d` | `[0-9]` |
| `\w` | `[A-Za-z0-9_]` |
| `\s` | whitespace |
| `\D` `\W` `\S` | the negations |
| `\b` | word boundary |

### Flags
```python
re.search(r'error', line, re.I)     # case insensitive  (re.IGNORECASE)
```

---
## THE TASK

`lines.txt` has one string per line.

Write `q14.py` that classifies each line and prints `LINE -> TYPE`, where TYPE is the
**first** matching category:

| category | rule |
|---|---|
| `zid`   | `z` then exactly 7 digits, whole line |
| `email` | contains an `@` with at least one word character either side |
| `date`  | whole line is `DD/MM/YYYY` |
| `int`   | whole line is an optional `-` then digits |
| `word`  | whole line is letters only |
| `other` | anything else |

Run as: `./q14.py < lines.txt`

---
## HINTS
<details><summary>Hint 1</summary>
Use `re.fullmatch` for the "whole line" rules and `re.search` for "contains".
Strip the line first!
</details>
<details><summary>Hint 2</summary>
An if/elif chain in the order given by the table, since the first match wins.
</details>

## CHECK
```sh
./test.sh
```

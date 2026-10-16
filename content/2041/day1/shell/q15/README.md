# Shell Q15 — for loops  (full script)

**Difficulty:** ⭐⭐ · **Target time:** 7 min

---
## LEARN FIRST

```sh
for x in a b c; do
    echo "$x"
done
```
`for VAR in LIST; do ... done`. The list is just words the shell expands.

### The four lists you'll actually use
```sh
for f in *.txt; do ... done            # every .txt file in this directory (a GLOB)
for a in "$@"; do ... done             # every command-line argument
for i in 1 2 3 4 5; do ... done        # literal list
for i in $(seq 1 10); do ... done      # 1..10  (or bash's: for i in {1..10})
```

**Always write `"$@"` with the quotes.** Unquoted `$@` splits arguments containing
spaces. This is the single most common shell bug.

### C-style loop (bash only, not dash)
```sh
for ((i = 0; i < 10; i++)); do
    echo "$i"
done
```

### Globs
| glob | matches |
|---|---|
| `*`     | any characters (not a leading dot) |
| `*.txt` | files ending .txt |
| `?`     | exactly one character |
| `[abc]*`| starts with a, b, or c |

If a glob matches nothing, the shell leaves it as literal text — so `for f in *.txt`
with no txt files loops once with `f="*.txt"`. Guard with `[ -e "$f" ]` if it matters.

---
## THE TASK

Write `q15.sh` that takes any number of filename arguments and, for each one,
prints:
```
FILENAME: N lines
```
where N is the number of lines in that file.

If a named file does not exist, print `FILENAME: not found` instead (to stdout,
so the test can see it).

Test invocation: `./q15.sh a.txt b.txt nosuch.txt c.txt`

---
## HINTS
<details><summary>Hint 1</summary>
`for f in "$@"; do ... done`
</details>
<details><summary>Hint 2</summary>
`[ -f "$f" ]` is true if `$f` exists and is a regular file.
`wc -l < "$f"` gives a bare number (no filename).
</details>

## CHECK
```sh
./test.sh
```

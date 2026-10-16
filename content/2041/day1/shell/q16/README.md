# Shell Q16 — if / elif / else and grading  (full script)

**Difficulty:** ⭐⭐ · **Target time:** 7 min

---
## LEARN FIRST

```sh
if [ "$n" -ge 85 ]; then
    echo HD
elif [ "$n" -ge 75 ]; then
    echo DN
else
    echo FL
fi
```

Rules that catch everyone:
* `[` is a **command**. It needs spaces: `[ "$n" -ge 85 ]`, never `["$n" -ge 85]`.
* The `;` before `then` is required (or put `then` on its own line).
* `fi` closes `if`, `done` closes loops. (`if`/`fi`, `case`/`esac` — reversed words.)
* **Quote your variables in tests.** If `$n` is empty, `[ $n -ge 85 ]` becomes
  `[ -ge 85 ]` → syntax error. `[ "$n" -ge 85 ]` gives a clean error instead.

### Combining conditions
```sh
if [ "$a" -gt 0 ] && [ "$b" -gt 0 ]; then     # AND
if [ "$a" -gt 0 ] || [ "$b" -gt 0 ]; then     # OR
if ! [ -f "$f" ]; then                        # NOT
```
Use `&&` between two separate `[ ]`s — it's clearer than `-a` / `-o` inside one.

### Testing whether a string looks like a number
```sh
if echo "$x" | grep -Eq '^[0-9]+$'; then ...
```
`grep -q` is quiet: it prints nothing and just sets the exit status. **`if` tests exit
status**, so any command can be a condition:
```sh
if grep -q error log.txt; then echo "found"; fi
```

---
## THE TASK

Write `q16.sh`, which reads marks on **stdin**, one per line, and for each prints:
```
MARK GRADE
```
using:  85+ → `HD`, 75–84 → `DN`, 65–74 → `CR`, 50–64 → `PS`, below 50 → `FL`.

If a line is **not** a non-negative integer, print `MARK invalid` instead.

Run as: `./q16.sh < marks.txt`

---
## HINTS
<details><summary>Hint 1</summary>
Read stdin line by line with:
```sh
while read -r mark; do
    ...
done
```
</details>
<details><summary>Hint 2</summary>
Validate first (`grep -Eq '^[0-9]+$'`), then the if/elif chain. Order the chain from
highest to lowest so each `elif` only needs one comparison.
</details>

## CHECK
```sh
./test.sh
```

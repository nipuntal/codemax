# Shell Q11 — sed line selection: p, d, and ranges  (single regex)

**Difficulty:** ⭐⭐⭐ · **Target time:** 6 min

---
## LEARN FIRST

Every sed command can be prefixed by an **address** saying which lines it applies to.

| form | meaning |
|---|---|
| `sed '3d'`           | delete line 3 |
| `sed '2,5d'`         | delete lines 2–5 |
| `sed '$d'`           | delete the LAST line |
| `sed '/error/d'`     | delete lines matching /error/ |
| `sed '/^#/d'`        | delete comment lines |
| `sed -n '5,9p'`      | print ONLY lines 5–9 |
| `sed -n '/BEGIN/,/END/p'` | print from a BEGIN line to an END line |
| `sed '2,5s/a/b/'`    | substitute, but only on lines 2–5 |
| `sed '/x/!d'`        | `!` = negate → delete lines NOT matching x |

`-n` means "don't auto-print"; then `p` prints explicitly.
So `sed -n '/x/p'` ≈ `grep x`, and `sed '/x/d'` ≈ `grep -v x`.

### The two modes — don't mix them up
* **Without `-n`**: sed prints every line; `d` removes some.
* **With `-n`**: sed prints nothing; `p` adds some back.

Using `p` without `-n` prints matching lines **twice**. That's the classic bug.

---
## THE TASK

`report.txt` contains a header block, then a data section between the marker lines
`--BEGIN--` and `--END--`, then a footer.

Write a **single sed command** in `q11.sh` that prints only the lines **between**
the markers, **not including the marker lines themselves**.

Run as: `./q11.sh < report.txt`

---
## HINTS
<details><summary>Hint 1</summary>
`sed -n '/--BEGIN--/,/--END--/p'` gets the block *including* markers. Now remove them.
</details>
<details><summary>Hint 2</summary>
Pipe into a second sed/grep that drops the marker lines — or do it in one sed by
chaining: `sed -n '/A/,/B/p' | sed '/A/d; /B/d'`. One command is fine either way;
"single command" here means one line, pipes allowed.
</details>

## CHECK
```sh
./test.sh
```

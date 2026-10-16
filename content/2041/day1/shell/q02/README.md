# Shell Q2 — head, tail, and slicing lines  (single pipeline)

**Difficulty:** ⭐ · **Target time:** 4 min

---
## LEARN FIRST

| command | meaning |
|---|---|
| `head -n 5`  | first 5 lines |
| `tail -n 5`  | last 5 lines |
| `tail -n +5` | from line 5 **to the end** (note the `+`) |

`head -5` and `head -n 5` both work, but `-n 5` is the portable/POSIX spelling — use it.

### The classic "print lines M to N" idiom
To print lines 4..6:
```sh
head -n 6 | tail -n 3
```
Read it as: *take the first 6 lines, then keep the last 3 of those.*

The arithmetic is:
* `head -n N`     where N = last line you want
* `tail -n COUNT` where COUNT = N - M + 1

So lines 4..6: N=6, COUNT = 6-4+1 = 3.

**Do this arithmetic on paper first.** Off-by-one here is the #1 way to lose the mark.

---
## THE TASK

`log.txt` has 12 lines. Write a **single pipeline** in `q02.sh` that reads stdin and prints
**lines 5 to 9 inclusive** (5 lines).

Run as: `./q02.sh < log.txt`

---
## HINTS
<details><summary>Hint 1</summary>
`head -n 9` gets you lines 1..9. Now you need the last 5 of those.
</details>

## CHECK
```sh
./test.sh
./test.sh solution
```

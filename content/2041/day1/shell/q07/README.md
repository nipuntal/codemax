# Shell Q7 — sort by a field  (single pipeline)

**Difficulty:** ⭐⭐⭐ · **Target time:** 7 min

---
## LEARN FIRST

Sorting by a **particular column** needs two flags:

```sh
sort -t',' -k3 file      # split on commas, sort by field 3
sort -t',' -k3 -n        # ...numerically
sort -t',' -k3,3 -rn     # ...field 3 ONLY, numeric, descending
```

* `-t CHAR` — the field separator (default: whitespace)
* `-k N`    — sort starting at field N
* `-k N,N`  — sort using **only** field N. Prefer this — plain `-kN` means
  "from field N to the end of line", which changes tie-breaking.

Per-key flags can be glued on: `-k3,3nr` = field 3, numeric, reverse.

Sorting on **whitespace-separated** columns needs no `-t` at all:
```sh
sort -k2,2n            # second whitespace-separated column, numeric
```

### Worked example
```
alice,cs2041,72
bob,cs2041,91
carol,cs2041,65
```
`sort -t',' -k3,3 -rn` →
```
bob,cs2041,91
alice,cs2041,72
carol,cs2041,65
```

---
## THE TASK

`marks.csv` is `zid,name,mark` with a **header line** you must keep at the top.

Write a **single pipeline** in `q07.sh` that prints the header line first, then all
student lines sorted by **mark, highest first**.

Run as: `./q07.sh < marks.csv`

---
## HINTS
<details><summary>Hint 1</summary>
`tail -n +2` gives you everything from line 2 onward (skipping the header).
</details>
<details><summary>Hint 2</summary>
You need to print the header AND the sorted rest. Group two commands so they share
one stdin: `{ head -n 1; sort ...; }`. `head` consumes exactly the first line, then
`sort` reads everything that's left — so you must NOT skip line 1 a second time.
</details>

## CHECK
```sh
./test.sh
```

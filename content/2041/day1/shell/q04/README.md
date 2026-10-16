# Shell Q4 — sort | uniq -c: the counting idiom  (single pipeline)

**Difficulty:** ⭐⭐ · **Target time:** 6 min

---
## LEARN FIRST

This is **the single most important pipeline in the course.** Memorise it:

```sh
sort | uniq -c | sort -rn
```
*"count how many times each distinct line occurs, most common first."*

Why each piece:

| piece | why |
|---|---|
| `sort`      | **`uniq` only collapses ADJACENT duplicate lines.** You must sort first. |
| `uniq -c`   | collapse duplicates, prefix each with its count |
| `sort -rn`  | `-n` = numeric sort (so 10 > 9), `-r` = reverse (biggest first) |

Other `sort` flags you need:
* `sort -n`  numeric (without it, `10` sorts before `9` because it's alphabetical!)
* `sort -r`  reverse
* `sort -u`  sort and remove duplicates (= `sort | uniq`)
* `sort -f`  fold case

### Worked example
Input: `red red blue green blue red` (one per line)
```sh
sort | uniq -c | sort -rn
```
```
      3 red
      2 blue
      1 green
```
Note `uniq -c` pads the count with **leading spaces**. If the expected output has no
padding you must strip it — but usually the expected output keeps it, so don't fight it.

---
## THE TASK

`votes.txt` has one vote (a colour name) per line.

Write a **single pipeline** in `q04.sh` printing the **3 most popular colours**, most
popular first, in `uniq -c` format (count then colour).

Run as: `./q04.sh < votes.txt`

---
## HINTS
<details><summary>Hint 1</summary>
The famous three-command idiom, then one more command to keep only the top 3.
</details>

## CHECK
```sh
./test.sh
```

# Day 3 · Q36 — Award Report  ·  [shell pipeline]  ·  ⭐⭐⭐⭐ · 12 min

Write a shell pipeline in `q36.sh` that reads `awards.psv` on stdin and prints the
**5 award/country pairs with the most winners**, as:
```
COUNT AWARD (COUNTRY)
```
Ordered by count descending, ties by the `AWARD|COUNTRY` text ascending.

```
./q36.sh < awards.psv
17 Nobel Prize for chemistry (Austria)
16 Nobel Prize for chemistry (Australia)
15 Nobel Prize for literature (Switzerland)
13 Nobel Prize for chemistry (Germany)
13 Nobel Prize for physics (Italy)
```

* Single shell pipeline reading stdin.
* No `if`/`while`/`for`, no `&&`/`||`/`;`, no `awk`, no temporary files.

```sh
./test.sh          # then read WALKTHROUGH.md
```

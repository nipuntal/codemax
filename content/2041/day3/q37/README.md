# Day 3 · Q37 — Award Statistics  ·  [python]  ·  ⭐⭐⭐⭐ · 13 min

Write a Python program `q37.py` that reads `awards.psv` on stdin and prints, for each
award (alphabetically):

```
AWARD: N winners, F female, span YYYY-YYYY, oldest winner aged A
```

* `N` — total records for that award
* `F` — how many have gender `Female`
* the span is the earliest and latest award year
* `A` — the greatest value of (award year − birth year) over that award's records

Then a final line:
```
TOTAL: N winners across C awards
```

```
./q37.py < awards.psv
ACM Turing Award: 86 winners, 12 female, span 1966-2022, oldest winner aged 74
Fields Medal: 59 winners, 5 female, span 1936-2022, oldest winner aged 39
...
TOTAL: 1033 winners across 7 awards
```

* Python only, reading stdin. No external programs.

```sh
./test.sh          # then read WALKTHROUGH.md
```

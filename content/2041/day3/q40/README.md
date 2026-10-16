# Day 3 · Q40 — Longest Streak  ·  [python]  ·  ⭐⭐⭐⭐⭐ · 14 min

Write a Python program `q40.py` that reads `awards.psv` on stdin and, for each award
(alphabetically), reports the **longest run of consecutive years** in which it was given:

```
AWARD: longest streak N years (YYYY-YYYY)
```

If several runs tie for longest, report the **earliest**.

Then a final line naming the award with the single longest streak overall
(ties broken alphabetically):
```
Best: AWARD (N years)
```

```
./q40.py < awards.psv
ACM Turing Award: longest streak 57 years (1966-2022)
Fields Medal: longest streak 1 years (1936-1936)
...
Best: Nobel Prize for chemistry (79 years)
```

* An award given in a single year has a streak of 1.
* Python only, reading stdin. No external programs.

```sh
./test.sh          # then read WALKTHROUGH.md
```

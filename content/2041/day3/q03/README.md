# Day 3 · Q3 — Four grep Commands (warm-up)  ·  [grep]  ·  ⭐⭐ · 8 min

Warm-up for the real thing in Q4. Same `awards.psv`:
```
Award Name|Award Year|Winner Name|Winner Gender|Winner Country|Winner Birth Year
```

Edit `q03.txt` and put a **single grep command** on each `ANSWER:` line.

1. Lines for **Fields Medal** winners.
2. Lines for awards given in the **1960s** (award year 1960–1969).
3. Lines for winners from **Japan** (the country field only — not a name that happens
   to contain "Japan").
4. Lines where the winner has a **middle initial** (a single capital letter followed by
   a full stop, between two names).

* Each answer is one `grep` command, including the filename `awards.psv`.
* You may use any grep option **except** `-P/--perl-regexp`.
* No pipes, no redirection, no other commands.

```sh
./test.sh          # then read WALKTHROUGH.md
```

# Day 3 · Q9 — Column Statistics  ·  [shell script]  ·  ⭐⭐ · 8 min

Write a POSIX-compatible shell script `q09.sh` that takes a single command-line
argument, a filename. The file contains one integer per line.

Print exactly three lines:
```
count: C
sum: S
mean: M
```
where `M` is the **integer** mean (integer division), truncated.

```
./q09.sh numbers_1.txt
count: 6
sum: 252
mean: 42
```
```
./q09.sh numbers_2.txt
count: 11
sum: 74
mean: 6
```

* First line of your script must be `#!/bin/dash`.
* You may **not** use `awk`, `bc`, `python`, `perl`.
* You may use `cat`, `wc`, `sort`, `head`, `tail`, `tr`, `paste`, `expr`.
* You may use built-ins: `case cd echo exit for if read shift test while [`
* No error checking necessary.

```sh
./test.sh          # then read WALKTHROUGH.md
```

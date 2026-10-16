# Day 3 · Q1 — Award Names  ·  [shell pipeline]  ·  ⭐ · 4 min

`awards.psv` contains one award per line, six pipe-separated fields:

```
Award Name|Award Year|Winner Name|Winner Gender|Winner Country|Winner Birth Year
Nobel Prize for physics|1921|Albert Einstein|Male|Germany|1879
```

Write a shell pipeline in `q01.sh` that reads `awards.psv` on stdin and prints every
**distinct award name**, one per line, in sorted order.

```
./q01.sh < awards.psv
ACM Turing Award
Fields Medal
Nobel Prize for chemistry
Nobel Prize for literature
Nobel Prize for medicine
Nobel Prize for peace
Nobel Prize for physics
```

* Single shell pipeline, input on stdin.
* No `if`, `while`, `for`, `&&`, `||`, `;`.
* POSIX shell. No Perl/C/Python/awk. No temporary files.

```sh
./test.sh          # then read WALKTHROUGH.md
```

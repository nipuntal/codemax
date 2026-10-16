# Day 3 · Q11 — The Repeated Integer  ·  [shell script]  ·  ⭐⭐⭐ · 10 min

The mirror image of Q10.

Write a POSIX-compatible shell script `q11.sh` that takes a single argument, a filename
containing an unordered list of positive integers, one per line. **At most one integer
occurs twice**; all others occur once.

Print the repeated integer, or nothing if there isn't one.

```
./q11.sh dup_1.txt
58
./q11.sh dup_2.txt
917
./q11.sh dup_3.txt

./q11.sh dup_4.txt
7
```

* At most one line of output.
* `#!/bin/dash`, POSIX only. No Perl/C/Python/awk.
* Permitted external programs: the same list as Q10.

```sh
./test.sh          # then read WALKTHROUGH.md
```

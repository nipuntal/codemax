# Day 3 · Q28 — King's Moves  ·  [shell script]  ·  ⭐⭐⭐⭐ · 14 min

A chessboard is 8×8, squares labelled `a1`..`h8` (file letter `a`–`h`, rank digit
`1`–`8`).

A **king** moves one square in any of the eight directions, staying on the board.

Write a POSIX-compatible shell script `q28.sh` which, given one starting square, prints:

* line 1: the starting square
* line 2: the squares a king can reach from it
* line 3: the **new** squares reachable from line 2's squares
* … and so on, stopping when no new squares can be reached.

Squares on each line are printed in sorted order, separated by a single space.

```
./q28.sh a1
a1
a2 b1 b2
a3 b3 c1 c2 c3
a4 b4 c4 d1 d2 d3 d4
a5 b5 c5 d5 e1 e2 e3 e4 e5
a6 b6 c6 d6 e6 f1 f2 f3 f4 f5 f6
a7 b7 c7 d7 e7 f7 g1 g2 g3 g4 g5 g6 g7
a8 b8 c8 d8 e8 f8 g8 h1 h2 h3 h4 h5 h6 h7 h8
```

* Assume one valid square as the argument.
* Must finish in 60 seconds.
* `#!/bin/dash`, POSIX only. No `awk`/Perl/C/Python.
* Permitted: `cat cut echo grep head printf sed seq sort tail test tr uniq wc`

```sh
./test.sh          # then read WALKTHROUGH.md
```

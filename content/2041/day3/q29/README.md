# Day 3 · Q29 — Knight's Moves  ·  [shell script]  ·  ⭐⭐⭐⭐⭐ · 18 min · **8 marks**

> **This is Question 12 of the COMP2041 practice exam, verbatim.**

Write a POSIX-compatible shell script `q29.sh` which, given a square on the chessboard,
prints in successive lines the squares that can be reached by a knight.

A chessboard is an 8x8 square matrix, labelled:
```
a8 b8 c8 d8 e8 f8 g8 h8
a7 b7 c7 d7 e7 f7 g7 h7
...
a1 b1 c1 d1 e1 f1 g1 h1
```

A knight makes an L-shaped move: two squares horizontally and one vertically, or two
vertically and one horizontally. A move cannot take a knight off the board, so a knight
near the edge has fewer moves. A knight at `d4` can move to `c2, e2, b3, b5, c6, e6, f3,
f5`. A knight at `a1` can move only to `c2` and `b3`.

Your program takes one argument, a starting square, and prints:
* the first line contains only the starting square
* the second line contains squares a knight can move to from the starting square
* the third line contains **new** squares reachable from the second line's squares
* and so on, stopping when no new squares can be reached

Squares on each line are printed in sorted order, separated by a single space.
**Match the output format exactly.**

```
./q29.sh a1
a1
b3 c2
a3 a5 b4 c1 c5 d2 d4 e1 e3
a2 a4 a6 b1 b5 b7 c4 c6 d1 d3 d5 d7 e2 e4 e6 f1 f3 f5 g2 g4
a7 b2 b6 b8 c3 c7 d6 d8 e5 e7 f2 f4 f6 f8 g1 g3 g5 g7 h2 h4 h6
a8 c8 e8 f7 g6 g8 h1 h3 h5 h7
h8
./q29.sh d4
d4
b3 b5 c2 c6 e2 e6 f3 f5
a1 a3 a5 a7 b4 b8 c1 c3 c5 c7 d2 d6 d8 e1 e3 e5 e7 f4 f8 g1 g3 g5 g7 h2 h4 h6
a2 a4 a6 a8 b1 b7 c4 c8 d1 d3 d5 d7 e4 e8 f1 f7 g2 g4 g6 g8 h1 h3 h5 h7
b2 b6 f2 f6 h8
./q29.sh g2
g2
e1 e3 f4 h4
c2 c4 d1 d3 d5 e2 e6 f1 f3 f5 g4 g6 h3 h5
a1 a3 a5 b2 b4 b6 c1 c3 c5 c7 d2 d4 d6 d8 e5 e7 f2 f6 f8 g1 g3 g5 g7 h2 h6 h8
a2 a4 a6 a8 b1 b3 b5 b7 c6 c8 d7 e4 e8 f7 g8 h1 h7
a7 b8
```

* Your program must complete in 60 seconds.
* Assume one command-line argument, a valid square.
* You may create temporary files.
* Permitted external programs: `basename cat chmod cmp cp cut diff dirname echo expr
  false find grep head ls mkdir mktemp mv printf pwd rev rm rmdir sed seq sort stat
  strings tac tail tee test touch tr true uniq wc xargs`
* Built-ins: `case cd exit for if read shift while`
* `#!/bin/dash`, POSIX only. No Perl/C/Python/awk.

```sh
./test.sh          # then read WALKTHROUGH.md
```

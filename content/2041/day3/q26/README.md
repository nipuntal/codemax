# Day 3 · Q26 — Files By Depth  ·  [shell script]  ·  ⭐⭐⭐ · 10 min

Write a POSIX-compatible shell script `q26.sh` which takes one argument, a directory,
and prints how many **regular files** exist at each depth below it, in increasing depth
order:

```
depth D: N
```
Depth 1 means a file directly inside the directory, depth 2 one level down, and so on.
Depths with no files are not printed.

```
find tree
tree
tree/f1
tree/a
tree/a/f2
tree/a/b
tree/a/b/f3
tree/a/b/c
tree/a/b/c/f4
tree/a/b/c/f5
tree/x
tree/x/f6
./q26.sh tree
depth 1: 1
depth 2: 2
depth 3: 1
depth 4: 2
```

* Count only regular files, not directories.
* `#!/bin/dash`, POSIX only. No `awk`. No temporary files.
* Permitted: `basename cat cut dirname echo find grep head printf pwd sed sort tail
  test tr uniq wc`

```sh
./test.sh          # then read WALKTHROUGH.md
```

# Day 3 · Q38 — Word Ladder  ·  [shell script]  ·  ⭐⭐⭐⭐⭐ · 16 min

Two words are **neighbours** if they have the same length and differ in exactly one
letter.

Write a POSIX-compatible shell script `q38.sh` which takes a starting word and a
dictionary filename, and prints the BFS layers of words reachable from the start:

* line 1: the starting word
* line 2: its neighbours in the dictionary
* line 3: the **new** words reachable from line 2's words
* … stopping when no new words can be reached

Words on each line are sorted, separated by a single space.

```
./q38.sh cat words.txt
cat
bat cap cot hat
bag cog cup dot hot lot
big bog dog hop log
top
tip
```

* Assume the starting word is in the dictionary.
* `#!/bin/dash`, POSIX only. No `awk`/Perl/C/Python.
* Permitted: `cat cut echo grep head printf sed seq sort tail test tr uniq wc`

```sh
./test.sh          # then read WALKTHROUGH.md
```

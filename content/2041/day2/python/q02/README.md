# Day 2 · Python Q2 — Line Statistics

**Difficulty:** ⭐⭐ · **Target:** 5 min

Write a Python program `q02.py` that reads lines from standard input and, for each
line, prints:
```
N W: LINE
```
where N is the line's length in characters **not counting the newline**, W is its
number of whitespace-separated words, and LINE is the line with its trailing newline
removed.

After all lines, print a summary:
```
total: L lines, C characters, W words
```

```
./q02.py < input.txt
19 4: the quick brown fox
10 2: jumps over
16 4: the lazy dog ran
0 0: 
15 4: end of the file
total: 5 lines, 60 characters, 14 words
```

* Blank lines count as lines, with 0 characters and 0 words.
* Your answer must be Python only. You may not run external programs.

Read `NOTES.md`.

```sh
./test.sh
```

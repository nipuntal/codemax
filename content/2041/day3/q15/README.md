# Day 3 · Q15 — Squeeze and Strip  ·  [python]  ·  ⭐⭐⭐ · 9 min

Write a Python program `q15.py` implementing a small text cleaner, reading stdin.

Usage: `q15.py [-d CHARS] [-s] [-u]`

Applied in this order to each line (after removing its trailing newline):

* `-d CHARS` — **delete** every character that appears in the string `CHARS`
* `-s` — **squeeze**: replace every run of whitespace with a single space
* `-u` — **upper**: convert to uppercase

Then print the line. Options may appear in any order and any combination.

```
cat messy.txt
Hello,   World!!	How are   you?
line	two   here

   spaced   out   
./q15.py -s < messy.txt
Hello, World!! How are you?
line two here

 spaced out 
./q15.py -d '!,' -s < messy.txt
Hello World How are you?
line two here

 spaced out 
./q15.py -s -u -d 'aeiou' < messy.txt
HLL, WRLD!! HW R Y?
LN TW HR

 SPCD T 
```

* Python only, reading stdin. No external programs.

```sh
./test.sh          # then read WALKTHROUGH.md
```

# Day 2 · Shell Q12 — Words With Three Consecutive Vowels

**Difficulty:** ⭐⭐⭐ · **Target:** 8 min · Format: **single pipeline**

`words.txt` contains prose.

Write a shell pipeline in `q12.sh` that prints every **distinct word** containing three
consecutive vowels, one per line, in sorted order, lowercased.

Vowels are `a e i o u` and their uppercase equivalents. A "word" is a maximal run of
letters.

```
./q12.sh < words.txt
abstemious
aeolian
anxious
beauty
bedouin
booed
facetious
hawaii
hawaiian
onomatopoeia
pompeii
queueing
```

### Rules
Single pipeline, stdin, no `if`/`while`/`for`, POSIX, no other languages.

Read `NOTES.md`.

```sh
./test.sh
```

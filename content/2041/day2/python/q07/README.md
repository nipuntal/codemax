# Day 2 · Python Q7 — Palindrome Echo

**Difficulty:** ⭐⭐⭐ (test level) · **Target:** 8 min

Write a Python program `q07.py` that prints its command-line arguments to standard
output, like `echo`, **except** an argument is printed only if it is a **palindrome**.

An argument is a palindrome if it reads the same forwards and backwards **ignoring
case** and **ignoring any character that is not a letter or digit**.

```
./q07.py racecar hello Level noon test
racecar Level noon
./q07.py

./q07.py "A man, a plan, a canal: Panama" nope "Was it a car or a cat I saw?"
A man, a plan, a canal: Panama Was it a car or a cat I saw?
./q07.py a ab aba abba abcba x!x
a aba abba abcba x!x
./q07.py 12321 12345 "!!!" ""
12321 !!! 
```

* Print one line. A trailing space at the end of the line is acceptable.
* A string with no letters or digits at all (e.g. `!!!`) counts as a palindrome.
* Your answer must be Python only. You may not run external programs.

Read `NOTES.md`.

```sh
./test.sh
```

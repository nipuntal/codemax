# Day 2 · Python Q12 — Scale The Numbers

**Difficulty:** ⭐⭐⭐⭐ (test level) · **Target:** 11 min

Write a Python program `q12.py` that copies its standard input to standard output, but
multiplies every number by a factor given as a command-line argument, printing the
result **rounded to the nearest whole number**. All other text is copied unchanged.

A number is a string of digit characters with an optional decimal point followed by zero
or more further digits. For example `0`, `100`, `3.14159`, `1000.0`, `0.999` and `12345.`
are all numbers. Numbers are never negative and never in exponential form.

```
cat input.txt
I spent $15.50 for 3.3kg of apples yesterday.
Pi is approximately 3.14159
2000 is a leap year, 2001 is not.
Version 12345. and 0.999 and 0
./q12.py 2 < input.txt
I spent $31 for 7kg of apples yesterday.
Pi is approximately 6
4000 is a leap year, 4002 is not.
Version 24690 and 2 and 0
./q12.py 1 < input.txt
I spent $16 for 3kg of apples yesterday.
Pi is approximately 3
2000 is a leap year, 2001 is not.
Version 12345 and 1 and 0
```

* The factor is a positive integer.
* Your answer must be Python only. You may not run external programs.

Read `NOTES.md` — Python's rounding is not the rounding you were taught at school.

```sh
./test.sh
```

# Day 2 · Python Q13 — Caesar Cypher With Digits

**Difficulty:** ⭐⭐⭐⭐ (test level) · **Target:** 11 min

Write a Python program `q13.py` which, given an integer N, prints stdin encrypted with a
Caesar cypher of shift N.

* Each **letter** is replaced by the letter N places later in the alphabet, wrapping
  around at the ends.
* Uppercase and lowercase are shifted **separately** (case is preserved).
* Each **digit** is replaced by the digit N places later, wrapping around 0–9.
* All other characters are unchanged.
* N may be any integer, including negative and larger than 26.

```
./q13.py 13
Hello World
Uryyb Jbeyq
COMP2041 rocks
PBZC5374 ebpxf
```
```
./q13.py -3
Dwwdfn dw gdzq!
Attack at dawn!
```
```
./q13.py 443 | ./q13.py -443
This is the way the world ends
This is the way the world ends
Not with a bang but a whimper 2026
Not with a bang but a whimper 2026
```

* Input is ASCII text.
* Your answer must be Python only. You may not run external programs.

Read `NOTES.md`.

```sh
./test.sh
```
